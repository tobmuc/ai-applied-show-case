# AI Applied Showcase — Infographic

A bilingual static portfolio hub connecting two AI solution concepts: multilingual feedback intelligence and natural-language analytics.

## Sites

- Feedback intelligence: https://tobmuc.github.io/ai-applied-show-case/ai-applied-show-case-feedback-intelligence/
- Chat your data: https://tobmuc.github.io/ai-applied-show-case/ai-applied-show-case-chat-your-data/
- Combined overview: https://tobmuc.github.io/ai-applied-show-case/
- Alternative Pages URL with the same content: https://tobmuc.github.io/my-ai-show-cases/

The overview explicitly summarizes the intended benefits of the combined design. All examples are illustrative; none of the sites connects to production systems or company data.

## Skills represented in the showcases

The infographic summarizes the applied capabilities across the two prototypes: product and requirements analysis; data, cloud and warehouse architecture; multilingual NLP and localization; semantic and KPI modeling; quality and governance; BI storytelling; and accessible frontend, UX and delivery. The individual demos show concrete examples, while clearly distinguishing working browser interactions from architecture concepts.

## Use-case differentiators and illustrative savings scenario

The overview and individual pages call out distinct strengths: multilingual feedback is retained with traceable feature and operating context plus a reviewable classification design. The Veezoo app-analytics target is asynchronous self-service over shared business semantics, intended to reduce repetitive ad-hoc analysis requests to partners and service providers. It also aims to provide presentation-ready app/feature visualizations for management, monitor usage after feature launches, and let teams test their own hypotheses and explore potential usage correlations. Those portal, live-query, before/after and correlation capabilities remain architecture targets; the current browser demo simulates the query/results, while its CSV/XLSX/PPTX export works on sample data.

For feedback classification, the illustrative baseline uses 1,000 items per processing day, 1.5 minutes of manual handling per item, €40 loaded labor cost/hour, 250 processing days/year and €4/day for translation/LLM tokens. That gives €250,000/year of scenario manual labor cost, €1,000/year of token cost and a €249,000/year gross direct-labor difference. The handling time and labor rate are assumptions, not measured facts; to exceed €200,000 under these assumptions requires more than about 1.21 minutes of manual handling per item. If processing occurs on 365 calendar days, the same inputs yield about €363,540/year gross (€365,000 labor minus €1,460 tokens). Implementation, review, infrastructure and other operating costs are excluded. Released capacity is not automatically cash savings or guaranteed net savings.

The static interfaces, simulated journeys, locale-aware German/English controls and CSV/XLSX/PPTX downloads from sample data are implemented. Connections to live feedback channels, AI inference, Countly/Azure ingestion, Veezoo-to-VQL execution, Databricks and production BI are architectural concepts only—not active integrations.

## Repository structure

- `index.html` — immediate redirect to the infographic start page
- `showcase-infographic.html` — concise bilingual infographic connecting both use cases, USPs, skills and the illustrative savings scenario
- `ai-applied-show-case-feedback-intelligence/index.html` — feedback pipeline showcase
- `ai-applied-show-case-chat-your-data/index.html` — natural-language analytics showcase
- `goatcounter-config.js` — optional public GoatCounter endpoint; blank by default
- `goatcounter.js` — production-host-only loader for GoatCounter's privacy-oriented counter
- `datenschutzhinweise.html` — bilingual privacy-notice draft; controller/contact details still need completion

## GoatCounter (optional)

GoatCounter is the selected option for this personal hobby site. Its current terms allow personal websites and free reasonable public usage. The tracker is currently inactive: `goatcounter-config.js` contains an empty endpoint, so the loader sends no statistics. Google Analytics is not used.

To activate later, create a site at [GoatCounter signup](https://www.goatcounter.com/signup) for `tobmuc.github.io`, then copy its public counter endpoint from **Settings → Site code**, in the form `https://<site-code>.goatcounter.com/count`, into `goatcounter-config.js`. The same endpoint covers the main and alternate GitHub Pages URLs and their subpages: they share the `tobmuc.github.io` hostname and their paths distinguish the pages. The loader runs only on that production hostname; local previews and other hosts are ignored. Add `#toggle-goatcounter` to the page URL to exclude your own browser's visits.

GoatCounter's provider says its visitor counter uses no browser cookies, `localStorage` or persistent visitor IDs, and stores aggregate statistics; IP/User-Agent-derived values may be held in memory temporarily. Individual pageview collection is disabled by default and should remain disabled. See the provider's [privacy policy](https://www.goatcounter.com/help/privacy), [GDPR explanation](https://www.goatcounter.com/help/gdpr) and [terms](https://www.goatcounter.com/help/terms). These are the provider's statements, not legal advice or a guarantee that no notice/consent obligations apply in every jurisdiction.

Before entering an endpoint, complete and review the site-specific privacy notice, including the operator's public name/contact, legal basis and actual GoatCounter site settings. The current notice is explicitly a draft. The service endpoint is a public site identifier, not a secret; do not send account credentials.

## Local preview

Open `index.html` or `showcase-infographic.html` in a browser; the root page redirects to the infographic. Its language is selected from the browser's preferred languages on first visit; the DE/EN control stores a manual choice locally. GoatCounter is not loaded unless a valid endpoint is configured, and it is ignored on local preview hosts.

---

# AI Applied Showcase — Infografik

Eine zweisprachige statische Portfolio-Übersicht, die zwei KI-Lösungskonzepte verbindet: mehrsprachige Feedback-Intelligence und natürlichsprachliche Datenanalyse.

## Seiten

- Feedback Intelligence: https://tobmuc.github.io/ai-applied-show-case/ai-applied-show-case-feedback-intelligence/
- Chat Your Data: https://tobmuc.github.io/ai-applied-show-case/ai-applied-show-case-chat-your-data/
- Kombinierte Übersicht: https://tobmuc.github.io/ai-applied-show-case/
- Zusätzliche Pages-URL mit identischem Inhalt: https://tobmuc.github.io/my-ai-show-cases/

Die Übersicht benennt ausdrücklich die vorgesehenen Vorteile des kombinierten Designs. Alle Beispiele sind illustrativ; keine Seite ist mit Produktivsystemen oder Unternehmensdaten verbunden.

## Dargestellte Kompetenzen

Die Infografik fasst die eingesetzten Kompetenzen über beide Prototypen hinweg zusammen: Produkt- und Anforderungsanalyse, Daten-, Cloud- und Warehouse-Architektur, mehrsprachiges NLP und Lokalisierung, semantische/KPI-Modellierung, Qualität und Governance, BI-Storytelling sowie barrierearmes Frontend, UX und Umsetzung. Die Einzeldemos zeigen konkrete Beispiele und grenzen funktionierende Browser-Interaktionen klar von Architekturkonzepten ab.

## Alleinstellungsmerkmale und beispielhaftes Einsparszenario

Übersicht und Einzelseiten arbeiten die jeweiligen USPs heraus: Beim mehrsprachigen Feedback bleiben Originalstimme, nachvollziehbarer Feature-/Betriebskontext und ein prüfbares Klassifikationsdesign verbunden. Das Veezoo-App-Analytics-Zielbild ist asynchroner Self-Service auf Basis gemeinsamer Geschäftssemantik und soll wiederholte Ad-hoc-Analyseanfragen an Partner und Dienstleister reduzieren. Es zielt außerdem auf präsentationsfertige App-/Feature-Visualisierungen fürs Management, die Beobachtung der Feature-Nutzung nach einem Launch sowie die Prüfung eigener Produkthypothesen und möglicher Nutzungskorrelationen. Diese Portal-, Live-Abfrage-, Vorher/Nachher- und Korrelationsfunktionen sind Architekturziele; die aktuelle Browser-Demo simuliert Abfrage und Ergebnisse, während ihr CSV-/XLSX-/PPTX-Export mit Beispieldaten funktioniert.

Für die Feedback-Klassifizierung verwendet das illustrative Basisszenario 1.000 Feedbacks pro Verarbeitungstag, 1,5 Minuten manuelle Bearbeitung je Feedback, 40 € Arbeitsvollkosten pro Stunde, 250 Verarbeitungstage pro Jahr und 4 € tägliche Tokenkosten für Übersetzung/LLM. Daraus ergeben sich 250.000 € jährliche manuelle Arbeitskosten im Szenario, 1.000 € Tokenkosten und eine Brutto-Differenz direkter Arbeitskosten von 249.000 € pro Jahr. Bearbeitungszeit und Stundensatz sind Annahmen, keine Messwerte; für mehr als 200.000 € Differenz wären unter diesen Annahmen mehr als etwa 1,21 Minuten manuelle Bearbeitung je Feedback erforderlich. Bei Verarbeitung an 365 Kalendertagen ergeben dieselben Eingaben etwa 363.540 € Brutto-Differenz pro Jahr (365.000 € Arbeitskosten minus 1.460 € Tokenkosten). Implementierung, Prüfung, Infrastruktur und weitere Betriebskosten sind nicht enthalten. Freiwerdende Kapazität ist keine automatische zahlungswirksame oder garantierte Nettoeinsparung.

Die statischen Oberflächen, simulierten Nutzerabläufe, deutsch-englischen Sprachsteuerungen und CSV-/XLSX-/PPTX-Downloads aus Beispieldaten sind umgesetzt. Anbindungen an Live-Feedbackkanäle, KI-Inferenz, Countly-/Azure-Datenaufnahme, Veezoo-zu-VQL-Ausführung, Databricks und produktive BI sind nur Architekturkonzepte und keine aktiven Integrationen.

## Repository-Struktur

- `index.html` — sofortige Weiterleitung auf die Infografik-Startseite
- `showcase-infographic.html` — kompakte zweisprachige Infografik zu beiden Use Cases, USPs, Kompetenzen und Einsparszenario
- `ai-applied-show-case-feedback-intelligence/index.html` — Feedback-Pipeline-Showcase
- `ai-applied-show-case-chat-your-data/index.html` — Showcase für natürlichsprachliche Datenanalyse
- `goatcounter-config.js` — optionaler öffentlicher GoatCounter-Endpunkt, standardmäßig leer
- `goatcounter.js` — Loader nur für den produktiven Host und den GoatCounter-Zähler
- `datenschutzhinweise.html` — zweisprachiger Entwurf; Name/Kontakt des Verantwortlichen fehlen noch

## GoatCounter (optional)

Für diese private Hobby-Website ist GoatCounter als datensparsame Alternative vorgesehen. Laut den aktuellen Nutzungsbedingungen sind persönliche Websites und übliche öffentliche Nutzung kostenfrei. Der Tracker ist momentan **inaktiv**: In `goatcounter-config.js` ist der Endpunkt leer, daher werden keine Statistikdaten gesendet. Google Analytics wird nicht verwendet.

Zur späteren Aktivierung erstelle eine Site unter [GoatCounter-Anmeldung](https://www.goatcounter.com/signup) für `tobmuc.github.io` und kopiere anschließend den öffentlichen Zähler-Endpunkt aus **Settings → Site code** im Format `https://<site-code>.goatcounter.com/count` in `goatcounter-config.js`. Derselbe Endpunkt erfasst Haupt- und zusätzliche GitHub-Pages-URL samt Unterseiten: Sie teilen den Hostnamen `tobmuc.github.io`, die Pfade unterscheiden die Seiten. Der Loader läuft nur auf diesem Produktions-Host; lokale Vorschauen und andere Hosts werden ignoriert. Mit `#toggle-goatcounter` in der Seitenadresse kannst du Besuche deines eigenen Browsers ausschließen.

Der GoatCounter-Anbieter erklärt, dass sein Besucherzähler weder Browser-Cookies noch `localStorage` oder dauerhafte Besucherkennungen nutzt und aggregierte Statistiken speichert; aus IP/User-Agent abgeleitete Werte können vorübergehend im Arbeitsspeicher verarbeitet werden. Die optionale Erfassung einzelner Seitenaufrufe ist standardmäßig deaktiviert und sollte ausgeschaltet bleiben. Siehe die [Datenschutzhinweise](https://www.goatcounter.com/help/privacy), die [GDPR-Erläuterung](https://www.goatcounter.com/help/gdpr) und die [Nutzungsbedingungen](https://www.goatcounter.com/help/terms) des Anbieters. Das sind Anbieterangaben, keine Rechtsberatung und keine Garantie, dass in jeder Rechtsordnung keinerlei Hinweis- oder Einwilligungspflicht gilt.

Vor Eintragung eines Endpunkts müssen der projektspezifische Datenschutzhinweis mit öffentlichem Namen/Kontakt, die Rechtsgrundlage und die tatsächlichen GoatCounter-Site-Einstellungen geprüft und vervollständigt werden. Der vorhandene Datenschutzhinweis ist ausdrücklich noch ein Entwurf. Der Site-Endpunkt ist ein öffentlicher Bezeichner, kein Geheimnis; Zugangsdaten bitte nicht teilen.

## Lokale Vorschau

`index.html` oder direkt `showcase-infographic.html` im Browser öffnen; die Root-Seite leitet zur Infografik weiter. Beim ersten Besuch richtet sich deren Sprache nach den bevorzugten Browsersprachen; die DE/EN-Steuerung speichert eine manuelle Auswahl lokal. GoatCounter wird nur mit einem gültigen konfigurierten Endpunkt geladen und auf lokalen Vorschau-Hosts ignoriert.
