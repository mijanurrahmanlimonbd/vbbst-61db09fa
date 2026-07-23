import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";
import { Helmet } from "react-helmet-async";

// Typed shim for the beta supabase.auth.oauth namespace.
type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};
const oauth = (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

const OAuthConsent = () => {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/login?next=" + encodeURIComponent(next);
        return;
      }
      if (!oauth) {
        setError("OAuth API not available on this Supabase client.");
        return;
      }
      const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) return setError(error.message || String(error));
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  const decide = async (approve: boolean) => {
    setBusy(true);
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorizationId)
      : await oauth.denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      return setError(error.message || String(error));
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      return setError("No redirect returned by the authorization server.");
    }
    window.location.href = target;
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-lg font-semibold text-red-600 mb-2">Authorization error</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const clientName = details.client?.name ?? details.client?.client_name ?? "an app";
  const redirectUri = details.client?.redirect_uri ?? details.client?.redirect_uris?.[0];
  const scopes: string[] = Array.isArray(details.scope)
    ? details.scope
    : (details.scope ?? "").split(/\s+/).filter(Boolean);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Helmet><title>Authorize {clientName} — Verified BM Shop</title></Helmet>
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Connect {clientName}
            </h1>
            <p className="text-xs text-gray-500">to Verified BM Shop</p>
          </div>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          {clientName} will be able to call this app's enabled tools while you are signed in.
        </p>

        {redirectUri && (
          <div className="text-xs text-gray-500 mb-4 break-all">
            Redirect: <span className="font-mono">{redirectUri}</span>
          </div>
        )}

        {scopes.length > 0 && (
          <ul className="text-xs text-gray-600 dark:text-gray-400 mb-6 space-y-1">
            {scopes.map((s) => (
              <li key={s}>• {s}</li>
            ))}
          </ul>
        )}

        <p className="text-xs text-gray-500 mb-6">
          This does not bypass Verified BM Shop's permissions or backend policies.
        </p>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" disabled={busy} onClick={() => decide(false)}>
            Cancel
          </Button>
          <Button className="flex-1" disabled={busy} onClick={() => decide(true)}>
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OAuthConsent;
