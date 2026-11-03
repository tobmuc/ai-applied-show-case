/*
 * Basic consent mode: do not create or load a Google tag until the visitor opts in.
 */
(() => {
  const MEASUREMENT_ID = 'G-NXHY8714SY';
  const STORAGE_KEY = 'ai-showcase-consent';
  const CONSENT_VERSION = 2;
  const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;
  const scriptUrl = document.currentScript ? document.currentScript.src : location.href;
  const privacyUrl = new URL('datenschutzhinweise.html', scriptUrl).href;

  const texts = {
    de: {
      title: 'Cookies & Reichweitenmessung',
      body: 'Google Analytics 4 wird erst nach deiner ausdrücklichen Einwilligung geladen. Dabei können Nutzungsdaten, Browser- und Geräteinformationen, ungefähres Land (aus IP-Informationen abgeleitet) und Browsersprache verarbeitet werden. Ohne Einwilligung geht keine Anfrage an Google. Du kannst ablehnen und deine Wahl jederzeit über „Cookie-Einstellungen“ im Footer ändern.',
      privacy: 'Datenschutzhinweise',
      accept: 'Akzeptieren',
      reject: 'Ablehnen',
      settings: 'Cookie-Einstellungen',
    },
    en: {
      title: 'Cookies & audience measurement',
      body: 'Google Analytics 4 is loaded only after your explicit consent. It may process usage data, browser and device information, approximate country (derived from IP information) and browser language. No request is sent to Google without consent. You can reject and change your choice at any time via “Cookie settings” in the footer.',
      privacy: 'Privacy notice',
      accept: 'Accept',
      reject: 'Reject',
      settings: 'Cookie settings',
    },
  };

  let banner = null;
  let analyticsEnabled = false;
  let tagConfigured = false;
  let activeTimeTimer = null;
  let activeSince = null;
  let accumulatedActiveMs = 0;

  function language() {
    return (document.documentElement.lang || '').toLowerCase().startsWith('de') ? 'de' : 'en';
  }

  function readChoice() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!stored || stored.version !== CONSENT_VERSION) return null;
      if (stored.analytics !== 'granted' && stored.analytics !== 'denied') return null;
      const age = Date.now() - stored.timestamp;
      if (typeof stored.timestamp !== 'number' || age < 0 || age > MAX_AGE_MS) return null;
      return stored.analytics;
    } catch {
      return null;
    }
  }

  function saveChoice(analytics) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: CONSENT_VERSION, analytics, timestamp: Date.now() }));
    } catch { /* The choice still applies to this page view. */ }
  }

  function deleteAnalyticsCookies() {
    const host = location.hostname;
    const domains = ['', host, `.${host}`];
    document.cookie.split(';').map(cookie => cookie.split('=')[0].trim())
      .filter(name => name === '_ga' || name.startsWith('_ga_') || name === '_gid' || name === '_gat')
      .forEach(name => domains.forEach(domain => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain ? `; domain=${domain}` : ''}`;
      }));
  }

  function getGtag() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
    return window.gtag;
  }

  function pageLocation() {
    if (location.protocol !== 'http:' && location.protocol !== 'https:') return '';
    return `${location.origin}${location.pathname}`;
  }

  function pageReferrer() {
    if (!document.referrer) return '';
    try {
      return new URL(document.referrer).origin;
    } catch {
      return '';
    }
  }

  function loadGoogleTag() {
    if (document.querySelector('[data-showcase-ga4]')) return;
    const script = document.createElement('script');
    script.async = true;
    script.dataset.showcaseGa4 = 'true';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
    document.head.append(script);
  }

  function trackEvent(name, parameters = {}) {
    if (!analyticsEnabled) return;
    getGtag()('event', name, { ...parameters, send_to: MEASUREMENT_ID });
  }

  function flushActiveDuration(continueTiming) {
    if (activeSince !== null) {
      accumulatedActiveMs += performance.now() - activeSince;
      activeSince = continueTiming ? performance.now() : null;
    }

    const seconds = Math.floor(accumulatedActiveMs / 1000);
    if (seconds < 1) return;
    accumulatedActiveMs -= seconds * 1000;
    trackEvent('active_visible_time', {
      active_visible_seconds: seconds,
    });
  }

  function handleVisibilityChange() {
    if (!analyticsEnabled) return;
    if (document.visibilityState === 'visible') {
      if (activeSince === null) activeSince = performance.now();
    } else {
      flushActiveDuration(false);
    }
  }

  function handlePageHide() {
    flushActiveDuration(false);
  }

  function handlePageShow() {
    if (analyticsEnabled && document.visibilityState === 'visible' && activeSince === null) {
      activeSince = performance.now();
    }
  }

  function startActiveDuration() {
    if (activeTimeTimer !== null) return;
    activeSince = document.visibilityState === 'visible' ? performance.now() : null;
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);
    activeTimeTimer = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        if (activeSince === null) activeSince = performance.now();
        flushActiveDuration(true);
      } else {
        flushActiveDuration(false);
      }
    }, 15_000);
  }

  function stopActiveDuration() {
    if (activeTimeTimer !== null) window.clearInterval(activeTimeTimer);
    activeTimeTimer = null;
    activeSince = null;
    accumulatedActiveMs = 0;
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('pagehide', handlePageHide);
    window.removeEventListener('pageshow', handlePageShow);
  }

  function enableAnalytics() {
    if (analyticsEnabled || (location.protocol !== 'http:' && location.protocol !== 'https:')) return;
    analyticsEnabled = true;
    window[`ga-disable-${MEASUREMENT_ID}`] = false;
    const gtag = getGtag();

    if (!tagConfigured) {
      gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
      });
      gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
      gtag('js', new Date());
      gtag('config', MEASUREMENT_ID, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        page_location: pageLocation(),
        page_referrer: pageReferrer(),
      });
      tagConfigured = true;
      loadGoogleTag();
    } else {
      gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }

    trackEvent('page_view', {
      page_location: pageLocation(),
      page_referrer: pageReferrer(),
      page_title: document.title,
    });
    startActiveDuration();
  }

  function disableAnalytics() {
    analyticsEnabled = false;
    window[`ga-disable-${MEASUREMENT_ID}`] = true;
    stopActiveDuration();
    deleteAnalyticsCookies();
  }

  function applyChoice(analytics) {
    if (analytics === 'granted') enableAnalytics();
    else disableAnalytics();
  }

  function choose(analytics) {
    saveChoice(analytics);
    applyChoice(analytics);
    hideBanner();
  }

  function injectStyles() {
    if (document.getElementById('sc-consent-style')) return;
    const style = document.createElement('style');
    style.id = 'sc-consent-style';
    style.textContent = `
      .sc-consent { position: fixed; z-index: 2147483000; left: 16px; right: 16px; bottom: 16px; margin: 0 auto; max-width: 560px;
        box-sizing: border-box; padding: 20px; border-radius: 14px; background: #10191d; color: #eef4f2;
        border: 1px solid rgba(255,255,255,.14); box-shadow: 0 18px 48px rgba(0,0,0,.35);
        font: 14px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; text-align: left; }
      .sc-consent[hidden] { display: none; }
      .sc-consent, .sc-consent * { box-sizing: border-box; letter-spacing: normal; text-transform: none; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
      .sc-consent h2 { margin: 0 0 8px; padding: 0; font-size: 16px; font-weight: 700; line-height: 1.3; color: inherit; background: none; -webkit-text-fill-color: currentColor; }
      .sc-consent p { margin: 0 0 14px; padding: 0; max-width: none; font-size: 14px; line-height: 1.5; color: #c9d6d2; }
      .sc-consent a { color: #8fd3c1; text-decoration: underline; }
      .sc-consent-actions { display: flex; flex-wrap: wrap; gap: 10px; }
      .sc-consent-actions button { flex: 1 1 140px; min-height: 42px; padding: 10px 16px; border-radius: 10px; cursor: pointer;
        font-size: 14px; font-weight: 600; line-height: 1.2; border: 1px solid #8fd3c1; background: transparent; color: #eef4f2; }
      .sc-consent-actions button[data-choice="granted"] { background: #8fd3c1; color: #0b1416; }
      .sc-consent-actions button:hover { filter: brightness(1.1); }
      .sc-consent-actions button:focus-visible, .sc-consent a:focus-visible { outline: 3px solid #f6c453; outline-offset: 2px; }
      .sc-consent-link { background: none; border: 0; padding: 0; margin: 0; font: inherit; color: inherit; letter-spacing: inherit; text-decoration: none; cursor: pointer; }
      .sc-consent-link:hover { text-decoration: underline; }
      .sc-consent-link:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
    `;
    document.head.append(style);
  }

  function renderTexts() {
    const t = texts[language()];
    if (banner) {
      banner.querySelector('h2').textContent = t.title;
      banner.querySelector('[data-part="body"]').textContent = `${t.body} `;
      const link = banner.querySelector('a');
      link.textContent = t.privacy;
      banner.querySelector('[data-choice="granted"]').textContent = t.accept;
      banner.querySelector('[data-choice="denied"]').textContent = t.reject;
    }
    document.querySelectorAll('[data-consent-open]').forEach(element => { element.textContent = t.settings; });
  }

  // Footer buttons mimic neighbouring links so they blend into each page's footer style.
  function syncLinkStyles() {
    document.querySelectorAll('[data-consent-open]').forEach(element => {
      const siblingLink = element.parentElement && element.parentElement.querySelector('a');
      if (!siblingLink) return;
      const linkStyle = getComputedStyle(siblingLink);
      element.style.textDecorationLine = linkStyle.textDecorationLine;
      element.style.color = linkStyle.color !== getComputedStyle(element.parentElement).color ? linkStyle.color : '';
    });
  }

  function buildBanner() {
    banner = document.createElement('section');
    banner.className = 'sc-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'false');
    banner.setAttribute('aria-labelledby', 'sc-consent-title');
    banner.hidden = true;
    banner.innerHTML = `
      <h2 id="sc-consent-title"></h2>
      <p><span data-part="body"></span><a href="${privacyUrl}"></a></p>
      <div class="sc-consent-actions">
        <button type="button" data-choice="denied"></button>
        <button type="button" data-choice="granted"></button>
      </div>`;
    banner.querySelectorAll('[data-choice]').forEach(button => {
      button.addEventListener('click', () => choose(button.dataset.choice));
    });
    document.body.append(banner);
    renderTexts();
  }

  function showBanner(moveFocus = false) {
    if (!banner) buildBanner();
    banner.hidden = false;
    if (moveFocus) banner.querySelector('[data-choice="denied"]').focus({ preventScroll: true });
  }

  function hideBanner() {
    if (banner) banner.hidden = true;
  }

  function linkType(anchor) {
    const href = anchor.getAttribute('href') || '';
    if (/^(mailto:|tel:)/i.test(href)) return 'contact';
    try {
      return new URL(href, location.href).origin === location.origin ? 'internal' : 'external';
    } catch {
      return 'other';
    }
  }

  function handleInteraction(event) {
    if (!analyticsEnabled || !(event.target instanceof Element)) return;
    const control = event.target.closest('a, button, [role="button"]');
    if (!control || control.closest('.sc-consent') || control.hasAttribute('data-consent-open')) return;

    const isLink = control.matches('a');
    trackEvent('site_interaction', {
      interaction_type: isLink ? 'link_click' : 'button_click',
      ...(isLink ? { link_type: linkType(control) } : {}),
    });
  }

  const initialChoice = readChoice();
  if (initialChoice === 'granted') enableAnalytics();
  else {
    window[`ga-disable-${MEASUREMENT_ID}`] = true;
    deleteAnalyticsCookies();
  }

  function init() {
    injectStyles();
    document.querySelectorAll('[data-consent-open]').forEach(element => {
      element.classList.add('sc-consent-link');
      element.addEventListener('click', event => { event.preventDefault(); showBanner(true); });
    });
    document.addEventListener('click', handleInteraction, true);
    renderTexts();
    syncLinkStyles();
    new MutationObserver(() => { renderTexts(); syncLinkStyles(); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'data-theme', 'class'] });
    if (!initialChoice) showBanner();
  }

  window.showcaseConsent = { open: () => showBanner(true) };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
