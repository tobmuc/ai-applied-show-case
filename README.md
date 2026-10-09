# AI Applied Showcase — Overview

A bilingual static portfolio hub connecting two AI solution concepts: multilingual feedback intelligence and natural-language analytics.

## Sites

- Feedback intelligence: https://tobmuc.github.io/ai-applied-show-case/ai-applied-show-case-feedback-intelligence/
- Chat your data: https://tobmuc.github.io/ai-applied-show-case/ai-applied-show-case-chat-your-data/
- Combined overview: https://tobmuc.github.io/ai-applied-show-case/
- Alternative Pages URL with the same content: https://tobmuc.github.io/my-ai-show-cases/

The overview explicitly summarizes the intended benefits of the combined design. All examples are illustrative; none of the sites connects to production systems or company data.

## Skills represented in the showcases

The overview now maps the skills applied by the portfolio owner to specific steps in both solutions, with visible evidence in the demos: product discovery and requirements framing; multilingual normalization, NLP taxonomy and sentiment; feature and KPI semantics; data/warehouse architecture; quality and governance; BI/data storytelling; responsive and accessible frontend; localization; testing, CSV/XLSX/PPTX export; and GitHub Pages delivery.

## Use-case differentiators and illustrative savings scenario

The overview and individual pages call out distinct strengths: multilingual feedback is retained with traceable feature and operating context plus a reviewable classification design. The Veezoo app-analytics target is asynchronous self-service over shared business semantics, intended to reduce repetitive ad-hoc analysis requests to partners and service providers. It also aims to provide presentation-ready app/feature visualizations for management, monitor usage after feature launches, and let teams test their own hypotheses and explore potential usage correlations. Those portal, live-query, before/after and correlation capabilities remain architecture targets; the current browser demo simulates the query/results, while its CSV/XLSX/PPTX export works on sample data.

For feedback classification, the illustrative baseline uses 1,000 items per processing day, 1.5 minutes of manual handling per item, €40 loaded labor cost/hour, 250 processing days/year and €4/day for translation/LLM tokens. That gives €250,000/year of scenario manual labor cost, €1,000/year of token cost and a €249,000/year gross direct-labor difference. The handling time and labor rate are assumptions, not measured facts; to exceed €200,000 under these assumptions requires more than about 1.21 minutes of manual handling per item. If processing occurs on 365 calendar days, the same inputs yield about €363,540/year gross (€365,000 labor minus €1,460 tokens). Implementation, review, infrastructure and other operating costs are excluded. Released capacity is not automatically cash savings or guaranteed net savings.

The static interfaces, simulated journeys, locale-aware German/English controls and CSV/XLSX/PPTX downloads from sample data are implemented. Connections to live feedback channels, AI inference, Countly/Azure ingestion, Veezoo-to-VQL execution, Databricks and production BI are architectural concepts only—not active integrations.

## Repository structure

- `index.html` — combined overview, benefits and skills map
- `ai-applied-show-case-feedback-intelligence/index.html` — feedback pipeline showcase
- `ai-applied-show-case-chat-your-data/index.html` — natural-language analytics showcase
- `analytics-config.js` — optional, blank-by-default GA4 Measurement ID
- `analytics-consent.js` — shared opt-in, preferences and withdrawal flow

## Google Analytics 4 (optional)

GA4 is not active until a valid public Measurement ID (`G-...`) is added to `analytics-config.js`. The shared consent script loads the Google tag only after a visitor explicitly opts in; a visitor can reject or later change/withdraw the choice. The same Measurement ID can cover both GitHub Pages paths because they share the `tobmuc.github.io` hostname. The Measurement ID is a public identifier, not an API secret.

The standard GA4 service has a no-cost version; Google Analytics 360 is paid. This repository cannot create a property inside a Google account. In the Google account that should own the data, create a GA4 property (e.g. “My AI Showcases”, reporting timezone Europe/Berlin, currency EUR), then add a Web data stream for `https://tobmuc.github.io`. Copy its `G-...` Measurement ID and provide it to enable collection. See Google's [setup guide](https://support.google.com/analytics/answer/9304153?hl=en) and [tag ID guide](https://support.google.com/analytics/answer/9539598?hl=en).

Before activation, publish a site-specific privacy notice with the data controller/contact and the applicable Google Analytics disclosures/retention settings. The consent UI is a technical safeguard, not legal advice or a substitute for that notice.

Files: `analytics-config.js` contains the Measurement ID placeholder; `analytics-consent.js` implements consent-before-load, rejection, settings and withdrawal.

## Local preview

Open `index.html` in a browser. The language is selected from the browser's preferred languages on first visit; the DE/EN control stores a manual choice locally. Without a GA4 Measurement ID, no analytics consent UI or Google tag is loaded. With an ID configured, the shared consent UI appears and Google Analytics is loaded only after opt-in.

---

# AI Applied Showcase — Übersicht

Eine zweisprachige statische Portfolio-Übersicht, die zwei KI-Lösungskonzepte verbindet: mehrsprachige Feedback-Intelligence und natürlichsprachliche Datenanalyse.

## Seiten

- Feedback Intelligence: https://tobmuc.github.io/ai-applied-show-case/ai-applied-show-case-feedback-intelligence/
- Chat Your Data: https://tobmuc.github.io/ai-applied-show-case/ai-applied-show-case-chat-your-data/
- Kombinierte Übersicht: https://tobmuc.github.io/ai-applied-show-case/
- Zusätzliche Pages-URL mit identischem Inhalt: https://tobmuc.github.io/my-ai-show-cases/

Die Übersicht benennt ausdrücklich die vorgesehenen Vorteile des kombinierten Designs. Alle Beispiele sind illustrativ; keine Seite ist mit Produktivsystemen oder Unternehmensdaten verbunden.

## Dargestellte Kompetenzen

Das Portfolio ordnet die benötigten Fähigkeiten entlang des gesamten Lösungswegs ein: Produkt- und Geschäftsanalysen, Customer-Journey-Design, Daten- und Cloud-Architektur, mehrsprachiges NLP und Lokalisierung, semantische/KPI-Modellierung, Datenqualität und Governance, BI und Data Storytelling, responsives Frontend-UX, Barrierefreiheit, browserbasierte Sprachumschaltung, Tests und Exportbereitstellung.

## Alleinstellungsmerkmale und beispielhaftes Einsparszenario

Übersicht und Einzelseiten arbeiten die jeweiligen USPs heraus: Beim mehrsprachigen Feedback bleiben Originalstimme, nachvollziehbarer Feature-/Betriebskontext und ein prüfbares Klassifikationsdesign verbunden. Das Veezoo-App-Analytics-Zielbild ist asynchroner Self-Service auf Basis gemeinsamer Geschäftssemantik und soll wiederholte Ad-hoc-Analyseanfragen an Partner und Dienstleister reduzieren. Es zielt außerdem auf präsentationsfertige App-/Feature-Visualisierungen fürs Management, die Beobachtung der Feature-Nutzung nach einem Launch sowie die Prüfung eigener Produkthypothesen und möglicher Nutzungskorrelationen. Diese Portal-, Live-Abfrage-, Vorher/Nachher- und Korrelationsfunktionen sind Architekturziele; die aktuelle Browser-Demo simuliert Abfrage und Ergebnisse, während ihr CSV-/XLSX-/PPTX-Export mit Beispieldaten funktioniert.

Für die Feedback-Klassifizierung verwendet das illustrative Basisszenario 1.000 Feedbacks pro Verarbeitungstag, 1,5 Minuten manuelle Bearbeitung je Feedback, 40 € Arbeitsvollkosten pro Stunde, 250 Verarbeitungstage pro Jahr und 4 € tägliche Tokenkosten für Übersetzung/LLM. Daraus ergeben sich 250.000 € jährliche manuelle Arbeitskosten im Szenario, 1.000 € Tokenkosten und eine Brutto-Differenz direkter Arbeitskosten von 249.000 € pro Jahr. Bearbeitungszeit und Stundensatz sind Annahmen, keine Messwerte; für mehr als 200.000 € Differenz wären unter diesen Annahmen mehr als etwa 1,21 Minuten manuelle Bearbeitung je Feedback erforderlich. Bei Verarbeitung an 365 Kalendertagen ergeben dieselben Eingaben etwa 363.540 € Brutto-Differenz pro Jahr (365.000 € Arbeitskosten minus 1.460 € Tokenkosten). Implementierung, Prüfung, Infrastruktur und weitere Betriebskosten sind nicht enthalten. Freiwerdende Kapazität ist keine automatische zahlungswirksame oder garantierte Nettoeinsparung.

Die statischen Oberflächen, simulierten Nutzerabläufe, deutsch-englischen Sprachsteuerungen und CSV-/XLSX-/PPTX-Downloads aus Beispieldaten sind umgesetzt. Anbindungen an Live-Feedbackkanäle, KI-Inferenz, Countly-/Azure-Datenaufnahme, Veezoo-zu-VQL-Ausführung, Databricks und produktive BI sind nur Architekturkonzepte und keine aktiven Integrationen.

## Repository-Struktur

- `index.html` — kombinierte Übersicht, Vorteile, USPs und Kompetenzmatrix
- `ai-applied-show-case-feedback-intelligence/index.html` — Feedback-Pipeline-Showcase
- `ai-applied-show-case-chat-your-data/index.html` — Showcase für natürlichsprachliche Datenanalyse
- `analytics-config.js` — optionale, standardmäßig leere GA4-Measurement-ID
- `analytics-consent.js` — gemeinsame Einwilligungs-, Einstellungs- und Widerrufssteuerung

## Google Analytics 4 (optional)

GA4 ist erst aktiv, wenn in `analytics-config.js` eine gültige öffentliche Measurement ID (`G-...`) eingetragen ist. Das gemeinsame Consent-Skript lädt das Google-Tag ausschließlich nach ausdrücklicher Zustimmung; Besucher können ablehnen oder die Auswahl später ändern/widerrufen. Dieselbe Measurement ID kann beide GitHub-Pages-Pfade erfassen, da beide denselben Hostnamen `tobmuc.github.io` nutzen. Die Measurement ID ist ein öffentlicher Bezeichner, kein API-Geheimnis.

GA4 Standard gibt es in einer kostenfreien Version; Google Analytics 360 ist kostenpflichtig. Dieses Repository kann keine Property im Google-Konto anlegen. Lege im Google-Konto, das die Daten besitzen soll, eine GA4-Property an (z. B. „My AI Showcases“, Zeitzone Europe/Berlin, Währung EUR) und füge einen Web-Datenstream für `https://tobmuc.github.io` hinzu. Kopiere dessen Measurement ID `G-...` und übermittle sie zum Aktivieren der Erfassung. Google beschreibt das in der [Einrichtungsanleitung](https://support.google.com/analytics/answer/9304153?hl=de) und der [Anleitung zur Google-Tag-ID](https://support.google.com/analytics/answer/9539598?hl=de).

Vor Aktivierung sollte eine projektspezifische Datenschutzerklärung mit Verantwortlichem/Kontakt sowie den passenden Google-Analytics-Hinweisen und Aufbewahrungseinstellungen veröffentlicht werden. Die Consent-Oberfläche ist eine technische Schutzmaßnahme, keine Rechtsberatung und kein Ersatz für diese Erklärung.

Dateien: `analytics-config.js` enthält den Measurement-ID-Platzhalter; `analytics-consent.js` implementiert Laden erst nach Einwilligung, Ablehnung, Einstellungen und Widerruf.

## Lokale Vorschau

`index.html` im Browser öffnen. Beim ersten Besuch richtet sich die Sprache nach den bevorzugten Browsersprachen; die DE/EN-Steuerung speichert eine manuelle Auswahl lokal. Ohne GA4-Measurement-ID erscheinen weder Consent-Oberfläche noch Google-Tag. Mit eingetragener ID erscheint die Einwilligung; Google Analytics wird erst nach Zustimmung geladen.
