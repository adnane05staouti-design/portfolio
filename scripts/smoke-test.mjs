// Automatic smoke test of the running site.
// 1) Start the site (npm run dev, or npm run build && npm start)
// 2) In another terminal: npm test            (or BASE_URL=http://localhost:3001 npm test)
// Exits with code 1 if a check fails.

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const failures = [];
const ok = (msg) => console.log("  ✓ " + msg);
const fail = (msg) => {
  failures.push(msg);
  console.log("  ✗ " + msg);
};

async function get(path, headers = {}) {
  try {
    return await fetch(BASE + path, { redirect: "manual", headers });
  } catch {
    console.error(`\nCannot reach ${BASE}. Start the site first (npm run dev).\n`);
    process.exit(1);
  }
}

console.log(`\nSmoke test — ${BASE}\n`);

// ---------- 1. Language redirects ----------
console.log("Language redirect");
for (const [lang, header] of [["fr", "fr-FR,fr;q=0.9"], ["en", "en-US,en;q=0.9"]]) {
  const res = await get("/", { "accept-language": header });
  const location = res.headers.get("location") ?? "";
  if (location.endsWith(`/${lang}`)) ok(`/ → /${lang} (${header})`);
  else fail(`/ should redirect to /${lang}, got ${res.status} ${location}`);
}

// ---------- 2. Crawl every internal page ----------
console.log("\nPages, links and accessibility basics");
const seen = new Set();
const queue = ["/en", "/fr"];
const placeholders = new Map();
while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);
  const res = await get(path);
  if (res.status >= 300) {
    fail(`${res.status} ${path}`);
    continue;
  }
  const type = res.headers.get("content-type") ?? "";
  if (!type.includes("text/html")) continue;

  const html = await res.text();
  const text = html.replace(/<!-- -->/g, "");
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) fail(`${path}: ${h1} <h1> (expected 1)`);
  const noAlt = (html.match(/<img(?![^>]*\balt=)[^>]*>/g) ?? []).length;
  if (noAlt) fail(`${path}: ${noAlt} image(s) without alt text`);
  if (!/<title>[^<]+<\/title>/.test(html)) fail(`${path}: missing <title>`);
  if (!/name="description"/.test(html)) fail(`${path}: missing meta description`);
  for (const m of text.matchAll(/\[((?:ADD|CONFIRM)[^\]<]*)\]/g)) {
    placeholders.set(m[1], (placeholders.get(m[1]) ?? 0) + 1);
  }
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    if (!m[1].startsWith("/_next/")) queue.push(m[1]);
  }
}
ok(`${seen.size} internal pages and files crawled`);

// ---------- 3. Expected 404s ----------
console.log("\nNot found pages");
for (const path of ["/en/this-page-does-not-exist", "/fr/projects/unknown-project"]) {
  const res = await get(path);
  if (res.status === 404) ok(`404 ${path}`);
  else fail(`${path} should be 404, got ${res.status}`);
}

// ---------- 4. SEO files ----------
console.log("\nSEO files");
for (const path of ["/sitemap.xml", "/robots.txt", "/manifest.webmanifest", "/en/opengraph-image"]) {
  const res = await get(path);
  if (res.status === 200) ok(path);
  else fail(`${path} → ${res.status}`);
}

// ---------- 5. Admin ----------
console.log("\nAdmin (/keystatic)");
const admin = await get("/keystatic");
if (admin.status === 200) ok("admin reachable (development mode or GitHub storage enabled)");
else if (admin.status === 404) ok("admin disabled (expected on the public site)");
else fail(`/keystatic → unexpected ${admin.status}`);

// ---------- Summary ----------
if (placeholders.size) {
  console.log("\nPlaceholders still visible on the site (fill them in the admin):");
  for (const [label, n] of placeholders) console.log(`  - [${label}] ×${n}`);
}
console.log(failures.length ? `\n✗ ${failures.length} check(s) failed\n` : "\n✓ All checks passed\n");
process.exitCode = failures.length ? 1 : 0;
