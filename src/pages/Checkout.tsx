import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Upload, CheckCircle, Copy, QrCode, AlertCircle } from "lucide-react";

interface CartItem {
  id: string;
  title: string;
  price: number;
  sale_price: number | null;
  quantity: number;
  image_url: string | null;
}

interface PaymentMethod {
  id: string;
  name: string;
  slug: string;
  type: "manual" | "api" | "placeholder";
  is_active: boolean;
  icon: string | null;
  description: string | null;
  instructions: string | null;
  custom_note: string | null;
  config: any;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const items: CartItem[] = location.state?.items || [];

  const [step, setStep] = useState<"info" | "payment" | "done">("info");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [methodsLoading, setMethodsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [cryptomusUrl, setCryptomusUrl] = useState<string | null>(null);
  const [binancePayId, setBinancePayId] = useState("895693102");
  const fileRef = useRef<HTMLInputElement>(null);

  const total = items.reduce((sum, i) => sum + (i.sale_price || i.price) * i.quantity, 0);

  // Load active payment methods from DB
  useEffect(() => {
    const load = async () => {
      setMethodsLoading(true);
      const { data } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      setPaymentMethods((data || []) as PaymentMethod[]);

      // Load Binance Pay ID from settings
      const { data: setting } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "binance_pay_id")
        .maybeSingle();
      if (setting?.value) setBinancePayId(setting.value);

      setMethodsLoading(false);
    };
    load();
  }, []);

  if (items.length === 0) {
    return (
      <Layout>
        <div className="py-24 text-center">
          <p className="text-muted-foreground mb-4">No items to checkout.</p>
          <Button variant="outline" onClick={() => navigate("/shop")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
          </Button>
        </div>
      </Layout>
    );
  }

  const createOrder = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Please enter your name and email.");
      return;
    }
    if (!selectedMethod) {
      toast.error("Please select a payment method.");
      return;
    }
    if (selectedMethod.type === "placeholder") {
      toast.error("This payment method is not available yet.");
      return;
    }

    setLoading(true);
    try {
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          customer_name: name.trim(),
          customer_email: email.trim(),
          payment_method: selectedMethod.slug,
          total_amount: total,
          status: "created",
        })
        .select("id")
        .single();

      if (orderErr || !order) throw orderErr;

      const orderItems = items.map((i) => ({
        order_id: order.id,
        product_id: i.id,
        product_title: i.title,
        unit_price: i.sale_price || i.price,
        quantity: i.quantity,
      }));

      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) throw itemsErr;

      setOrderId(order.id);

      if (selectedMethod.type === "api" && selectedMethod.slug === "cryptomus") {
        try {
          const { data: fnData, error: fnErr } = await supabase.functions.invoke("create-cryptomus-invoice", {
            body: { order_id: order.id, amount: total, currency: "USD" },
          });
          if (fnErr) throw fnErr;
          if (fnData?.url) {
            setCryptomusUrl(fnData.url);
            // Update status to processing
            await supabase.from("orders").update({ status: "processing" }).eq("id", order.id);
          } else if (fnData?.error) {
            toast.error(fnData.error);
          }
        } catch {
          toast.error("Cryptomus is not configured yet. Please contact support.");
        }
      }

      setStep("payment");
    } catch (err: any) {
      toast.error("Failed to create order. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) { toast.error("Only JPG and PNG images are allowed."); return; }
    if (file.size > MAX_FILE_SIZE) { toast.error("File size must be under 5MB."); return; }
    setProofFile(file);
  };

  const uploadProof = async () => {
    if (!proofFile || !orderId) return;
    setUploading(true);
    try {
      const ext = proofFile.name.split(".").pop();
      const path = `${orderId}/proof.${ext}`;
      const { error: upErr } = await supabase.storage.from("payment-proofs").upload(path, proofFile, { upsert: true });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("payment-proofs").getPublicUrl(path);
      const { error: updateErr } = await supabase
        .from("orders")
        .update({
          proof_image_url: urlData.publicUrl,
          proof_uploaded_at: new Date().toISOString(),
          status: "processing",
        })
        .eq("id", orderId);
      if (updateErr) throw updateErr;
      setStep("done");
      toast.success("Proof uploaded successfully!");
    } catch (err: any) {
      toast.error("Failed to upload proof. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const isManualMethod = selectedMethod?.type === "manual";

  return (
    <Layout>
      <SEOHead title="Checkout - VBB Store" description="Complete your purchase" />
      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <h1 className="text-2xl font-bold text-foreground mb-8">Checkout</h1>

          {/* Order Summary */}
          <div className="bg-secondary/30 rounded-xl border border-border p-4 mb-8">
            <h3 className="text-sm font-semibold text-foreground mb-3">Order Summary</h3>
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  {item.image_url && <img src={item.image_url} alt={item.title} className="w-10 h-10 rounded object-cover" />}
                  <div>
                    <span className="text-sm font-medium text-foreground">{item.title}</span>
                    <span className="text-xs text-muted-foreground ml-2">×{item.quantity}</span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  ${((item.sale_price || item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-3 mt-2 border-t border-border">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-lg font-bold text-foreground">${total.toFixed(2)}</span>
            </div>
          </div>

          {step === "info" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Customer Info</h3>
                <div>
                  <Label>Full Name *</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="mt-1.5" />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="mt-1.5" />
                </div>
              </div>

              {/* Dynamic Payment Methods */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Select Payment Method</h3>
                {methodsLoading ? (
                  <div className="text-center py-6 text-muted-foreground">Loading payment methods…</div>
                ) : paymentMethods.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">No payment methods available. Please contact support.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {paymentMethods.map((pm) => (
                      <button
                        key={pm.id}
                        onClick={() => setSelectedMethod(pm)}
                        className={`p-4 rounded-xl border-2 text-left transition-colors ${
                          selectedMethod?.id === pm.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        } ${pm.type === "placeholder" ? "opacity-70" : ""}`}
                      >
                        <div className="text-lg font-semibold text-foreground mb-1">
                          {pm.icon} {pm.name}
                        </div>
                        <p className="text-xs text-muted-foreground">{pm.description}</p>
                        {pm.custom_note && (
                          <p className="text-xs text-primary font-medium mt-2">{pm.custom_note}</p>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Placeholder warning */}
              {selectedMethod?.type === "placeholder" && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50 border border-border">
                  <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Coming Soon</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedMethod.instructions || "This payment method is coming soon. Please contact support or choose another option."}
                    </p>
                  </div>
                </div>
              )}

              <Button
                onClick={createOrder}
                disabled={loading || !selectedMethod || selectedMethod.type === "placeholder"}
                className="w-full gap-2"
                size="lg"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Place Order
              </Button>
            </div>
          )}

          {/* API payment (Cryptomus) */}
          {step === "payment" && selectedMethod?.type === "api" && (
            <div className="text-center space-y-6">
              <CheckCircle className="w-12 h-12 text-primary mx-auto" />
              <h3 className="text-xl font-bold text-foreground">Order Created!</h3>
              {cryptomusUrl ? (
                <>
                  <p className="text-muted-foreground">Click below to complete your crypto payment.</p>
                  <Button asChild size="lg" className="w-full">
                    <a href={cryptomusUrl} target="_blank" rel="noopener noreferrer">
                      Pay with {selectedMethod.name}
                    </a>
                  </Button>
                  <p className="text-xs text-muted-foreground">Your order will be automatically confirmed once payment is received, even if you close this page.</p>
                </>
              ) : (
                <p className="text-muted-foreground">
                  {selectedMethod.name} is not configured yet. Please contact us via WhatsApp or Telegram to complete your payment.
                </p>
              )}
            </div>
          )}

          {/* Manual payment (Binance Pay, etc.) */}
          {step === "payment" && isManualMethod && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Send Payment via {selectedMethod!.name}</h3>

              {/* Instructions / Binance specific */}
              {selectedMethod!.slug === "binance" ? (
                <div className="bg-secondary/30 rounded-xl border border-border p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Binance Pay ID</p>
                      <p className="text-xl font-bold font-mono text-foreground">{binancePayId}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(binancePayId); toast.success("Copied!"); }} className="gap-1">
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </Button>
                  </div>
                  <div className="text-center py-4">
                    <QrCode className="w-24 h-24 text-muted-foreground mx-auto" />
                    <p className="text-xs text-muted-foreground mt-2">Scan with Binance app</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-foreground font-semibold">Amount: ${total.toFixed(2)} USD</p>
                  </div>
                </div>
              ) : selectedMethod!.instructions ? (
                <div className="bg-secondary/30 rounded-xl border border-border p-6">
                  <div dangerouslySetInnerHTML={{ __html: selectedMethod!.instructions }} className="text-sm text-foreground prose prose-sm" />
                  <div className="text-center mt-4">
                    <p className="text-sm text-foreground font-semibold">Amount: ${total.toFixed(2)} USD</p>
                  </div>
                </div>
              ) : null}

              {selectedMethod!.custom_note && (
                <p className="text-sm text-primary font-medium text-center">{selectedMethod!.custom_note}</p>
              )}

              {/* Upload Proof */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Upload Payment Proof</h4>
                <p className="text-xs text-muted-foreground">Take a screenshot of your completed transaction and upload it below. Only JPG/PNG, max 5MB.</p>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  {proofFile ? (
                    <div className="space-y-2">
                      <CheckCircle className="w-8 h-8 text-primary mx-auto" />
                      <p className="text-sm text-foreground font-medium">{proofFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(proofFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">Click to upload screenshot</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleFileSelect} />
                <Button onClick={uploadProof} disabled={!proofFile || uploading} className="w-full gap-2" size="lg">
                  {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit Payment Proof
                </Button>
              </div>
            </div>
          )}

          {step === "done" && (
            <div className="text-center space-y-6 py-8">
              <CheckCircle className="w-16 h-16 text-primary mx-auto" />
              <h3 className="text-xl font-bold text-foreground">Proof Submitted!</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Our team is verifying your transaction. You will receive an update within 24 hours.
              </p>
              <Button variant="outline" onClick={() => navigate("/shop")}>Back to Shop</Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
