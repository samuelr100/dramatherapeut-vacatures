import { AUDIENCE_RULES, CORE_ROLES, OTHER_SPECIALISM, PLACES_FAR, PLACES_NEAR, PLACES_WIDER, RELATED_ROLES, SCORES, WANTED_HOURS, WORKPLACE_RULES } from './config.mjs';

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
const findPlace = (text, places) => places.find((p) => hasPlace(text, p));

// De meest betrouwbare tekst eerst; de lopende tekst noemt vaak ook andere plaatsen.
export function findRegion(texts) {
  for (const text of texts.filter(Boolean)) {
    const near = findPlace(text, PLACES_NEAR);
    if (near) return { place: near, region: 'dichtbij' };
    const wider = findPlace(text, PLACES_WIDER);
    if (wider) return { place: wider, region: 'iets verder' };
    const far = findPlace(text, PLACES_FAR);
    if (far) return { place: far, region: 'ver' };
  }
  return { place: null, region: 'onbekend' };
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
  let score = SCORES.role[job.role] + SCORES.audience[job.audience] + SCORES.region[job.region] + SCORES.workplace[job.workplace];
  if (job.hours && job.hours.max >= WANTED_HOURS.min && job.hours.min <= WANTED_HOURS.max) score += SCORES.hoursMatch;
  return score;
}
