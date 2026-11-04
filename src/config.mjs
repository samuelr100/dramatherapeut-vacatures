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

// Afstanden zijn hemelsbreed vanaf Utrecht Centraal; de reistijd met OV kan flink afwijken.
export const HOME = [52.0894, 5.11];
// Mails gaan alleen over vacatures binnen deze afstand (of met onbekende afstand).
export const MAIL_MAX_KM = 60;

// [breedtegraad, lengtegraad], ongeveer het centrum van de plaats.
export const PLACES = {
  Utrecht: [52.09, 5.122], Zeist: [52.089, 5.233], 'De Bilt': [52.11, 5.181], Bilthoven: [52.128, 5.204], Nieuwegein: [52.029, 5.081], Houten: [52.033, 5.168],
  IJsselstein: [52.02, 5.043], Vianen: [51.992, 5.092], Maarssen: [52.135, 5.04], Breukelen: [52.172, 5.002], Woerden: [52.086, 4.883], Driebergen: [52.053, 5.281],
  Bunnik: [52.067, 5.198], Vleuten: [52.108, 5.012], 'De Meern': [52.08, 5.032], Soesterberg: [52.119, 5.287], 'Den Dolder': [52.141, 5.243], Odijk: [52.053, 5.235],
  Werkhoven: [52.023, 5.244], Amersfoort: [52.156, 5.388], Soest: [52.173, 5.292], Baarn: [52.212, 5.288], Veenendaal: [52.027, 5.556], Hilversum: [52.223, 5.176],
  Gouda: [52.011, 4.711], Culemborg: [51.955, 5.227], Doorn: [52.033, 5.344], 'Wijk bij Duurstede': [51.975, 5.341], Leusden: [52.133, 5.43], Rhenen: [51.959, 5.568],
  Montfoort: [52.046, 4.953], Mijdrecht: [52.207, 4.862], Bussum: [52.274, 5.161], Tiel: [51.887, 5.429], Leerdam: [51.893, 5.092], Austerlitz: [52.083, 5.315],
  Maartensdijk: [52.155, 5.175], Eemnes: [52.254, 5.257], Rivierenland: [51.887, 5.429], Oudewater: [52.025, 4.868], Zaltbommel: [51.81, 5.249], Lopik: [51.973, 4.947],
  Schoonhoven: [51.948, 4.849], Naarden: [52.295, 5.161], Loosdrecht: [52.2, 5.077], Barneveld: [52.14, 5.585], Nijkerk: [52.22, 5.486], Weesp: [52.307, 5.042],
  Gorinchem: [51.836, 4.973], Wageningen: [51.97, 5.665], Ede: [52.04, 5.665], Amsterdam: [52.37, 4.895], Amstelveen: [52.301, 4.864], Almere: [52.371, 5.222],
  Rotterdam: [51.922, 4.479], 'Den Haag': [52.07, 4.3], Leiden: [52.16, 4.497], Delft: [52.012, 4.357], Zoetermeer: [52.057, 4.494], 'Alphen aan den Rijn': [52.129, 4.656],
  Dordrecht: [51.813, 4.69], Zwijndrecht: [51.818, 4.64], Schiedam: [51.919, 4.4], Vlaardingen: [51.912, 4.341], 'Capelle aan den IJssel': [51.929, 4.578], Spijkenisse: [51.845, 4.329],
  Haarlem: [52.387, 4.646], Hoofddorp: [52.303, 4.689], Zaandam: [52.439, 4.826], Purmerend: [52.505, 4.959], Alkmaar: [52.632, 4.744], Hoorn: [52.643, 5.06], 'Den Helder': [52.958, 4.76],
  Lelystad: [52.518, 5.471], Harderwijk: [52.342, 5.621], Apeldoorn: [52.211, 5.97], Arnhem: [51.985, 5.899], Nijmegen: [51.843, 5.858], Doetinchem: [51.965, 6.289],
  Zutphen: [52.139, 6.196], Deventer: [52.255, 6.163], Ruurlo: [52.088, 6.45], Borculo: [52.116, 6.522], Groenlo: [52.042, 6.612], Winterswijk: [51.972, 6.72],
  Zwolle: [52.516, 6.083], Kampen: [52.555, 5.911], Hardenberg: [52.575, 6.619], Almelo: [52.357, 6.662], Hengelo: [52.266, 6.793], Enschede: [52.222, 6.894],
  "'s-Hertogenbosch": [51.697, 5.304], 'Den Bosch': [51.697, 5.304], Rosmalen: [51.716, 5.365], 'Sint Michielsgestel': [51.642, 5.353], Oss: [51.765, 5.518], Uden: [51.661, 5.617], Veghel: [51.616, 5.549],
  Tilburg: [51.56, 5.091], Breda: [51.589, 4.776], Roosendaal: [51.531, 4.465], 'Bergen op Zoom': [51.495, 4.291], Halsteren: [51.528, 4.276], Eindhoven: [51.441, 5.47],
  Helmond: [51.479, 5.661], Weert: [51.252, 5.706], Venray: [51.526, 5.975], Venlo: [51.37, 6.172], Roermond: [51.194, 5.987], Sittard: [51, 5.869], Geleen: [50.974, 5.828],
  Heerlen: [50.888, 5.979], Maastricht: [50.851, 5.691], Middelburg: [51.499, 3.611], Vlissingen: [51.443, 3.573], Goes: [51.504, 3.889],
  Leeuwarden: [53.201, 5.799], Heerenveen: [52.96, 5.92], Drachten: [53.105, 6.098], Groningen: [53.219, 6.567], Assen: [52.993, 6.564], Emmen: [52.785, 6.897],
};
// Staat er alleen een provincie, dan blijft de afstand onbekend: een provincie is te groot om te schatten.
export const PROVINCES = ['Noord-Holland', 'Zuid-Holland', 'Gelderland', 'Limburg', 'Noord-Brabant', 'Zeeland', 'Overijssel', 'Drenthe', 'Friesland', 'Flevoland'];

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
  // [tot zoveel km, punten]; onbekende afstand krijgt 0.
  distance: [[20, 20], [40, 10], [70, 0], [Infinity, -15]],
  // Alleen een andere provincie bekend: waarschijnlijk niet om de hoek.
  provinceOnly: -10,
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
  { name: 'Accare', type: 'links', employer: 'Accare', url: 'https://www.accare.nl/laat-kinderen-en-jongeren-weer-opbloeien/vacature-overzicht', link: /\/vacature-overzicht\/[a-z0-9-]+\/?$/ },
  { name: 'De Viersprong', type: 'links', employer: 'De Viersprong', url: 'https://www.werkenbijdeviersprong.nl/vacatures/', link: /\/vacature\/[a-z0-9-]+\/?$/ },
  { name: 'Zorgselect', type: 'sitemap', sitemaps: [1, 2, 3, 4, 5, 6].map((n) => `https://zorgselect.nl/sitemaps-1-section-position-1-sitemap-p${n}.xml`), link: /\/vacatures\// },
];
