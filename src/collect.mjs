import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import { classifyRole, decode, findAudience, findContract, findDeadline, distanceKm, findHours, findPlace, findWorkplace, scoreJob, stripTags } from './analyze.mjs';
import { CORE_ROLES, DROP_AFTER_DAYS, MAIL_MAX_KM, MAX_NEW_DETAILS_PER_RUN, PROVINCES, RELATED_ROLES, REQUEST_DELAY_MS, SOURCES, USER_AGENT } from './config.mjs';

const DATA_FILE = 'docs/jobs.json';
const MAIL_FILE = 'out/mail.html';
const PAGE_URL = process.env.PAGE_URL || '';
const now = new Date().toISOString();

async function fetchText(url) {
  await sleep(REQUEST_DELAY_MS);
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} voor ${url}`);
  return { html: await res.text(), finalUrl: res.url };
}

const robotsCache = new Map();
async function robotsRules(origin) {
  if (robotsCache.has(origin)) return robotsCache.get(origin);
  let rules = [];
  try {
    const { html } = await fetchText(`${origin}/robots.txt`);
    let active = false;
    let inAgents = false;
    for (const raw of html.split('\n')) {
      const [key, ...rest] = raw.split('#')[0].split(':');
      const value = rest.join(':').trim();
      const field = key.trim().toLowerCase();
      if (field === 'user-agent') {
        if (!inAgents) active = false;
        inAgents = true;
        if (value === '*') active = true;
      } else if (field === 'disallow' || field === 'allow') {
        inAgents = false;
        if (active && value) rules.push({ allow: field === 'allow', value });
      } else if (field) {
        inAgents = false;
      }
    }
  } catch {
    rules = [];
  }
  robotsCache.set(origin, rules);
  return rules;
}

async function allowedByRobots(url) {
  const u = new URL(url);
  const path = u.pathname + u.search;
  let best = { allow: true, length: -1 };
  for (const rule of await robotsRules(u.origin)) {
    const re = new RegExp(`^${rule.value.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\\\$$/, '$')}`);
    if (re.test(path) && rule.value.length > best.length) best = { allow: rule.allow, length: rule.value.length };
  }
  return best.allow;
}

async function politeFetch(url) {
  if (!(await allowedByRobots(url))) throw new Error(`robots.txt staat ${url} niet toe`);
  return fetchText(url);
}

const isExpired = (job) => Boolean(job.deadline) && job.deadline < now.slice(0, 10);
// Op eerste woord van de werkgever en grove afstand, want bronnen schrijven die verschillend (Altrecht / Altrecht TopGGz, Zeist / Utrecht).
const dedupeKey = (job) => `${job.title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()}|${job.employer?.split(' ')[0].toLowerCase()}|${job.distanceKm == null ? job.place : Math.round(job.distanceKm / 25)}`;
const withinMailRange = (job) => (job.distanceKm == null ? !PROVINCES.includes(job.place) : job.distanceKm <= MAIL_MAX_KM);
const roleHint = (text) => CORE_ROLES.test(text) || RELATED_ROLES.test(text);
const slugText = (url) => decodeURIComponent(new URL(url).pathname).replace(/[-_/]+/g, ' ');

async function candidatesFromLinks(source) {
  const found = new Map();
  const pages = source.maxPages
    ? Array.from({ length: source.maxPages }, (_, i) => (i === 0 ? source.firstPage : source.url.replace('{n}', i + 1)))
    : source.urls || [source.url];
  for (const page of pages) {
    let html;
    try {
      ({ html } = await politeFetch(page));
    } catch (err) {
      // Voorbij de laatste pagina geeft een overzicht een 404; dat is geen fout van de bron.
      if (page !== pages[0] && /HTTP 404/.test(err.message)) break;
      throw err;
    }
    for (const m of html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
      const url = new URL(decode(m[1]), page);
      url.search = '';
      if (!source.link.test(url.pathname)) continue;
      const teaser = stripTags(m[2]);
      if (!roleHint(`${teaser} ${slugText(url.href)}`)) continue;
      // Dezelfde link komt vaak meerdere keren voor, soms zonder tekst of met "Read More".
      if ((found.get(url.href)?.teaser.length ?? -1) < teaser.length) found.set(url.href, { url: url.href, teaser });
    }
  }
  return [...found.values()];
}

async function candidatesFromWatch(source) {
  const { html } = await politeFetch(source.url);
  const text = stripTags(html.replace(/<(script|style|noscript|svg|nav|footer|header)\b[\s\S]*?<\/\1>/gi, ' '));
  return source.mentions.test(text) ? [{ url: source.url, teaser: source.title, title: source.title }] : [];
}

const CANDIDATE_READERS = { links: candidatesFromLinks, sitemap: candidatesFromSitemap, watch: candidatesFromWatch };

async function candidatesFromSitemap(source) {
  const found = [];
  for (const sitemap of source.sitemaps) {
    const { html } = await politeFetch(sitemap);
    for (const m of html.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      if (source.link.test(m[1]) && roleHint(slugText(m[1]))) found.push({ url: m[1], teaser: '' });
    }
  }
  return found;
}

function jobPostingFrom(html) {
  for (const m of html.matchAll(/<script[^>]*ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(m[1]);
      const items = [data, ...(data['@graph'] || [])].flat();
      const posting = items.find((i) => i?.['@type'] === 'JobPosting');
      if (posting) return posting;
    } catch { /* kapotte JSON-LD komt voor; de gewone tekst is dan de terugval */ }
  }
  return null;
}

async function readDetail(source, candidate) {
  const { html } = await politeFetch(candidate.url);
  const posting = jobPostingFrom(html);
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const title = stripTags(candidate.title || posting?.title || (h1 && h1[1]) || candidate.teaser).replace(/\s+(?:full|part)\b.*time$/i, '').replace(/^vacature:?\s+/i, '').slice(0, 160);
  const role = classifyRole(title);
  if (!role) return null;

  const main = html
    .replace(/<(script|style|noscript|svg|nav|footer|header)\b[\s\S]*?<\/\1>/gi, ' ');
  const text = stripTags(main);
  if (/sollicitatietermijn[^.]{0,80}is verlopen/i.test(text)) return null;
  const jsonPlace = [posting?.jobLocation].flat().map((l) => l?.address?.addressLocality).filter(Boolean).join(' ');
  const locationLabel = (`${candidate.teaser} ${text}`.match(/(?:Locatie|Standplaats|Werklocatie)\s*:?\s+([\p{Lu}][\p{L}' -]{2,40})/u) || [])[1];
  // De link gaat voor op het label: ketens plaatsen per vestiging een vacature, met de plaats in de link en alleen de provincie als label.
  const place = findPlace([jsonPlace, slugText(candidate.url), title, locationLabel, text.slice(0, 1500)]);

  const job = {
    id: candidate.url,
    url: candidate.url,
    title,
    employer: stripTags(posting?.hiringOrganization?.name || source.employer || '') || null,
    source: source.name,
    role,
    place,
    distanceKm: distanceKm(place),
    hours: findHours(`${candidate.teaser} ${text}`),
    deadline: posting?.validThrough?.slice(0, 10) || findDeadline(text),
    audience: findAudience(title, text),
    workplace: source.workplace || findWorkplace(title, text),
    contract: findContract(text),
  };
  if (isExpired(job)) return null;
  return { ...job, score: scoreJob(job) };
}

function loadPrevious() {
  return existsSync(DATA_FILE) ? JSON.parse(readFileSync(DATA_FILE, 'utf8')).jobs : [];
}

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function mailHtml(newJobs) {
  const rows = newJobs.map((j) => `<li style="margin-bottom:14px"><a href="${esc(j.url)}"><strong>${esc(j.title)}</strong></a><br>${esc([j.employer, j.place, j.distanceKm != null ? `± ${j.distanceKm} km` : null, j.role === 'related' ? 'verwant' : null].filter(Boolean).join(' · '))}</li>`).join('\n');
  const link = PAGE_URL ? `<p><a href="${esc(PAGE_URL)}">Bekijk alle vacatures</a></p>` : '';
  return `<!doctype html><html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;line-height:1.45"><ul style="padding-left:18px">\n${rows}\n</ul>${link}</body></html>`;
}

function setOutput(key, value) {
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
}

async function main() {
  const previous = new Map(loadPrevious().map((j) => [j.id, j]));
  const jobs = new Map();
  const sourceReports = [];
  const failedSources = new Set();
  let detailBudget = MAX_NEW_DETAILS_PER_RUN;

  for (const source of SOURCES) {
    const report = { name: source.name, candidates: 0, jobs: 0, error: null };
    try {
      const candidates = await CANDIDATE_READERS[source.type](source);
      report.candidates = candidates.length;
      for (const candidate of candidates) {
        const known = previous.get(candidate.url);
        if (known) {
          jobs.set(known.id, { ...known, active: !isExpired(known), lastSeen: now });
          report.jobs++;
          continue;
        }
        if (detailBudget <= 0) continue;
        detailBudget--;
        try {
          const job = await readDetail(source, candidate);
          if (job) {
            jobs.set(job.id, { ...job, active: true, firstSeen: now, lastSeen: now });
            report.jobs++;
          }
        } catch (err) {
          console.warn(`Overgeslagen: ${candidate.url}: ${err.message}`);
        }
      }
    } catch (err) {
      report.error = err.message;
      failedSources.add(source.name);
    }
    console.log(`${source.name}: ${report.jobs} vacatures uit ${report.candidates} kandidaten${report.error ? ` (FOUT: ${report.error})` : ''}`);
    sourceReports.push(report);
  }

  const cutoff = Date.now() - DROP_AFTER_DAYS * 86400000;
  for (const old of previous.values()) {
    if (jobs.has(old.id) || new Date(old.lastSeen).getTime() < cutoff) continue;
    // Bij een storing weten we niets over de vacature, dus die blijft zoals hij was.
    jobs.set(old.id, failedSources.has(old.source) ? old : { ...old, active: false });
  }

  // Opnieuw berekenen, zodat aanpassingen in plaatsen of punten ook voor bestaande vacatures gelden.
  for (const job of jobs.values()) {
    delete job.region;
    job.distanceKm = distanceKm(job.place);
    job.score = scoreJob(job);
  }

  // Dubbele vacatures blijven bewaard maar gemarkeerd; anders lijken ze bij de volgende ronde weer nieuw.
  // Voorrang: nog online, dan het eerst gezien, dan de volgorde van de bronnen in de config.
  const byPriority = [...jobs.values()].sort((a, b) => b.active - a.active || a.firstSeen.localeCompare(b.firstSeen));
  const keepers = new Map();
  for (const job of byPriority) {
    const key = dedupeKey(job);
    if (!keepers.has(key)) keepers.set(key, job);
    job.duplicate = keepers.get(key) !== job;
  }
  const list = [...jobs.values()].sort((a, b) => b.score - a.score || b.firstSeen.localeCompare(a.firstSeen));
  const shown = list.filter((j) => !j.duplicate);
  mkdirSync('docs', { recursive: true });
  writeFileSync(DATA_FILE, `${JSON.stringify({ updatedAt: now, sources: sourceReports, jobs: list }, null, 1)}\n`);

  const newJobs = shown.filter((j) => j.firstSeen === now && withinMailRange(j));
  mkdirSync('out', { recursive: true });
  writeFileSync(MAIL_FILE, mailHtml(newJobs));
  setOutput('new_count', newJobs.length);
  console.log(`Totaal ${shown.length} vacatures, ${newJobs.length} nieuw voor de mail.`);
  if (sourceReports.every((r) => r.error)) process.exit(1);
}

main();
