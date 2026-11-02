// Alles wat je wilt bijstellen (zoektermen, plaatsen, bronnen, punten) staat in dit bestand.

export const USER_AGENT = 'dramatherapeut-vacaturezoeker/1.0 (prive zoeker, 1x per dag)';
export const REQUEST_DELAY_MS = 700;
export const MAX_NEW_DETAILS_PER_RUN = 120;
export const DROP_AFTER_DAYS = 30;

// Functies waarvoor ze direct is opgeleid.
export const CORE_ROLES = /drama.?therap|vak.?therap|creatie[fv]e?.?therap/i;
// Vaktherapie in een ander specialisme telt als verwant, tenzij drama ook genoemd wordt.
export const OTHER_SPECIALISM = /beeldend|muziek|dans|psychomotori|pmt\b/i;
export const RELATED_ROLES =
  /spel.?therap|kinder.?therap|beeldend.?therap|muziek.?therap|dans.?therap|psychomotorisch.?(?:bewegings)?.?therap|jeugd.?begeleid|begeleider.{0,12}jeugd|leerling.?begeleid|gezins.?begeleid|pedagogisch.?(?:hulpverlener|begeleider)|jeugd.{0,8}(?:gezins)?.?professional/i;

// Ongeveer binnen bereik vanuit Utrecht. Dit is een handmatige indeling, geen reistijdberekening.
export const PLACES_NEAR = ['Utrecht', 'Zeist', 'De Bilt', 'Bilthoven', 'Nieuwegein', 'Houten', 'IJsselstein', 'Vianen', 'Maarssen', 'Breukelen', 'Woerden', 'Driebergen', 'Bunnik', 'Vleuten', 'De Meern', 'Soesterberg', 'Den Dolder', 'Odijk', 'Werkhoven'];
export const PLACES_WIDER = ['Amersfoort', 'Soest', 'Baarn', 'Veenendaal', 'Hilversum', 'Gouda', 'Culemborg', 'Doorn', 'Wijk bij Duurstede', 'Leusden', 'Rhenen', 'Montfoort', 'Mijdrecht', 'Bussum', 'Tiel', 'Leerdam', 'Austerlitz', 'Maartensdijk', 'Eemnes', 'Rivierenland', 'Oudewater', 'Zaltbommel', 'Lopik', 'Schoonhoven', 'Naarden', 'Loosdrecht', 'Barneveld', 'Nijkerk'];
export const PLACES_FAR = ['Amsterdam', 'Rotterdam', 'Den Haag', 'Eindhoven', 'Groningen', 'Zwolle', 'Arnhem', 'Nijmegen', 'Tilburg', 'Breda', 'Haarlem', 'Leiden', 'Dordrecht', 'Enschede', 'Apeldoorn', 'Maastricht', 'Almere', 'Alkmaar', "'s-Hertogenbosch", 'Den Bosch', 'Deventer', 'Leeuwarden', 'Assen', 'Emmen', 'Ede', 'Zoetermeer', 'Delft', 'Heerlen', 'Venlo', 'Roermond', 'Venray', 'Middelburg', 'Noord-Holland', 'Zuid-Holland', 'Gelderland', 'Limburg', 'Noord-Brabant', 'Zeeland', 'Overijssel', 'Drenthe', 'Friesland', 'Flevoland', 'Groenlo', 'Borculo', 'Winterswijk', 'Doetinchem', 'Lelystad', 'Hoofddorp', 'Sittard', 'Geleen', 'Halsteren', 'Hengelo', 'Almelo', 'Amstelveen', 'Oss', 'Zwijndrecht', 'Roosendaal', 'Bergen op Zoom', 'Harderwijk', 'Zutphen', 'Ruurlo', 'Hoorn', 'Purmerend', 'Zaandam', 'Alphen aan den Rijn', 'Helmond'];

export const AUDIENCE_RULES = [
  ['jonge kinderen', /kleuter|onderbouw|jonge kind|(?:4|vier)\s*(?:tot|-|–)\s*(?:8|acht)\s*jaar/i],
  ['kinderen', /kinderen|kind en jeugd|kinder- en jeugd|basisschool|basisonderwijs|jeugd-?ggz|jeugdzorg|jeugdhulp/i],
  ['jongeren', /jongeren|adolescent|tieners/i],
];

export const WORKPLACE_RULES = [
  ['praktijk', /vaktherapiepraktijk|therapiepraktijk|eigen praktijk|onze praktijk|praktijk voor/i],
  ['jeugd-ggz', /jeugd-?ggz|kinder- en jeugdpsychiatrie/i],
  ['jeugdzorg', /jeugdzorg|jeugdhulp/i],
  ['basisonderwijs', /basisschool|basisonderwijs/i],
];

export const SCORES = {
  role: { core: 50, related: 10 },
  audience: { 'jonge kinderen': 30, kinderen: 20, jongeren: 10, onbekend: 0 },
  region: { dichtbij: 20, 'iets verder': 10, onbekend: 0, ver: -30 },
  workplace: { praktijk: 15, 'jeugd-ggz': 10, jeugdzorg: 10, basisonderwijs: 10, overig: 0 },
  hoursMatch: 5,
};
export const WANTED_HOURS = { min: 32, max: 36 };

// type 'links': zoekt vacaturelinks op overzichtspagina's. {n} is het paginanummer.
// type 'sitemap': zoekt in de sitemap, omdat de functienaam daar in de link staat.
// type 'watch': voor kleine praktijken met alles op één pagina; telt als vacature zolang de functie genoemd wordt.
export const SOURCES = [
  { name: 'Altrecht', type: 'links', employer: 'Altrecht', url: 'https://www.werkenbijaltrecht.nl/vacatures/page/{n}/', firstPage: 'https://www.werkenbijaltrecht.nl/vacatures/', maxPages: 8, link: /\/vacatures\/(?!page\/)[a-z0-9-]+\/?$/ },
  { name: 'Eemhart', type: 'links', employer: 'Eemhart', url: 'https://www.werkenbijeemhart.nl/vacatures', link: /\/vacatures\/[a-z0-9-]+\/?$/ },
  { name: 'Youké', type: 'links', employer: 'Youké', url: 'https://werkenbijyouke.nl/vacatures/', link: /\/vacatures?\/[a-z0-9-]+\/?$/ },
  { name: 'GGZ Vacatures', type: 'links', urls: ['https://ggzvacatures.nl/?s=dramatherapeut', 'https://ggzvacatures.nl/?s=vaktherapeut', 'https://ggzvacatures.nl/?s=creatief+therapeut'], link: /\/vacature\/[a-z0-9-]+\/?$/ },
  { name: 'Therapiepraktijk Zijn', type: 'links', employer: 'Therapiepraktijk Zijn', workplace: 'praktijk', url: 'https://therapiepraktijkzijn.nl/vacatures/', link: /\/vacatures\/[a-z0-9-]+\/?$/ },
  { name: 'Praktijk IkBen', type: 'watch', employer: 'Praktijk IkBen', workplace: 'praktijk', url: 'https://praktijkikben.nl/vacatures/', title: 'Dramatherapeut', mentions: /dramatherapeut/i },
  { name: 'Kind & meer', type: 'watch', employer: 'Kind & meer', workplace: 'praktijk', url: 'https://www.kindenmeer.nl/over-ons/vacatures/', title: 'Vaktherapeut', mentions: /dramatherapeut|vaktherapeut/i },
  { name: 'YOEP', type: 'links', employer: 'YOEP', url: 'https://www.werkenbijyoep.nl/vacatures/', link: /\/vacatures\/[a-z0-9-]+\/?$/ },
  { name: 'FamilySupporters', type: 'links', employer: 'FamilySupporters', url: 'https://familysupporters.nl/werken-bij/', link: /\/vacature\/[a-z0-9-]+\/?$/ },
  { name: 'Care to Change', type: 'links', employer: 'Care to Change', url: 'https://caretochange.recruitee.com/', link: /^\/o\/[a-z0-9-]+\/?$/ },
  { name: 'Spoor030', type: 'links', employer: 'Spoor030', workplace: 'jeugdzorg', url: 'https://spoor030.nl/werken-bij/', link: /\/berichten\/[a-z0-9-]+\/?$/ },
  { name: 'Zorgselect', type: 'sitemap', sitemaps: [1, 2, 3, 4, 5, 6].map((n) => `https://zorgselect.nl/sitemaps-1-section-position-1-sitemap-p${n}.xml`), link: /\/vacatures\// },
];
