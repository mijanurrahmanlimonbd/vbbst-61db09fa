import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

function safeNext(raw: string | null): string {
  if (!raw) return "/dashboard";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  return raw;
}

const Login = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // If already signed in, bounce to `next`.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate(next, { replace: true });
    });
  }, [navigate, next]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate(next, { replace: true });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login?next=${encodeURIComponent(next)}`,
        data: { full_name: name },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — check your email to verify.");
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/login?next=${encodeURIComponent(next)}`,
    });
    if (result.error) {
      toast.error("Google sign-in failed.");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate(next, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Helmet><title>Sign in — Verified BM Shop</title></Helmet>
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {tab === "login" ? "Sign in" : "Create account"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Verified BM Shop</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${tab === "login" ? "bg-primary text-primary-foreground" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}
          >
            Sign in
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${tab === "register" ? "bg-primary text-primary-foreground" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={tab === "login" ? handleLogin : handleRegister} className="space-y-4">
          {tab === "register" && (
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : tab === "login" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <div className="my-4 text-center text-xs text-gray-400">or</div>

        <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
          Continue with Google
        </Button>

        <p className="mt-6 text-xs text-center text-gray-500">
          <Link to="/" className="hover:underline">Back to home</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
