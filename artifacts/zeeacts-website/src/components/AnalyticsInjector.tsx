import { useEffect } from "react";
import { useGetSettings } from "@workspace/api-client-react";

interface AnalyticsCfg {
  ga4Id: string;
  gtmId: string;
  fbPixelId: string;
  linkedinPartnerId: string;
  googleAdsId: string;
  googleAdsLabel: string;
  linkedinConversionId: string;
}

let _cfg: AnalyticsCfg | null = null;

function injectScript(id: string, html: string, inBody = false) {
  if (document.getElementById(id)) return;
  const container = document.createElement("div");
  container.id = id;
  container.innerHTML = html;
  const target = inBody ? document.body : document.head;
  Array.from(container.childNodes).forEach((node) => target.appendChild(node));
}

function injectTag(id: string, src: string, attrs: Record<string, string> = {}) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.src = src;
  s.async = true;
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.appendChild(s);
}

export function trackConversion(label = "contact_form") {
  if (!_cfg) return;
  const w = window as unknown as Record<string, unknown>;

  if (_cfg.ga4Id && typeof w.gtag === "function") {
    (w.gtag as (...a: unknown[]) => void)("event", "generate_lead", {
      event_category: "form",
      event_label: label,
    });
  }

  if (_cfg.googleAdsId && _cfg.googleAdsLabel && typeof w.gtag === "function") {
    (w.gtag as (...a: unknown[]) => void)("event", "conversion", {
      send_to: `${_cfg.googleAdsId}/${_cfg.googleAdsLabel}`,
    });
  }

  if (_cfg.fbPixelId && typeof w.fbq === "function") {
    (w.fbq as (...a: unknown[]) => void)("track", "Lead");
  }

  if (_cfg.linkedinPartnerId && typeof w.lintrk === "function") {
    (w.lintrk as (...a: unknown[]) => void)("track", {
      conversion_id: _cfg.linkedinConversionId ? parseInt(_cfg.linkedinConversionId) : 0,
    });
  }
}

export default function AnalyticsInjector() {
  const { data: settings } = useGetSettings();

  // SEO meta tag injection (global defaults; per-page overrides in individual pages)
  useEffect(() => {
    if (!settings) return;

    const setMeta = (attr: string, name: string, content: string, prop = false) => {
      const selector = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    if (settings.seo_site_title) {
      if (document.title === "ZeeActs Website" || document.title === "ZeeActs — Premium IT Solutions") {
        document.title = settings.seo_site_title;
      }
    }
    if (settings.seo_meta_description) setMeta("name", "description", settings.seo_meta_description);
    if (settings.seo_robots) setMeta("name", "robots", settings.seo_robots);
    if (settings.seo_google_verification) setMeta("name", "google-site-verification", settings.seo_google_verification);
    if (settings.seo_bing_verification) setMeta("name", "msvalidate.01", settings.seo_bing_verification);
    if (settings.seo_og_title) setMeta("property", "og:title", settings.seo_og_title, true);
    if (settings.seo_og_description) setMeta("property", "og:description", settings.seo_og_description, true);
    if (settings.seo_og_image) setMeta("property", "og:image", settings.seo_og_image, true);
    setMeta("property", "og:type", "website", true);
    if (settings.seo_twitter_card) setMeta("name", "twitter:card", settings.seo_twitter_card);
    if (settings.seo_og_title) setMeta("name", "twitter:title", settings.seo_og_title);
    if (settings.seo_og_description) setMeta("name", "twitter:description", settings.seo_og_description);
    if (settings.seo_canonical_url) setLink("canonical", settings.seo_canonical_url);
  }, [settings]);

  // Analytics script injection
  useEffect(() => {
    if (!settings) return;

    const ga4Id = settings.analytics_ga4_id ?? "";
    const gtmId = settings.analytics_gtm_id ?? "";
    const fbPixelId = settings.analytics_fb_pixel_id ?? "";
    const linkedinPartnerId = settings.analytics_linkedin_partner_id ?? "";
    const googleAdsId = settings.analytics_google_ads_id ?? "";
    const googleAdsLabel = settings.analytics_google_ads_label ?? "";
    const linkedinConversionId = settings.analytics_linkedin_conversion_id ?? "";

    _cfg = { ga4Id, gtmId, fbPixelId, linkedinPartnerId, googleAdsId, googleAdsLabel, linkedinConversionId };

    if (ga4Id) {
      injectTag("za-ga4-tag", `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`);
      if (!document.getElementById("za-ga4-init")) {
        const s = document.createElement("script");
        s.id = "za-ga4-init";
        s.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga4Id}');`;
        document.head.appendChild(s);
      }
    }

    if (gtmId) {
      injectScript(
        "za-gtm-head",
        `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');</script>`,
      );
      injectScript(
        "za-gtm-body",
        `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`,
        true,
      );
    }

    if (fbPixelId) {
      injectScript(
        "za-fb-pixel",
        `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${fbPixelId}');fbq('track','PageView');</script>`,
      );
    }

    if (linkedinPartnerId) {
      injectScript(
        "za-linkedin",
        `<script type="text/javascript">_linkedin_partner_id="${linkedinPartnerId}";window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);</script><script type="text/javascript">(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s)})(window.lintrk);</script>`,
      );
    }

    const customHead = settings.analytics_custom_head ?? "";
    if (customHead) {
      injectScript("za-custom-head", customHead);
    }

    const customBody = settings.analytics_custom_body ?? "";
    if (customBody) {
      injectScript("za-custom-body", customBody, true);
    }
  }, [settings]);

  return null;
}
