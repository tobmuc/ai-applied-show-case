(() => {
  const config = window.SHOWCASE_ANALYTICS_CONFIG;
  if (!config || typeof config !== 'object') {
    console.error('Analytics configuration is missing.');
    return;
  }

  const scriptUrl = config.scriptUrl;
  const websiteId = config.websiteId;
  if (scriptUrl === '' && websiteId === '') return;
  if (typeof scriptUrl !== 'string' || typeof websiteId !== 'string' || !scriptUrl.trim() || !websiteId.trim()) {
    console.error('Set both Umami scriptUrl and websiteId in analytics-config.js, or leave both blank.');
    return;
  }

  let trackerUrl;
  try {
    trackerUrl = new URL(scriptUrl);
  } catch (error) {
    console.error('Umami scriptUrl must be a valid HTTPS URL.', error);
    return;
  }
  if (trackerUrl.protocol !== 'https:') {
    console.error('Umami scriptUrl must use HTTPS.');
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = trackerUrl.href;
  script.dataset.websiteId = websiteId.trim();
  script.addEventListener('load', () => {
    const umami = window.umami;
    if (typeof umami?.track !== 'function') {
      console.error('Umami loaded without exposing its tracking API.');
      return;
    }
    trackActiveTime(umami);
  }, { once: true });
  script.addEventListener('error', () => {
    console.error(`Unable to load Umami from ${trackerUrl.origin}.`);
  }, { once: true });
  document.head.append(script);

  function trackActiveTime(umami) {
    const reportingIntervalSeconds = 30;
    let accumulatedMilliseconds = 0;
    let visibleSince = document.visibilityState === 'visible' ? performance.now() : null;
    let reportedSeconds = 0;

    function activeSeconds() {
      const currentVisibleMilliseconds = visibleSince === null ? 0 : performance.now() - visibleSince;
      return Math.floor((accumulatedMilliseconds + currentVisibleMilliseconds) / 1000);
    }

    function report(force = false) {
      const totalSeconds = activeSeconds();
      const seconds = force
        ? totalSeconds
        : Math.floor(totalSeconds / reportingIntervalSeconds) * reportingIntervalSeconds;
      if (seconds <= reportedSeconds) return;
      reportedSeconds = seconds;
      try {
        const result = umami.track('active-time', { active_seconds: seconds });
        if (result && typeof result.catch === 'function') {
          result.catch(error => console.error('Umami active-time event failed.', error));
        }
      } catch (error) {
        console.error('Umami active-time event failed.', error);
      }
    }

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        if (visibleSince !== null) {
          accumulatedMilliseconds += performance.now() - visibleSince;
          visibleSince = null;
        }
        report(true);
      } else if (visibleSince === null) {
        visibleSince = performance.now();
      }
    });

    const heartbeat = window.setInterval(() => report(), reportingIntervalSeconds * 1000);
    window.addEventListener('pagehide', () => {
      if (visibleSince !== null) {
        accumulatedMilliseconds += performance.now() - visibleSince;
        visibleSince = null;
      }
      report(true);
      window.clearInterval(heartbeat);
    }, { once: true });
  }
})();
