(() => {
  "use strict";

  // Keep local previews and non-production hosts out of the statistics.
  if (location.hostname !== "tobmuc.github.io") return;

  const endpoint = window.SHOWCASE_GOATCOUNTER_ENDPOINT;
  if (!/^https:\/\/[a-z0-9-]+\.goatcounter\.com\/count\/?$/i.test(endpoint || "")) return;
  if (document.getElementById("showcase-goatcounter-script")) return;

  const script = document.createElement("script");
  script.id = "showcase-goatcounter-script";
  script.dataset.goatcounter = endpoint.replace(/\/+$/, "");
  script.async = true;
  script.src = "https://gc.zgo.at/count.js";
  script.onerror = () => console.warn("GoatCounter could not be loaded.");
  document.head.appendChild(script);
})();