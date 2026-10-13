/*
 * Cookie consent banner + Google Consent Mode v2 (basic implementation).
 * gtag.js is only loaded after the visitor opts in. Pages must define the
 * consent defaults and the queued gtag('config') call before this script.
 */
(() => {
  const MEASUREMENT_ID = 'G-NXHY8714SY';
  const STORAGE_KEY = 'ai-showcase-consent';
  const CONSENT_VERSION = 1;
  const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;
  const scriptUrl = document.currentScript ? document.currentScript.src : location.href;
  const privacyUrl = new URL('datenschutzhinweise.html', scriptUrl).href;

  const texts = {
    de: {
      title: 'Cookies & Reichweitenmessung',
      body: 'Mit deiner Einwilligung nutze ich Google Analytics, um Besuchsstatistiken zu erstellen. Dabei setzt Google Cookies und erhält u. a. deine IP-Adresse; eine Übermittlung in die USA ist möglich. Ohne Einwilligung wird Google Analytics nicht geladen. Du kannst deine Wahl jederzeit über „Cookie-Einstellungen“ im Footer ändern.',
      privacy: 'Datenschutzhinweise',
      accept: 'Akzeptieren',
      reject: 'Ablehnen',
      settings: 'Cookie-Einstellungen',
    },
    en: {
      title: 'Cookies & audience measurement',
      body: 'With your consent, I use Google Analytics to create visit statistics. Google sets cookies and receives data such as your IP address; data may be transferred to the USA. Without consent, Google Analytics is not loaded. You can change your choice at any time via “Cookie settings” in the footer.',
      privacy: 'Privacy notice',
      accept: 'Accept',
      reject: 'Reject',
      settings: 'Cookie settings',
    },
  };

  window.dataLayer = window.dataLayer || [];
  const gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  window.gtag = gtag;

  let banner = null;
  let tagLoaded = false;

  function language() {
    return (document.documentElement.lang || '').toLowerCase().startsWith('de') ? 'de' : 'en';
  }

  function readChoice() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!stored || stored.version !== CONSENT_VERSION) return null;
      if (stored.analytics !== 'granted' && stored.analytics !== 'denied') return null;
      if (typeof stored.timestamp !== 'number' || Date.now() - stored.timestamp > MAX_AGE_MS) return null;
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

  function loadGoogleTag() {
    if (tagLoaded) return;
    tagLoaded = true;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.append(script);
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

  function applyChoice(analytics) {
    if (analytics === 'granted') {
      gtag('consent', 'update', { analytics_storage: 'granted' });
      loadGoogleTag();
    } else {
      gtag('consent', 'update', { analytics_storage: 'denied' });
      deleteAnalyticsCookies();
    }
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
      .sc-consent h2 { margin: 0 0 8px; font-size: 16px; font-weight: 700; color: inherit; }
      .sc-consent p { margin: 0 0 14px; color: #c9d6d2; }
      .sc-consent a { color: #8fd3c1; text-decoration: underline; }
      .sc-consent-actions { display: flex; flex-wrap: wrap; gap: 10px; }
      .sc-consent-actions button { flex: 1 1 140px; min-height: 42px; padding: 10px 16px; border-radius: 10px; cursor: pointer;
        font: 600 14px/1.2 inherit; font-family: inherit; border: 1px solid #8fd3c1; background: transparent; color: #eef4f2; }
      .sc-consent-actions button[data-choice="granted"] { background: #8fd3c1; color: #0b1416; }
      .sc-consent-actions button:hover { filter: brightness(1.1); }
      .sc-consent-actions button:focus-visible, .sc-consent a:focus-visible { outline: 3px solid #f6c453; outline-offset: 2px; }
      .sc-consent-link { background: none; border: 0; padding: 0; margin: 0; font: inherit; color: inherit; text-decoration: underline; cursor: pointer; }
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

  const initialChoice = readChoice();
  if (initialChoice) applyChoice(initialChoice);

  function init() {
    injectStyles();
    document.querySelectorAll('[data-consent-open]').forEach(element => {
      element.classList.add('sc-consent-link');
      element.addEventListener('click', event => { event.preventDefault(); showBanner(true); });
    });
    renderTexts();
    new MutationObserver(renderTexts).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    if (!initialChoice) showBanner();
  }

  window.showcaseConsent = { open: () => showBanner(true) };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
