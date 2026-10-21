import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');
assert.ok(existsSync(dist), 'Falta dist/: ejecuta primero npm run build.');
const files = await readdir(dist, { recursive: true });
const pages = files.filter((file) => file.endsWith('.html'));
const titles = new Set();
const descriptions = new Set();
const canonicals = new Set();
const documents = new Map();

/**
 * Resuelve una ruta pública dentro del build estático.
 * @param {string} pathname Ruta de la URL pública.
 * @returns {string} Archivo correspondiente dentro de dist.
 */
function resolveFile(pathname) {
  const relative = decodeURIComponent(pathname).replace(/^\//, '');
  const file = path.join(dist, relative);
  return path.extname(relative) ? file : path.join(file, 'index.html');
}

for (const file of pages) {
  const html = await readFile(path.join(dist, file), 'utf8');
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/)?.[1];
  assert.ok(head, `${file}: falta head.`);
  assert.doesNotMatch(head, /<(?:div|nav|main|article|section)\b/i, `${file}: contenido no válido en head.`);
  const language = html.match(/<html\b[^>]*lang="(es|en)"/)?.[1];
  assert.ok(language, `${file}: falta un idioma principal compatible.`);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${file}: debe tener un h1.`);
  assert.equal([...head.matchAll(/<meta charset=/g)].length, 1, `${file}: charset duplicado o ausente.`);
  assert.doesNotMatch(head, /noindex|nosnippet/, `${file}: indexación o snippets bloqueados.`);
  assert.match(head, /max-image-preview:large/, `${file}: falta permiso de imagen grande.`);
  const title = head.match(/<title>(.*?)<\/title>/)?.[1];
  const description = head.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert.ok(title && !titles.has(title), `${file}: título vacío o repetido.`);
  assert.ok(description && !descriptions.has(description), `${file}: descripción vacía o repetida.`);
  titles.add(title);
  descriptions.add(description);

  const canonicalTags = [...head.matchAll(/<link rel="canonical" href="([^"]+)"/g)];
  assert.equal(canonicalTags.length, 1, `${file}: debe haber una única canonical.`);
  const canonical = new URL(canonicalTags[0][1]);
  assert.equal(canonical.origin, 'https://mb.madeinchile.tech', `${file}: dominio canónico incorrecto.`);
  assert.ok(canonical.pathname === '/' || !canonical.pathname.endsWith('/'), `${file}: canonical con barra final.`);
  assert.equal(resolveFile(canonical.pathname), path.join(dist, file), `${file}: canonical apunta a otra página.`);
  assert.ok(!canonicals.has(canonical.href), `${file}: canonical duplicada.`);
  canonicals.add(canonical.href);
  documents.set(canonical.pathname, html);
  assert.equal(head.match(/<meta property="og:url" content="([^"]+)"/)?.[1], canonical.href);

  for (const pattern of [/<meta property="og:image" content="([^"]+)"/, /<meta name="twitter:image" content="([^"]+)"/]) {
    const image = head.match(pattern)?.[1];
    assert.ok(image, `${file}: falta imagen social.`);
    const imageURL = new URL(image);
    assert.equal(imageURL.origin, canonical.origin, `${file}: imagen social fuera del dominio.`);
    assert.ok(existsSync(resolveFile(imageURL.pathname)), `${file}: imagen social inexistente: ${image}.`);
  }

  const scripts = [...head.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  assert.ok(scripts.length > 0, `${file}: faltan datos estructurados.`);
  const graph = scripts.flatMap((script) => JSON.parse(script[1])['@graph'] ?? []);
  assert.ok(graph.some((item) => item['@type'] === 'Person'), `${file}: falta identidad del autor.`);
  const webpage = graph.find((item) => ['WebPage', 'CollectionPage'].includes(item['@type']));
  assert.equal(webpage?.url, canonical.href, `${file}: URL del schema incorrecta.`);
  assert.equal(webpage?.inLanguage, language, `${file}: idioma del schema distinto al HTML.`);
  if (canonical.pathname.startsWith('/blog/')) {
    const article = graph.find((item) => item['@type'] === 'BlogPosting');
    assert.ok(article?.datePublished && article?.dateModified, `${file}: faltan fechas del artículo.`);
    assert.ok(Date.parse(article.dateModified) >= Date.parse(article.datePublished), `${file}: fechas incoherentes.`);
    assert.equal(article.inLanguage, language);
    assert.ok(article.author.url.endsWith('/#about'), `${file}: falta perfil del autor.`);
    assert.match(html, /rel="author"/, `${file}: falta autor visible.`);
    assert.match(html, /id="article-toc"/, `${file}: falta índice del artículo.`);
  }
  if (/^\/(blog|projects)\//.test(canonical.pathname)) {
    const breadcrumb = graph.find((item) => item['@type'] === 'BreadcrumbList');
    assert.equal(breadcrumb?.itemListElement.at(-1)?.item, canonical.href, `${file}: breadcrumb incorrecto.`);
    assert.match(html, /aria-label="Ruta de navegación"/, `${file}: falta breadcrumb visible.`);
  }
}

// Comprueba enlaces y anclas sobre el HTML estático, sin depender de JavaScript.
for (const [pathname, html] of documents) {
  for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const url = new URL(href.replaceAll('&amp;', '&'), `https://mb.madeinchile.tech${pathname}`);
    if (url.origin !== 'https://mb.madeinchile.tech') continue;
    assert.ok(existsSync(resolveFile(url.pathname)), `${pathname}: enlace interno roto: ${href}.`);
    const target = documents.get(url.pathname);
    if (target) {
      assert.ok(url.pathname === '/' || !url.pathname.endsWith('/'), `${pathname}: enlace no canónico: ${href}.`);
      if (url.hash) {
        assert.ok(target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${pathname}: ancla inexistente: ${href}.`);
      }
    } else {
      assert.ok(!url.pathname.endsWith('/'), `${pathname}: enlace con barra final: ${href}.`);
    }
  }
}

const sitemapFiles = files.filter((file) => /^sitemap-\d+\.xml$/.test(file));
assert.ok(sitemapFiles.length > 0, 'No se generó el sitemap.');
const sitemapURLs = new Set();
for (const file of sitemapFiles) {
  const xml = await readFile(path.join(dist, file), 'utf8');
  for (const [, loc] of xml.matchAll(/<loc>(.*?)<\/loc>/g)) sitemapURLs.add(new URL(loc).href);
}
assert.deepEqual(sitemapURLs, canonicals, 'El sitemap y las URLs canónicas no coinciden.');
const rss = await readFile(path.join(dist, 'rss.xml'), 'utf8');
const rssURLs = new Set([...rss.matchAll(/<item>[\s\S]*?<link>(.*?)<\/link>/g)].map((match) => new URL(match[1]).href));
assert.deepEqual(rssURLs, new Set([...canonicals].filter((url) => new URL(url).pathname.startsWith('/blog/'))), 'RSS y artículos publicados no coinciden.');

const blogFiles = await readdir('src/content/blog');
for (const file of blogFiles.filter((file) => /\.mdx?$/.test(file))) {
  const content = await readFile(path.join('src/content/blog', file), 'utf8');
  const frontmatter = content.split('---')[1];
  if (/^status: (draft|en_progreso)$/m.test(frontmatter)) {
    const slug = file.replace(/\.mdx?$/, '');
    assert.ok(!existsSync(resolveFile(`/blog/${slug}`)), `Borrador publicado: ${slug}.`);
  }
}

const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8');
assert.match(robots, /User-agent: OAI-SearchBot\s+Allow: \//, 'Falta permiso para OAI-SearchBot.');
process.stdout.write(`SEO: ${pages.length} páginas verificadas; metadatos, imágenes, JSON-LD, enlaces, anclas, sitemap, RSS y borradores correctos.\n`);
