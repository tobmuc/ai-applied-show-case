(() => {
  "use strict";

  const measurementId = window.SHOWCASE_GA4_MEASUREMENT_ID;
  if (!/^G-[A-Z0-9]+$/i.test(measurementId || "")) return;

  const consentKey = "ai-showcase-ga4-consent-v1";
  const copy = {
    de: {
      title: "Optionale Reichweitenmessung",
      message: "Mit deiner Einwilligung verwenden wir Google Analytics 4, um Besuche und die Nutzung dieser Showcase-Seiten auszuwerten. Dabei können Nutzungs-, Geräte- und Online-Kennungsdaten verarbeitet und Google-Analytics-Cookies gesetzt werden. Ohne Einwilligung wird das Analytics-Skript nicht geladen. Die Auswahl wird in diesem Browser gespeichert; du kannst sie jederzeit ändern oder widerrufen.",
      allow: "Analytics erlauben",
      reject: "Nur notwendige",
      settings: "Datenschutzeinstellungen",
      privacy: "Google-Datenschutzhinweise",
      close: "Schließen",
      dialog: "Einstellungen zur optionalen Reichweitenmessung",
      link: "https://policies.google.com/privacy?hl=de",
    },
    en: {
      title: "Optional audience measurement",
      message: "With your consent, we use Google Analytics 4 to understand visits and usage of these showcase pages. Usage, device and online identifier data may be processed and Google Analytics cookies may be set. Without consent, the analytics script is not loaded. Your choice is stored in this browser; you can change or withdraw it at any time.",
      allow: "Allow analytics",
      reject: "Necessary only",
      settings: "Privacy settings",
      privacy: "Google Privacy Policy",
      close: "Close",
      dialog: "Optional audience measurement settings",
      link: "https://policies.google.com/privacy?hl=en",
    },
  };

  const style = document.createElement("style");
  style.textContent = `
    #showcase-ga-consent {
      position: fixed; z-index: 10000; inset: auto 16px 16px; width: min(760px, calc(100% - 32px));
      margin-inline: auto; padding: 20px; border: 1px solid rgba(107,226,212,.3); border-radius: 18px;
      background: rgba(7,17,29,.97); color: #edf7f8; box-shadow: 0 20px 70px rgba(0,0,0,.48);
      font: 14px/1.55 Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    #showcase-ga-consent[hidden], #showcase-ga-settings[hidden] { display: none !important; }
    #showcase-ga-consent h2 { margin: 0 0 8px; color: #f5ffff; font-size: 18px; line-height: 1.25; letter-spacing: -.02em; }
    #showcase-ga-consent p { margin: 0 0 10px; color: #bfd0d6; font-size: 13px; }
    #showcase-ga-consent a { color: #8df2df; text-decoration: underline; text-underline-offset: 3px; }
    #showcase-ga-consent .ga-consent-actions { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 16px; }
    #showcase-ga-consent button, #showcase-ga-settings {
      min-height: 40px; padding: 8px 13px; border: 1px solid rgba(176,219,230,.2); border-radius: 10px;
      background: #102231; color: #e7f4f5; font: inherit; font-size: 12px; font-weight: 700; cursor: pointer;
    }
    #showcase-ga-consent button[data-action="allow"] { border-color: rgba(107,226,212,.45); background: rgba(107,226,212,.14); color: #cafff6; }
    #showcase-ga-consent button:hover, #showcase-ga-settings:hover { border-color: rgba(107,226,212,.55); }
    #showcase-ga-consent button:focus-visible, #showcase-ga-settings:focus-visible, #showcase-ga-consent a:focus-visible { outline: 2px solid #6be2d4; outline-offset: 3px; }
    #showcase-ga-settings { position: fixed; z-index: 9999; right: 14px; bottom: 14px; min-height: 34px; padding: 6px 10px; border-color: rgba(176,219,230,.18); background: rgba(7,17,29,.93); color: #b8cbd0; font-size: 11px; box-shadow: 0 5px 18px rgba(0,0,0,.2); }
    @media (max-width: 520px) {
      #showcase-ga-consent { inset: auto 10px 10px; width: calc(100% - 20px); padding: 16px; }
      #showcase-ga-consent .ga-consent-actions { display: grid; grid-template-columns: 1fr 1fr; }
      #showcase-ga-consent button { padding-inline: 8px; font-size: 11px; }
      #showcase-ga-settings { right: 10px; bottom: 10px; }
    }
    @media (prefers-reduced-motion: no-preference) {
      #showcase-ga-consent { animation: showcase-consent-in .2s ease-out; }
      @keyframes showcase-consent-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    }
  `;
  document.head.appendChild(style);

  const banner = document.createElement("section");
  banner.id = "showcase-ga-consent";
  banner.hidden = true;
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-modal", "false");
  banner.setAttribute("aria-labelledby", "showcase-ga-title");
  banner.innerHTML = `
    <h2 id="showcase-ga-title"></h2>
    <p id="showcase-ga-message"></p>
    <a id="showcase-ga-privacy" target="_blank" rel="noopener noreferrer"></a>
    <div class="ga-consent-actions">
      <button type="button" data-action="reject"></button>
      <button type="button" data-action="allow"></button>
    </div>
  `;
  document.body.appendChild(banner);

  const settingsButton = document.createElement("button");
  settingsButton.id = "showcase-ga-settings";
  settingsButton.type = "button";
  settingsButton.hidden = true;
  document.body.appendChild(settingsButton);

  let tagLoaded = false;
  let tagRequested = false;
  let tagElement = null;
  let tagQueueInitialized = false;
  let tagConfigurationQueued = false;
  let currentConsent = null;

  try {
    const savedConsent = localStorage.getItem(consentKey);
    if (savedConsent === "granted" || savedConsent === "denied") currentConsent = savedConsent;
  } catch {
    // Without persistent storage, ask on each page visit and keep the current-page choice in memory.
  }

  function currentLanguage() {
    return document.documentElement.lang?.toLowerCase().startsWith("de") ? "de" : "en";
  }

  function updateCopy() {
    const words = copy[currentLanguage()];
    banner.querySelector("h2").textContent = words.title;
    banner.querySelector("#showcase-ga-message").textContent = words.message;
    const privacyLink = banner.querySelector("#showcase-ga-privacy");
    privacyLink.textContent = words.privacy;
    privacyLink.href = words.link;
    banner.querySelector('[data-action="allow"]').textContent = words.allow;
    banner.querySelector('[data-action="reject"]').textContent = words.reject;
    settingsButton.textContent = words.settings;
    settingsButton.setAttribute("aria-label", words.settings);
    banner.setAttribute("aria-label", words.dialog);
  }

  function setConsent(consent) {
    currentConsent = consent;
    let reloadToUnloadTag = false;
    try {
      localStorage.setItem(consentKey, consent);
    } catch {
      // The choice still applies for this page view even if storage is unavailable.
    }

    banner.hidden = true;
    settingsButton.hidden = false;
    if (consent === "granted") {
      loadAnalytics();
    } else {
      if (!tagLoaded && tagConfigurationQueued) {
        tagElement?.remove();
        tagElement = null;
        tagRequested = false;
        window.dataLayer = (window.dataLayer || []).filter(entry => entry?.[0] !== "config" && entry?.[0] !== "event");
        tagConfigurationQueued = false;
        reloadToUnloadTag = true;
      }
      if (tagQueueInitialized && typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
        reloadToUnloadTag = reloadToUnloadTag || tagLoaded;
      }
      clearAnalyticsCookies();
    }

    if (reloadToUnloadTag) {
      try { sessionStorage.setItem("ai-showcase-ga4-restore-scroll", String(window.scrollY)); } catch { /* Withdrawal still applies when session storage is unavailable. */ }
      window.location.reload();
      return;
    }

    banner.hidden = true;
    settingsButton.hidden = false;
  }

  function clearAnalyticsCookies() {
    const cookieNames = document.cookie.split(";").map(cookie => cookie.trim().split("=")[0]);
    const analyticsNames = cookieNames.filter(name => /^_(ga|gid|gat|gcl|gac)/i.test(name));
    for (const name of analyticsNames) {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${location.hostname}; SameSite=Lax`;
    }
  }

  function loadAnalytics() {
    if (tagLoaded) {
      if (typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          analytics_storage: "granted",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
        window.gtag("event", "page_view", {
          page_location: location.href,
          page_title: document.title,
        });
      }
      return;
    }
    if (tagRequested) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      return;
    }

    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== "function") {
      window.gtag = function gtag() { window.dataLayer.push(arguments); };
    }
    if (!tagQueueInitialized) {
      window.gtag("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      window.gtag("js", new Date());
      tagQueueInitialized = true;
    }
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    if (!tagConfigurationQueued) {
      window.gtag("config", measurementId, {
        send_page_view: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });
      tagConfigurationQueued = true;
    }

    const tag = document.createElement("script");
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    tagElement = tag;
    tagRequested = true;
    tag.onload = () => {
      if (tagElement !== tag) return;
      tagRequested = false;
      tagLoaded = true;
    };
    tag.onerror = () => {
      if (tagElement !== tag) return;
      tagRequested = false;
      tagElement = null;
      console.warn("Google Analytics could not be loaded.");
    };
    document.head.appendChild(tag);
  }

  function openSettings(shouldFocus = true) {
    updateCopy();
    banner.hidden = false;
    settingsButton.hidden = true;
    if (shouldFocus) banner.querySelector('[data-action="reject"]').focus();
  }

  banner.querySelector('[data-action="allow"]').addEventListener("click", () => setConsent("granted"));
  banner.querySelector('[data-action="reject"]').addEventListener("click", () => setConsent("denied"));
  settingsButton.addEventListener("click", openSettings);

  window.showcaseAnalyticsSettings = openSettings;

  updateCopy();
  try {
    const previousScroll = sessionStorage.getItem("ai-showcase-ga4-restore-scroll");
    if (previousScroll !== null) {
      sessionStorage.removeItem("ai-showcase-ga4-restore-scroll");
      window.requestAnimationFrame(() => window.scrollTo(0, Number(previousScroll) || 0));
    }
  } catch { /* Ignore if the browser blocks session storage. */ }
  if (currentConsent === "granted") {
    settingsButton.hidden = false;
    loadAnalytics();
  } else if (currentConsent === "denied") {
    settingsButton.hidden = false;
  } else {
    openSettings(false);
  }

  new MutationObserver(updateCopy).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"],
  });
})();
