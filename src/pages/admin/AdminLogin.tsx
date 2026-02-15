import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { useBranding } from "@/hooks/useBranding";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, UserPlus } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn } = useAuth();
  const { branding } = useBranding();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      setLoading(false);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created! Signing you in...");
        // Auto-confirm is enabled, so sign in immediately
        const { error: signInError } = await signIn(email, password);
        if (!signInError) navigate("/admin");
      }
    } else {
      const { error } = await signIn(email, password);
      setLoading(false);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Welcome back!");
        navigate("/admin");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(210,20%,96%)] flex items-center justify-center p-4">
      {branding.favicon && (
        <Helmet>
          <link rel="icon" href={branding.favicon} type="image/png" />
        </Helmet>
      )}
      <div className="w-full max-w-sm">
        <div className="bg-background rounded-2xl border border-border shadow-lg p-8 space-y-6">
          <div className="text-center">
            {branding.header_logo ? (
              <img
                src={branding.header_logo}
                alt={branding.site_title || "Admin"}
                className="h-12 max-w-[200px] object-contain mx-auto mb-4"
              />
            ) : (
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                {(branding.site_title || "VS").substring(0, 2).toUpperCase()}
              </div>
            )}
            <h1 className="text-xl font-bold text-foreground">
              {isSignUp ? "Create Account" : "Admin Login"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isSignUp ? "Create a new admin account" : `Sign in to your ${branding.site_title || "VBB Store"} admin panel`}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vbbstore.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
            </div>
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isSignUp ? (
                <UserPlus className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
