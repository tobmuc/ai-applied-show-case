import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { PlaywrightBlocker } from '@ghostery/adblocker-playwright';

const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const measurementId = 'G-NXHY8714SY';
const mimeTypes = {
  '.css': 'text/css',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function isGoogleUrl(value) {
  const hostname = new URL(value).hostname.toLowerCase();
  return ['google.com', 'googletagmanager.com', 'google-analytics.com']
    .some(domain => hostname === domain || hostname.endsWith(`.${domain}`));
}

const server = createServer(async (request, response) => {
  let pathname;
  try {
    pathname = new URL(request.url, 'http://127.0.0.1').pathname;
  } catch {
    response.writeHead(400).end();
    return;
  }

  if (pathname === '/') pathname = '/index.html';
  const filePath = resolve(root, `.${decodeURIComponent(pathname)}`);
  if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) {
    response.writeHead(403).end();
    return;
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      'content-type': mimeTypes[extname(filePath)] || 'application/octet-stream',
    });
    response.end(body);
  } catch {
    response.writeHead(404).end();
  }
});

await new Promise((resolveListen, rejectListen) => {
  server.once('error', rejectListen);
  server.listen(0, '127.0.0.1', resolveListen);
});

const address = server.address();
const baseUrl = `http://127.0.0.1:${address.port}`;
const browser = await chromium.launch({ headless: true });

async function installGoogleMock(page) {
  await page.route(url => isGoogleUrl(url), async route => {
    const url = new URL(route.request().url());

    if (url.hostname.endsWith('googletagmanager.com') && url.pathname === '/gtag/js') {
      await route.fulfill({
        contentType: 'application/javascript',
        body: `(() => {
          const commands = (window.dataLayer || []).map(command => Array.from(command));
          const events = [];
          window.__ga4Mock = { commands, events };
          const previousGtag = window.gtag;
          window.gtag = function(...args) {
            commands.push(args);
            if (args[0] === 'event') events.push({ name: args[1], parameters: args[2] || {} });
            return previousGtag.apply(window, args);
          };
        })();`,
      });
      return;
    }

    await route.fulfill({ status: 204 });
  });
}

function observeGoogleRequests(page, requests) {
  page.on('request', request => {
    if (isGoogleUrl(request.url())) requests.push(request.url());
  });
}

async function createContext() {
  return browser.newContext({ locale: 'de-DE' });
}

async function verifyNoConsentAndDecline(pathname) {
  const context = await createContext();
  await context.addCookies(['_ga', '_ga_OLD', '_gid', '_gat'].map(name => ({
    name,
    value: 'legacy',
    url: baseUrl,
  })));
  const page = await context.newPage();
  const googleRequests = [];
  observeGoogleRequests(page, googleRequests);
  await installGoogleMock(page);
  await page.addInitScript(() => {
    if (!localStorage.getItem('ai-showcase-consent')) {
      localStorage.setItem('ai-showcase-consent', JSON.stringify({
        version: 1,
        analytics: 'granted',
        timestamp: Date.now(),
      }));
    }
  });

  await page.goto(`${baseUrl}${pathname}?sensitive_query=must_not_be_sent#private-fragment`);
  await page.locator('.sc-consent:not([hidden])').waitFor();
  await page.waitForTimeout(300);
  assert.deepEqual(googleRequests, [], `${pathname}: no Google requests before consent`);
  assert.equal(await page.evaluate(() => typeof window.gtag), 'undefined', `${pathname}: no gtag before consent`);
  assert.deepEqual(
    (await context.cookies(baseUrl)).filter(cookie =>
      cookie.name === '_ga' || cookie.name.startsWith('_ga_') || ['_gid', '_gat'].includes(cookie.name)),
    [],
    `${pathname}: legacy analytics cookies are removed without current consent`,
  );

  await page.locator('[data-choice="denied"]').click();
  await page.waitForTimeout(300);
  assert.deepEqual(googleRequests, [], `${pathname}: no Google requests after decline`);
  assert.equal(
    JSON.parse(await page.evaluate(() => localStorage.getItem('ai-showcase-consent'))).analytics,
    'denied',
    `${pathname}: rejection is persisted`,
  );

  await page.reload();
  await page.waitForTimeout(300);
  assert.deepEqual(googleRequests, [], `${pathname}: rejection persists without Google requests`);
  assert.equal(await page.locator('.sc-consent').isVisible(), false, `${pathname}: stored rejection hides banner`);

  await page.locator('[data-consent-open]').first().click();
  assert.equal(await page.locator('.sc-consent').isVisible(), true, `${pathname}: settings can be reopened`);
  await page.locator('[data-choice="denied"]').click();
  assert.deepEqual(googleRequests, [], `${pathname}: reopening and declining still sends no Google request`);
  await context.close();
}

async function verifyAcceptedAnalytics(pathname) {
  const context = await createContext();
  const page = await context.newPage();
  const googleRequests = [];
  observeGoogleRequests(page, googleRequests);
  await installGoogleMock(page);
  await page.addInitScript(() => {
    document.addEventListener('click', event => {
      const link = event.target instanceof Element && event.target.closest('a[target="_blank"]');
      if (link) event.preventDefault();
    }, true);
  });

  await page.goto(`${baseUrl}${pathname}?private_search=do-not-collect#fragment`);
  await page.locator('.sc-consent:not([hidden])').waitFor();
  assert.deepEqual(googleRequests, [], `${pathname}: tag stays unloaded before opt-in`);

  await page.locator('[data-choice="granted"]').click();
  await page.waitForFunction(() => Boolean(window.__ga4Mock));
  assert.equal(
    JSON.parse(await page.evaluate(() => localStorage.getItem('ai-showcase-consent'))).analytics,
    'granted',
    `${pathname}: acceptance is persisted`,
  );
  const initialTracking = await page.evaluate(() => ({
    commands: window.__ga4Mock.commands,
    events: window.__ga4Mock.events,
  }));
  const scriptRequests = googleRequests.filter(url => url.includes('/gtag/js'));
  assert.equal(scriptRequests.length, 1, `${pathname}: one Google tag is loaded after opt-in`);
  assert.equal(new URL(scriptRequests[0]).searchParams.get('id'), measurementId);

  const config = initialTracking.commands.find(command => command[0] === 'config');
  assert.ok(config, `${pathname}: GA4 config command is queued`);
  assert.equal(config[1], measurementId);
  assert.equal(config[2].send_page_view, false);
  assert.equal(config[2].allow_google_signals, false);
  assert.equal(config[2].allow_ad_personalization_signals, false);
  assert.equal(config[2].page_location, `${baseUrl}${pathname}`);
  assert.equal(config[2].page_location.includes('?'), false);
  assert.equal(config[2].page_location.includes('#'), false);
  assert.ok(
    initialTracking.commands.some(command => command[0] === 'event' && command[1] === 'page_view'),
    `${pathname}: page view is sent only after opt-in`,
  );
  assert.ok(
    initialTracking.commands.some(command =>
      command[0] === 'consent' && command[1] === 'update' &&
      command[2].analytics_storage === 'granted' &&
      command[2].ad_storage === 'denied' &&
      command[2].ad_user_data === 'denied' &&
      command[2].ad_personalization === 'denied'),
    `${pathname}: analytics is granted while advertising storage stays denied`,
  );

  await page.locator('#language-toggle').click();
  const linkedin = page.locator('a[href*="linkedin.com"]').first();
  const instagram = page.locator('a[href*="instagram.com"]').first();
  assert.equal(await linkedin.getAttribute('href'), 'https://www.linkedin.com/in/tobias-your-new-ai-expert/');
  assert.equal(await instagram.getAttribute('href'), 'https://www.instagram.com/tobias.muenchen/');
  await linkedin.click();
  await instagram.click();

  await page.waitForFunction(
    () => window.__ga4Mock.events.some(event => event.name === 'active_visible_time'),
    undefined,
    { timeout: 20_000 },
  );

  const emitted = await page.evaluate(() => window.__ga4Mock.events);
  const interactions = emitted.filter(event => event.name === 'site_interaction');
  assert.ok(interactions.some(event => event.parameters.interaction_type === 'button_click'));
  assert.ok(interactions.some(event =>
    event.parameters.interaction_type === 'link_click' && event.parameters.link_type === 'external'));
  assert.ok(interactions.every(event =>
    !Object.hasOwn(event.parameters, 'link_url') &&
    !Object.hasOwn(event.parameters, 'link_text') &&
    !Object.hasOwn(event.parameters, 'page_location')));

  const activeTime = emitted.find(event => event.name === 'active_visible_time');
  assert.ok(activeTime.parameters.active_visible_seconds >= 14);
  assert.equal(Object.hasOwn(activeTime.parameters, 'engagement_time_msec'), false);
  assert.equal(JSON.stringify(emitted).includes('private_search'), false);
  assert.equal(JSON.stringify(emitted).includes('do-not-collect'), false);

  await page.locator('[data-consent-open]').first().click();
  const requestCountAtWithdrawal = googleRequests.length;
  await page.locator('[data-choice="denied"]').click();
  await page.waitForTimeout(300);
  assert.equal(await page.evaluate(id => window[`ga-disable-${id}`], measurementId), true);
  assert.equal(googleRequests.length, requestCountAtWithdrawal, `${pathname}: withdrawal sends no new Google request`);
  const eventCountAtWithdrawal = await page.evaluate(() => window.__ga4Mock.events.length);
  await page.locator('#language-toggle').click();
  await page.waitForTimeout(100);
  assert.equal(
    await page.evaluate(() => window.__ga4Mock.events.length),
    eventCountAtWithdrawal,
    `${pathname}: withdrawing consent stops further event collection`,
  );

  await page.reload();
  await page.waitForTimeout(300);
  assert.equal(
    googleRequests.length,
    requestCountAtWithdrawal,
    `${pathname}: stored decline prevents new Google requests after reload`,
  );
  await context.close();
}

async function verifyGhosteryBlocksGoogleTag() {
  const blocker = await PlaywrightBlocker.fromPrebuiltAdsAndTracking(fetch);
  const blockedRequests = [];
  const redirectedRequests = [];
  blocker.on('request-blocked', request => {
    if (isGoogleUrl(request.url)) blockedRequests.push(request.url);
  });
  blocker.on('request-redirected', (request, result) => {
    if (isGoogleUrl(request.url)) {
      redirectedRequests.push({
        url: request.url,
        filename: result.redirect?.filename,
        filter: result.filter?.toString(),
      });
    }
  });

  const context = await createContext();
  const page = await context.newPage();
  await blocker.enableBlockingInPage(page);
  await page.goto(`${baseUrl}/?ghostery_positive_control=1`);
  await page.locator('.sc-consent:not([hidden])').waitFor();
  await page.locator('[data-choice="granted"]').click();
  await page.waitForTimeout(1500);

  const gaTagWasBlocked = blockedRequests.some(url =>
    url.includes('googletagmanager.com/gtag/js') && url.includes(measurementId));
  const gaTagWasReplaced = redirectedRequests.some(request =>
    request.url.includes('googletagmanager.com/gtag/js') &&
    request.url.includes(measurementId) &&
    request.filename === 'google-analytics_analytics.js');
  assert.ok(gaTagWasBlocked || gaTagWasReplaced,
    'Ghostery should block or replace the configured Google tag with its analytics stub');
  assert.equal(await page.locator('script[data-showcase-ga4]').count(), 1);
  if (gaTagWasReplaced) {
    const redirect = redirectedRequests.find(request =>
      request.url.includes('googletagmanager.com/gtag/js') &&
      request.url.includes(measurementId));
    assert.match(redirect.filter, /redirect=googletagmanager_gtm\.js/);
  }

  await blocker.disableBlockingInPage(page);
  await context.close();
  console.log('PASS Ghostery engine blocks or replaces GA4 (engine test; not the Ghostery browser extension UI)');
}

try {
  await verifyNoConsentAndDecline('/');
  await verifyNoConsentAndDecline('/datenschutzhinweise.html');
  await verifyNoConsentAndDecline('/showcase-infographic.html');
  console.log('PASS no consent, persisted decline, and legacy-cookie cleanup on all page entry points');

  await verifyAcceptedAnalytics('/');
  await verifyAcceptedAnalytics('/datenschutzhinweise.html');
  console.log('PASS accepted GA4 config, interactions, visible time, withdrawal, and URL minimization');

  await verifyGhosteryBlocksGoogleTag();
} finally {
  await browser.close();
  await new Promise(resolveClose => server.close(resolveClose));
}
