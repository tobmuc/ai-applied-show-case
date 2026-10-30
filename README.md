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

Jede Seite setzt Google Consent Mode v2 standardmäßig auf `denied` und bindet `consent.js` ein. Google Analytics (`G-NGR4GFF8Q4`) wird erst nach Zustimmung aktiv. Die Auswahl wird unter `ai-showcase-consent` in `localStorage` gespeichert; der Footer-Button „Cookie-Einstellungen“ öffnet den Banner erneut. Bei Änderungen am Tracking `datenschutzhinweise.html` mitpflegen.
