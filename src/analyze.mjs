import { AUDIENCE_RULES, CORE_ROLES, HOME, OTHER_SPECIALISM, PLACES, PROVINCES, RELATED_ROLES, SCORES, WANTED_HOURS, WORKPLACE_RULES } from './config.mjs';

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', euml: 'ë', eacute: 'é', iuml: 'ï' };
export const decode = (s) => s
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&([a-z]+);/gi, (m, e) => ENTITIES[e.toLowerCase()] ?? m);
// Twee keer decoderen: sommige sites coderen tekens dubbel (&amp;#8211;).
export const stripTags = (html) => decode(decode(html.replace(/<[^>]+>/g, ' '))).replace(/\s+/g, ' ').trim();

export function classifyRole(title) {
  if (CORE_ROLES.test(title)) {
    if (/drama/i.test(title) || !OTHER_SPECIALISM.test(title)) return 'core';
    return 'related';
  }
  return RELATED_ROLES.test(title) ? 'related' : null;
}

const hasPlace = (text, place) => new RegExp(`(?<![\\p{L}-])${place.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}-])`, 'u').test(text);

export function distanceKm(place) {
  const coords = PLACES[place];
  if (!coords) return null;
  const rad = (d) => (d * Math.PI) / 180;
  const [lat1, lon1] = HOME.map(rad);
  const [lat2, lon2] = coords.map(rad);
  const a = Math.sin((lat2 - lat1) / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2;
  return Math.round(2 * 6371 * Math.asin(Math.sqrt(a)));
}

// De meest betrouwbare tekst eerst. Noemt een tekst meerdere plaatsen (zoals een keten met vestigingen), dan telt de dichtstbijzijnde.
export function findPlace(texts) {
  const present = texts.filter(Boolean);
  for (const text of present) {
    const found = Object.keys(PLACES).filter((p) => hasPlace(text, p));
    if (found.length) return found.sort((a, b) => distanceKm(a) - distanceKm(b))[0];
  }
  for (const text of present) {
    const province = PROVINCES.find((p) => hasPlace(text, p));
    if (province) return province;
  }
  return null;
}

export function findHours(text) {
  const range = text.match(/(\d{1,2})\s*(?:-|–|tot)\s*(\d{1,2})\s*uur/i);
  if (range && +range[1] < +range[2] && +range[2] <= 40) return { min: +range[1], max: +range[2] };
  const single = text.match(/(\d{2})\s*uur\s*(?:per|\/|in de)\s*week/i) || text.match(/(?:aantal uur|uren)\s*:?\s*(\d{2})\b/i);
  if (single && +single[1] <= 40) return { min: +single[1], max: +single[1] };
  return null;
}

const MONTHS = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
export function findDeadline(text) {
  const near = text.match(/(?:sluitingsdatum|reageren (?:kan )?(?:tot|t\/m|voor)|solliciteren (?:kan )?(?:tot|t\/m|voor)|reageer (?:voor|uiterlijk))[^.]{0,30}?(\d{1,2})(?:[-/](\d{1,2})[-/](\d{4})|\s+([a-z]+)\s+(\d{4}))/i);
  if (!near) return null;
  const month = near[2] ? +near[2] : MONTHS.indexOf(near[4]?.toLowerCase()) + 1;
  const year = near[3] || near[5];
  if (!month) return null;
  return `${year}-${String(month).padStart(2, '0')}-${near[1].padStart(2, '0')}`;
}

export function findAudience(title, text) {
  // Secundaire arbeidsvoorwaarden als kinderopvang zeggen niets over de doelgroep.
  const body = text.replace(/kinderopvang|kinderen van medewerkers/gi, ' ');
  for (const [label, re] of AUDIENCE_RULES) if (re.test(title)) return label;
  for (const [label, re] of AUDIENCE_RULES) {
    const hits = body.match(new RegExp(re.source, 'gi'));
    if (hits && hits.length >= 2) return label;
  }
  return 'onbekend';
}

export function findWorkplace(title, text) {
  for (const [label, re] of WORKPLACE_RULES) if (re.test(`${title} ${text}`)) return label;
  return 'overig';
}

export const findContract = (text) => (/\b(?:zzp|freelance|zelfstandige basis|zelfstandig ondernemer)\b/i.test(text) ? 'zzp mogelijk' : 'onbekend');

export function scoreJob(job) {
  const distanceScore = job.distanceKm != null
    ? SCORES.distance.find(([max]) => job.distanceKm <= max)[1]
    : PROVINCES.includes(job.place) ? SCORES.provinceOnly : 0;
  let score = SCORES.role[job.role] + SCORES.audience[job.audience] + distanceScore + SCORES.workplace[job.workplace];
  if (job.hours && job.hours.max >= WANTED_HOURS.min && job.hours.min <= WANTED_HOURS.max) score += SCORES.hoursMatch;
  return score;
}
