# Tobias Burkard — AI Tool Consulting

Schlanke, zweisprachige (DE/EN) One-Page-Website mit Fokus auf das Skillset im Bereich AI Tool Consulting.

Live: https://tobmuc.github.io/ai-applied-show-case/

## Struktur

- `index.html` — Startseite (Skillset, Arbeitsweise, Werkzeugkasten, Kontakt)
- `showcase-infographic.html` — Weiterleitung auf die Startseite (für alte Links)
- `datenschutzhinweise.html` — zweisprachige Datenschutzhinweise
- `consent.js` — Cookie-Banner (Google Consent Mode v2, Standard: abgelehnt)

## Lokale Vorschau

`index.html` im Browser öffnen. Die Sprache richtet sich beim ersten Besuch nach den Browsereinstellungen; die DE/EN-Steuerung speichert die Auswahl lokal.

## Google Analytics & Cookie-Consent

Google Analytics 4 (`G-NXHY8714SY`) wird im Basic-Consent-Modus ausschließlich nach ausdrücklichem Opt-in geladen. Vorher und nach einer Ablehnung gibt es keine Google-Tag-Anfrage. Zustimmung und Ablehnung werden für höchstens zwölf Monate unter `ai-showcase-consent` in `localStorage` gespeichert; der Footer-Button „Cookie-Einstellungen“ öffnet den Banner zum Ändern der Wahl. Werbe-Speicherung, werbebezogene Nutzerdaten und personalisierte Werbung bleiben deaktiviert. Seitenaufrufe und allgemeine Interaktionen sowie aktive sichtbare Zeit werden nur mit Einwilligung erfasst; die von dieser Website gesendeten Seitenadressen sind query- und fragmentfrei, und benutzerdefinierte Interaktionsereignisse enthalten keine Linkziele oder Beschriftungen. Zusätzliche automatisch erfasste Ereignisse können von den Enhanced-Measurement-Einstellungen der GA4-Property abhängen; prüfe dort insbesondere ausgehende Klicks und Seitenänderungen. Änderungen am Tracking müssen in `datenschutzhinweise.html` beschrieben werden.

## Tracking tests

Installiere die Entwicklungsabhängigkeiten mit `npm install` und den Chromium-Browser bei Bedarf mit `npx playwright install chromium`. `npm run test:tracking` prüft die Consent-Abläufe auf der Startseite, der Datenschutzseite und dem alten Infografik-Weiterleitungslink und nutzt die offizielle Ghostery-Blocking-Engine (`@ghostery/adblocker-playwright`) als positiven Kontrolltest. Dieser Test prüft die Ghostery-Engine in Playwright, nicht die Ghostery-Browsererweiterung oder deren UI.
