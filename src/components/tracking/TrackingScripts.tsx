import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const PRODUCTION_DOMAINS = ["verifiedbmservices.com", "www.verifiedbmservices.com"];

const isProduction = () => {
  const hostname = window.location.hostname;
  // Allow any non-localhost, non-preview domain as production
  return (
    !hostname.includes("localhost") &&
    !hostname.includes("lovable.app") &&
    !hostname.includes("127.0.0.1")
  );
};

const injectScript = (content: string, target: "head" | "body") => {
  const container = document.createElement("div");
  container.innerHTML = content;
  const scripts = container.querySelectorAll("script");
  const parent = target === "head" ? document.head : document.body;

  scripts.forEach((origScript) => {
    const script = document.createElement("script");
    // Copy attributes
    Array.from(origScript.attributes).forEach((attr) => {
      script.setAttribute(attr.name, attr.value);
    });
    script.textContent = origScript.textContent;
    script.setAttribute("data-tracking", "custom");
    parent.appendChild(script);
  });

  // Also inject non-script elements (noscript, etc.)
  const nonScripts = container.querySelectorAll(":not(script)");
  nonScripts.forEach((el) => {
    const clone = el.cloneNode(true) as HTMLElement;
    clone.setAttribute("data-tracking", "custom");
    parent.appendChild(clone);
  });
};

const TrackingScripts = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    if (!isProduction()) return;

    const load = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .like("key", "tracking_%");

      if (!data || data.length === 0) return;

      const settings: Record<string, string> = {};
      data.forEach((r) => { settings[r.key] = r.value; });

      // GA4
      if (settings.tracking_ga4_id) {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.tracking_ga4_id}`;
        script.setAttribute("data-tracking", "ga4");
        document.head.appendChild(script);

        const inline = document.createElement("script");
        inline.setAttribute("data-tracking", "ga4-config");
        inline.textContent = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${settings.tracking_ga4_id}');
        `;
        document.head.appendChild(inline);
      }

      // GTM
      if (settings.tracking_gtm_id) {
        const script = document.createElement("script");
        script.setAttribute("data-tracking", "gtm");
        script.textContent = `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${settings.tracking_gtm_id}');
        `;
        document.head.appendChild(script);
      }

      // Google Ads
      if (settings.tracking_google_ads_id) {
        const inline = document.createElement("script");
        inline.setAttribute("data-tracking", "gads");
        inline.textContent = `
          gtag('config', '${settings.tracking_google_ads_id}');
        `;
        document.head.appendChild(inline);
      }

      // Facebook Pixel
      if (settings.tracking_fb_pixel_id) {
        const script = document.createElement("script");
        script.setAttribute("data-tracking", "fbpixel");
        script.textContent = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${settings.tracking_fb_pixel_id}');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(script);
      }

      // Custom header scripts
      if (settings.tracking_header_scripts) {
        injectScript(settings.tracking_header_scripts, "head");
      }

      // Custom footer scripts
      if (settings.tracking_footer_scripts) {
        injectScript(settings.tracking_footer_scripts, "body");
      }

      setLoaded(true);
    };

    // Lazy load - wait for page to be idle
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(load);
    } else {
      setTimeout(load, 2000);
    }
  }, [loaded]);

  return null;
};

export default TrackingScripts;
