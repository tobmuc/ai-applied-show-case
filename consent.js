/*
 * Cookie consent banner + Google Consent Mode v2 + Serverless Page Counter.
 * gtag.js is only loaded after the visitor opts in, and gtag('config') is
 * queued AFTER consent update so the initial page_view carries gcs=G101.
 */
(() => {
  const MEASUREMENT_ID = 'G-NXHY8714SY';
  const STORAGE_KEY = 'ai-showcase-consent';
  const CONSENT_VERSION = 1;
  const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;
  const COUNTER_NAMESPACE = 'tobmuc-ai-applied-show-case';
  const COUNTER_API = 'https://abacus.jasoncameron.dev';
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
      viewsLabel: 'Aufrufe',
    },
    en: {
      title: 'Cookies & audience measurement',
      body: 'With your consent, I use Google Analytics to create visit statistics. Google sets cookies and receives data such as your IP address; data may be transferred to the USA. Without consent, Google Analytics is not loaded. You can change your choice at any time via “Cookie settings” in the footer.',
      privacy: 'Privacy notice',
      accept: 'Accept',
      reject: 'Reject',
      settings: 'Cookie settings',
      viewsLabel: 'views',
    },
  };

  window.dataLayer = window.dataLayer || [];
  const gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  window.gtag = gtag;

  let banner = null;
  let tagLoaded = false;
  let configSent = false;
  let latestCounterStats = null;

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

  function removePreQueuedConfig() {
    if (!Array.isArray(window.dataLayer)) return;
    for (let i = window.dataLayer.length - 1; i >= 0; i--) {
      const entry = window.dataLayer[i];
      if (entry && entry[0] === 'config' && entry[1] === MEASUREMENT_ID) {
        window.dataLayer.splice(i, 1);
      }
    }
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
      removePreQueuedConfig();
      gtag('consent', 'update', { analytics_storage: 'granted' });
      if (!configSent) {
        configSent = true;
        gtag('config', MEASUREMENT_ID, { send_page_view: true });
      }
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

  function pageCounterKey() {
    const path = location.pathname.toLowerCase();
    if (path.includes('feedback-intelligence')) return 'feedback-intelligence';
    if (path.includes('chat-your-data')) return 'chat-your-data';
    if (path.includes('datenschutzhinweise')) return 'privacy';
    if (path.endsWith('/index.html')) return null;
    return 'showcase-infographic';
  }

  async function updateServerlessCounter() {
    const pageKey = pageCounterKey();
    if (!pageKey) return;
    const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    const sessionKey = `sc-counted-${pageKey}`;
    let alreadyCountedInSession = false;
    try {
      alreadyCountedInSession = sessionStorage.getItem(sessionKey) === '1';
    } catch {}

    const action = (!isLocal && !alreadyCountedInSession) ? 'hit' : 'get';
    try {
      const [pageRes, totalRes] = await Promise.all([
        fetch(`${COUNTER_API}/${action}/${COUNTER_NAMESPACE}/${pageKey}`, { mode: 'cors', cache: 'no-store' }),
        fetch(`${COUNTER_API}/${action}/${COUNTER_NAMESPACE}/total`, { mode: 'cors', cache: 'no-store' }),
      ]);
      if (action === 'hit') {
        try { sessionStorage.setItem(sessionKey, '1'); } catch {}
      }
      const pageData = pageRes.ok ? await pageRes.json() : null;
      const totalData = totalRes.ok ? await totalRes.json() : null;
      const pageViews = typeof pageData?.value === 'number' && pageData.value >= 0 ? pageData.value : 0;
      const totalViews = typeof totalData?.value === 'number' && totalData.value >= 0 ? totalData.value : pageViews;
      latestCounterStats = { pageKey, pageViews, totalViews };
      renderCounterBadge();
    } catch {
      /* Fail silently if offline. */
    }
  }

  function renderCounterBadge() {
    if (!latestCounterStats) return;
    let badge = document.getElementById('sc-view-counter');
    if (!badge) {
      const consentBtn = document.querySelector('[data-consent-open]');
      if (!consentBtn || !consentBtn.parentElement) return;
      badge = document.createElement('span');
      badge.id = 'sc-view-counter';
      badge.className = 'sc-view-counter';
      consentBtn.insertAdjacentElement('afterend', badge);
    }
    const lang = language();
    const t = texts[lang];
    const formattedPage = latestCounterStats.pageViews.toLocaleString(lang === 'de' ? 'de-DE' : 'en-US');
    const formattedTotal = latestCounterStats.totalViews.toLocaleString(lang === 'de' ? 'de-DE' : 'en-US');
    badge.textContent = `👁 ${formattedTotal} ${t.viewsLabel}`;
    badge.title = lang === 'de'
      ? `Gesamt: ${formattedTotal} Aufrufe · Diese Seite (${latestCounterStats.pageKey}): ${formattedPage}`
      : `Total: ${formattedTotal} views · This page (${latestCounterStats.pageKey}): ${formattedPage}`;
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
      .sc-view-counter { display: inline-flex; align-items: center; gap: 4px; padding: 1px 7px; border-radius: 999px;
        border: 1px solid rgba(128,150,155,.28); font-size: .92em; font-variant-numeric: tabular-nums; opacity: .85; white-space: nowrap; }
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
    renderCounterBadge();
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

  removePreQueuedConfig();
  const initialChoice = readChoice();
  if (initialChoice) applyChoice(initialChoice);

  function init() {
    injectStyles();
    document.querySelectorAll('[data-consent-open]').forEach(element => {
      element.classList.add('sc-consent-link');
      element.addEventListener('click', event => { event.preventDefault(); showBanner(true); });
    });
    renderTexts();
    syncLinkStyles();
    new MutationObserver(() => { renderTexts(); syncLinkStyles(); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'data-theme', 'class'] });
    if (!initialChoice) showBanner();
    updateServerlessCounter();
  }

  window.showcaseConsent = {
    open: () => showBanner(true),
    stats: () => latestCounterStats,
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
