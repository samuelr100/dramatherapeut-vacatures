# Vacatures dramatherapie

Zoekt elke dag vacatures voor een dramatherapeut die met kinderen wil werken, zet ze op een pagina en mailt nieuwe vacatures.

- `src/config.mjs`: zoektermen, plaatsen, bronnen en punten aanpassen
- `src/collect.mjs`: het verzamelen (`node src/collect.mjs`)
- `docs/index.html`: de pagina, met de gegevens uit `docs/jobs.json`
- `.github/workflows/update.yml`: de dagelijkse run om 06:17 UTC en de mail

## GitHub-instellingen

- Pages: Settings → Pages → Deploy from a branch → `main` en `/docs`
- Secrets (Settings → Secrets and variables → Actions):
  - `MAIL_USERNAME`: het Gmail-adres van de afzender
  - `MAIL_PASSWORD`: het app-wachtwoord van dat Gmail-adres
  - `MAIL_TO`: het adres dat de mails ontvangt; verander dit om de mails ergens anders te laten aankomen
