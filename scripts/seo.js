/* SEO head tags for Daniel's Blog.
 * Adds: meta description, Open Graph, Twitter card, and (only when filled in
 * _config.yml -> seo:) Google/Bing verification and GoatCounter.
 * The theme still emits keywords, author and the canonical link.
 */
'use strict';

const { stripHTML } = require('hexo-util');

const clean = s => stripHTML(String(s || '')).replace(/\s+/g, ' ').trim();
const cut = (s, n = 150) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

hexo.extend.filter.register('after_render:html', function (html, data) {
  if (!html || !html.includes('</head>')) return html;
  const config = this.config;
  const seo = config.seo || {};
  const page = (data && data.page) || {};
  const base = config.url.replace(/\/$/, '');
  const abs = u => (/^https?:\/\//.test(u) ? u : base + '/' + String(u).replace(/^\//, ''));

  const isPost = page.layout === 'post' || page.__post;
  const path = String((data && data.path) || page.path || '').replace(/index\.html$/, '');
  const url = abs(path);

  let title = page.title || '';
  if (!title || !(isPost || page.__page)) title = config.title;

  let desc = clean(page.description);
  if (!desc && (isPost || page.__page)) desc = cut(clean(page.excerpt) || clean(page.content));
  if (!desc) desc = clean(config.description);

  const image = abs(page.og_image || seo.default_image || '/images/og-default.jpg');
  const e = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const tags = [
    `<meta name="description" content="${e(desc)}">`,
    `<meta property="og:type" content="${isPost ? 'article' : 'website'}">`,
    `<meta property="og:title" content="${e(title)}">`,
    `<meta property="og:description" content="${e(desc)}">`,
    `<meta property="og:url" content="${e(url)}">`,
    `<meta property="og:site_name" content="${e(config.title)}">`,
    `<meta property="og:locale" content="${(config.language || 'zh-CN').replace('-', '_')}">`,
    `<meta property="og:image" content="${e(image)}">`,
  ];
  if (!page.og_image) tags.push('<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">');
  if (isPost && page.date) tags.push(`<meta property="article:published_time" content="${page.date.toISOString()}">`);
  if (isPost && page.updated) tags.push(`<meta property="article:modified_time" content="${page.updated.toISOString()}">`);
  tags.push(
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${e(title)}">`,
    `<meta name="twitter:description" content="${e(desc)}">`,
    `<meta name="twitter:image" content="${e(image)}">`
  );
  if (seo.google_site_verification) tags.push(`<meta name="google-site-verification" content="${e(seo.google_site_verification)}">`);
  if (seo.bing_site_verification) tags.push(`<meta name="msvalidate.01" content="${e(seo.bing_site_verification)}">`);
  if (seo.goatcounter_code) {
    tags.push(`<script data-goatcounter="https://${e(seo.goatcounter_code)}.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>`);
  }

  // drop the theme's own description so there is exactly one
  html = html.replace(/<meta name="description"[^>]*>\s*/g, '');
  return html.replace('</head>', '<!-- seo -->' + tags.join('') + '<!-- /seo -->\n</head>');
});
