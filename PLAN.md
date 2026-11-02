# Plan: vacaturezoeker dramatherapeut

Status: gebouwd en lokaal getest; nog niet online. De actuele bronnen staan in `src/config.mjs`.

## Doel

Eén pagina, te openen op laptop en telefoon, met vacatures die passen bij een net afgestudeerde dramatherapeut die graag met kinderen werkt. Bij nieuwe vacatures komt er een mail.

## Zoekprofiel

| Onderwerp | Keuze |
|---|---|
| Regio | Utrecht en omgeving, goed bereikbaar met OV (later mogelijk rijbewijs) |
| Contract | Voorkeur loondienst, zzp ook mogelijk |
| Uren | 4 tot 4,5 dag per week (ongeveer 32-36 uur) |
| Doelgroep | 1. 4-8 jaar, 2. rest van de basisschoolleeftijd, 3. jongeren |
| Werkplek, op voorkeur | 1. eigen praktijk of vaktherapiepraktijk, daarna jeugd-GGZ, jeugdzorg en regulier basisonderwijs |
| Verwante banen | Meenemen, maar met een filter uit te zetten |
| Mail | Ontvanger staat in GitHub Secrets en is later aan te passen |

## Zo werkt het

1. **Elke dag zoeken:** GitHub Actions start automatisch een script. De computer hoeft dus niet aan te staan.
2. **Filteren:** het script zoekt op functienamen en haalt dubbele vacatures weg.
   - Kernfuncties: dramatherapeut, vaktherapeut, creatief therapeut.
   - Verwante functies: bijvoorbeeld speltherapeut, jeugdbegeleider, leerlingbegeleider.
3. **Rangschikken:** vacatures krijgen punten op functie, doelgroep, regio, uren en werkplek. De beste staan bovenaan.
4. **Publiceren:** de pagina komt op GitHub Pages te staan.
5. **Mailen:** alleen als er nieuwe vacatures zijn.

## De pagina

- Per vacature: functie, werkgever, plaats, uren, sluitingsdatum, bron en een link naar de originele vacature.
- Filters: verwante banen aan/uit, regio, doelgroep, loondienst/zzp, nieuw.
- Status per vacature: interessant, gesolliciteerd, afgewezen, verbergen.
- Vacatures die niet meer online staan, worden gemarkeerd.

**Beperking:** de statussen worden in de browser bewaard, dus telefoon en laptop delen ze in de eerste versie niet. Blijkt dat lastig, dan kan synchroniseren later alsnog worden toegevoegd.

## Bronnen

Getest op 2 november 2026.

| Bron | Resultaat | Plan |
|---|---|---|
| Altrecht | Werkt, en is regionaal (o.a. Zeist, Woerden) | Meenemen |
| Zorgselect | Werkt via de sitemap, de functienaam staat in de link | Meenemen |
| Eemhart | Werkt, vermeldt ook uren en locatie | Meenemen |
| Meesterbaan | Bereikbaar; zoeken op functie nog niet bevestigd | Verder testen |
| Timon, Youké | Bereikbaar; uitlezen van vacatures nog niet gelukt of getest | Verder testen |
| Adzuna-API | Gratis account nodig; dekking in Nederland nog niet bevestigd | Testen na aanmaken account |
| Accare, Yulius, Levvel | Werken, maar liggen waarschijnlijk buiten de regio | Alleen als er te weinig vacatures zijn |
| Indeed, LinkedIn | Geen bruikbare API voor dit doel | Zelf een zoekalert instellen |
| Nationale Vacaturebank | robots.txt verbiedt de zoekpagina's | Niet gebruiken |

Regels voor het script: het houdt zich aan robots.txt, maakt zich herkenbaar als privézoeker en haalt maar één keer per dag beperkt pagina's op.

**Grootste zwakke plek:** kleine vaktherapiepraktijken, haar eerste voorkeur, plaatsen vacatures vaak alleen op de eigen site of via hun netwerk. Scholen en praktijken worden daardoor maar deels gevonden. Tijdens het bouwen wordt nagegaan of de beroepsvereniging (FVB) of de opleiding een vacaturepagina heeft. Eigen sites van praktijken in de regio kunnen als bron worden toegevoegd.

## Mail

- **Afzender:** een nieuw, apart Gmail-adres, bijvoorbeeld vacatures.zoeker@gmail.com (de naam moet nog vrij zijn).
- **Inloggen:** met een app-wachtwoord, niet met een gewoon wachtwoord. Dit staat versleuteld in GitHub Secrets.
- **Ontvanger:** ook een GitHub Secret, dus het adres staat niet zichtbaar in de code en is snel te wijzigen.
- **Inhoud:** onderwerp als "3 nieuwe vacatures", met per vacature functie, werkgever, plaats en link.
- **Geen nieuwe vacatures:** dan komt er geen mail.

## Privacy

De gratis versie gebruikt een openbare GitHub-repository en een openbare pagina. Iedereen met de link kan de vacatures en de code zien, en de code bevat het zoekprofiel. Haar naam en cv komen er dus niet in, en het mailadres staat alleen in Secrets.

## Stappen

1. Bronnen uitwerken, inclusief de nog niet bevestigde.
2. Script bouwen voor verzamelen, filteren en rangschikken.
3. Pagina bouwen en testen op laptop- en telefoonformaat.
4. Dagelijkse run en mail instellen op GitHub.
5. Een week laten meelopen en met haar de zoektermen en punten bijstellen.

## Nodig van Samuel

- [ ] Een nieuw Gmail-account met tweestapsverificatie en een app-wachtwoord
- [ ] Een lege openbare GitHub-repository
- [ ] Een gratis account op developer.adzuna.com (optioneel)
- [ ] Een zoekalert op Indeed en LinkedIn voor haar
