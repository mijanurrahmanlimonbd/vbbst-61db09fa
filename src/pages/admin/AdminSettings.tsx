import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FieldErrors {
  [key: string]: boolean;
}

const AdminSettings = () => {
  // General
  const [siteTitle, setSiteTitle] = useState("VBB STORE");
  const [siteDescription, setSiteDescription] = useState("Your trusted source for verified Facebook Business Managers");
  const [contactEmail, setContactEmail] = useState("info@verifiedbmbuy.com");
  const [whatsapp, setWhatsapp] = useState("+1 234 567 890");

  // Profile
  const [displayName, setDisplayName] = useState("Admin");
  const [profileEmail, setProfileEmail] = useState("admin@vbbstore.com");
  const [bio, setBio] = useState("");

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Payment
  const [cryptomusApiKey, setCryptomusApiKey] = useState("");
  const [cryptomusMerchantId, setCryptomusMerchantId] = useState("");
  const [binancePayId, setBinancePayId] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  // Load payment settings
  useEffect(() => {
    const loadPaymentSettings = async () => {
      setPaymentLoading(true);
      const keys = ["cryptomus_api_key", "cryptomus_merchant_id", "binance_pay_id"];
      const { data } = await supabase.from("site_settings").select("key, value").in("key", keys);
      if (data) {
        for (const row of data) {
          if (row.key === "cryptomus_api_key") setCryptomusApiKey(row.value);
          if (row.key === "cryptomus_merchant_id") setCryptomusMerchantId(row.value);
          if (row.key === "binance_pay_id") setBinancePayId(row.value);
        }
      }
      setPaymentLoading(false);
    };
    loadPaymentSettings();
  }, []);

  const validateGeneral = () => {
    const e: FieldErrors = {};
    if (!siteTitle.trim()) e.siteTitle = true;
    if (!contactEmail.trim()) e.contactEmail = true;
    return e;
  };

  const validateProfile = () => {
    const e: FieldErrors = {};
    if (!displayName.trim()) e.displayName = true;
    if (!profileEmail.trim()) e.profileEmail = true;
    return e;
  };

  const validateSecurity = () => {
    const e: FieldErrors = {};
    if (!currentPassword.trim()) e.currentPassword = true;
    if (!newPassword.trim()) e.newPassword = true;
    if (!confirmPassword.trim()) e.confirmPassword = true;
    if (newPassword && confirmPassword && newPassword !== confirmPassword) e.confirmPassword = true;
    return e;
  };

  const handleSave = async (tab: string) => {
    let fieldErrors: FieldErrors = {};
    if (tab === "general") fieldErrors = validateGeneral();
    else if (tab === "profile") fieldErrors = validateProfile();
    else if (tab === "security") fieldErrors = validateSecurity();

    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    toast.success("Settings saved successfully.");
  };

  const savePaymentSettings = async () => {
    setSaving(true);
    try {
      const settings = [
        { key: "cryptomus_api_key", value: cryptomusApiKey.trim() },
        { key: "cryptomus_merchant_id", value: cryptomusMerchantId.trim() },
        { key: "binance_pay_id", value: binancePayId.trim() },
      ].filter((s) => s.value);

      for (const setting of settings) {
        const { data: existing } = await supabase
          .from("site_settings")
          .select("key")
          .eq("key", setting.key)
          .single();

        if (existing) {
          await supabase.from("site_settings").update({ value: setting.value, updated_at: new Date().toISOString() }).eq("key", setting.key);
        } else {
          await supabase.from("site_settings").insert(setting);
        }
      }

      toast.success("Payment settings saved!");
    } catch {
      toast.error("Failed to save payment settings.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (field: string) =>
    cn(errors[field] && "border-destructive ring-destructive focus-visible:ring-destructive");

  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Settings</h2>

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setErrors({}); }}>
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <div className="bg-background rounded-xl border border-border p-6 space-y-5 mt-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Site Title <span className="text-destructive">*</span></label>
              <Input value={siteTitle} onChange={(e) => { setSiteTitle(e.target.value); setErrors((p) => ({ ...p, siteTitle: false })); }} className={inputClass("siteTitle")} />
              {errors.siteTitle && <p className="text-xs text-destructive mt-1">Site title is required.</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Site Description</label>
              <Textarea value={siteDescription} onChange={(e) => setSiteDescription(e.target.value)} rows={3} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Contact Email <span className="text-destructive">*</span></label>
              <Input value={contactEmail} onChange={(e) => { setContactEmail(e.target.value); setErrors((p) => ({ ...p, contactEmail: false })); }} className={inputClass("contactEmail")} />
              {errors.contactEmail && <p className="text-xs text-destructive mt-1">Contact email is required.</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">WhatsApp Number</label>
              <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
            </div>
            <Button onClick={() => handleSave("general")} disabled={saving} className="gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Payment */}
        <TabsContent value="payment">
          <div className="bg-background rounded-xl border border-border p-6 space-y-6 mt-4">
            {paymentLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading…</div>
            ) : (
              <>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">Cryptomus Integration</h3>
                  <p className="text-xs text-muted-foreground mb-4">Configure your Cryptomus API to accept automatic crypto payments.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Merchant ID</label>
                      <Input value={cryptomusMerchantId} onChange={(e) => setCryptomusMerchantId(e.target.value)} placeholder="Enter Cryptomus Merchant ID" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">API Key</label>
                      <div className="relative">
                        <Input
                          type={showApiKey ? "text" : "password"}
                          value={cryptomusApiKey}
                          onChange={(e) => setCryptomusApiKey(e.target.value)}
                          placeholder="Enter Cryptomus API Key"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-base font-semibold text-foreground mb-1">Binance Pay (Manual)</h3>
                  <p className="text-xs text-muted-foreground mb-4">Your Binance Pay ID will be shown to customers for manual transfers.</p>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Binance Pay ID</label>
                    <Input value={binancePayId} onChange={(e) => setBinancePayId(e.target.value)} placeholder="e.g. 895693102" />
                  </div>
                </div>

                <Button onClick={savePaymentSettings} disabled={saving} className="gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Payment Settings
                </Button>
              </>
            )}
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <div className="bg-background rounded-xl border border-border p-6 space-y-5 mt-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Current Password <span className="text-destructive">*</span></label>
              <Input type="password" value={currentPassword} onChange={(e) => { setCurrentPassword(e.target.value); setErrors((p) => ({ ...p, currentPassword: false })); }} className={inputClass("currentPassword")} placeholder="Enter current password" />
              {errors.currentPassword && <p className="text-xs text-destructive mt-1">Current password is required.</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">New Password <span className="text-destructive">*</span></label>
              <Input type="password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setErrors((p) => ({ ...p, newPassword: false })); }} className={inputClass("newPassword")} placeholder="Enter new password" />
              {errors.newPassword && <p className="text-xs text-destructive mt-1">New password is required.</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Confirm Password <span className="text-destructive">*</span></label>
              <Input type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: false })); }} className={inputClass("confirmPassword")} placeholder="Confirm new password" />
              {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{newPassword !== confirmPassword ? "Passwords do not match." : "Confirm password is required."}</p>}
            </div>
            <Button onClick={() => handleSave("security")} disabled={saving} className="gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Update Password
            </Button>
          </div>
        </TabsContent>

        {/* Profile */}
        <TabsContent value="profile">
          <div className="bg-background rounded-xl border border-border p-6 space-y-5 mt-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Display Name <span className="text-destructive">*</span></label>
              <Input value={displayName} onChange={(e) => { setDisplayName(e.target.value); setErrors((p) => ({ ...p, displayName: false })); }} className={inputClass("displayName")} />
              {errors.displayName && <p className="text-xs text-destructive mt-1">Display name is required.</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email <span className="text-destructive">*</span></label>
              <Input value={profileEmail} onChange={(e) => { setProfileEmail(e.target.value); setErrors((p) => ({ ...p, profileEmail: false })); }} className={inputClass("profileEmail")} />
              {errors.profileEmail && <p className="text-xs text-destructive mt-1">Email is required.</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Bio</label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} placeholder="Tell us about yourself…" />
            </div>
            <Button onClick={() => handleSave("profile")} disabled={saving} className="gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Profile
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
