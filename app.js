/* ============================================================
   ml.research-engineer.ing — app.js
   Vanilla JS · no frameworks
   ============================================================ */

'use strict';

/* ── Constants ─────────────────────────────────────────────── */

const MANIFESTS = {
  pages:     { path: 'archive/pages/index.json',     dir: 'archive/pages/',     label: 'Pages' },
  tables:    { path: 'archive/tables/index.json',    dir: 'archive/tables/',    label: 'Tables' },
  files:     { path: 'archive/files/index.json',     dir: 'archive/files/',     label: 'Files' },
  code:      { path: 'archive/code/index.json',      dir: 'archive/code/',      label: 'Code' },
  notebooks: { path: 'archive/notebooks/index.json', dir: 'archive/notebooks/', label: 'Notebooks' },
};

const LOGS_PATH = 'logs/index.json';

const PILLAR_DISPLAY = {
  foundations: 'I · Foundations',
  frontiers:   'II · Frontiers',
  systems:     'III · Systems',
};

const TYPE_LABELS = {
  pages:     'Page',
  tables:    'Table',
  files:     'File',
  code:      'Code',
  notebooks: 'Notebook',
};

const CODE_EXTENSIONS = new Set([
  'py', 'js', 'ts', 'jsx', 'tsx', 'cpp', 'cu', 'c', 'h',
  'hpp', 'java', 'rs', 'go', 'sh', 'bash', 'r', 'sql',
  'yaml', 'yml', 'toml', 'json', 'css',
]);

/* ── State ─────────────────────────────────────────────────── */

const state = {
  tab:          'home',
  items:        [],
  logs:         [],
  selectedItem: null,
  northstarHTML: null,
  contentCache:  new Map(),
};

/* ── MDX Rendering ─────────────────────────────────────────── */

function escAttr(str) {
  return str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escHTML(str) {
  return str
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function parseAttrStr(attrsStr) {
  const attrs = {};
  const re = /(\w+)="([^"]*)"/g;
  let m;
  while ((m = re.exec(attrsStr)) !== null) attrs[m[1]] = m[2];
  return attrs;
}

function buildMDXComponent(tag, attrsStr, innerHTML) {
  const a = parseAttrStr(attrsStr);
  switch (tag) {
    case 'Definition':
      return `<div class="c-definition" data-term="${escAttr(a.term || '')}">${innerHTML}</div>`;
    case 'Theorem':
      return `<div class="c-theorem" data-name="${escAttr(a.name || '')}">${innerHTML}</div>`;
    case 'Proof':
      return `<div class="c-proof">${innerHTML}<span class="c-qed">∎</span></div>`;
    case 'Algorithm':
      return `<div class="c-algorithm" data-name="${escAttr(a.name || '')}">${innerHTML}</div>`;
    case 'Callout':
      return `<div class="c-callout c-callout-${escAttr(a.type || 'note')}">${innerHTML}</div>`;
    case 'Figure':
      return `<figure class="c-figure"><img src="${escAttr(a.src || '')}" alt="${escAttr(a.caption || '')}"><figcaption>${a.caption || ''}</figcaption></figure>`;
    default:
      return innerHTML;
  }
}

/**
 * Two-pass MDX renderer.
 *
 * Problem with the naive approach (parseMDX before marked.parse):
 * marked.js treats <div> as a type-6 HTML block that ends at the first blank
 * line. This causes the inner content to be split out of the div and processed
 * inconsistently, leaving $$...$$ math unrendered.
 *
 * Fix: extract MDX component blocks as opaque placeholders first, run
 * marked.parse() on the placeholder text (so all non-MDX markdown renders
 * correctly), then re-inject each component with its inner content
 * independently parsed by marked.parse().
 */
function renderMarkdown(text) {
  const blocks = [];

  // 1. Extract block MDX components → replace with HTML comment placeholders
  let processed = text.replace(
    /<(Definition|Theorem|Proof|Algorithm|Callout)\b([^>]*)>([\s\S]*?)<\/\1>/g,
    (_, tag, attrs, content) => {
      const idx = blocks.length;
      blocks.push({ tag, attrs: attrs.trim(), content });
      return `\n\n<!--MDX${idx}-->\n\n`;
    },
  );

  // 2. Extract self-closing Figure
  processed = processed.replace(
    /<Figure\s+([^/]*)\s*\/>/g,
    (_, attrs) => {
      const idx = blocks.length;
      blocks.push({ tag: 'Figure', attrs: attrs.trim(), content: '' });
      return `<!--MDX${idx}-->`;
    },
  );

  // 3. Inline Cite — no inner content, replace directly
  processed = processed.replace(
    /<Cite\s+key="([^"]*)"\s*\/>/g,
    (_, key) => `<cite class="c-cite">[${key}]</cite>`,
  );

  // 4. Run marked.parse on the now-clean markdown
  let html = marked.parse(processed);

  // 5. Re-inject MDX components (inner content parsed separately)
  blocks.forEach((block, idx) => {
    const innerHTML = block.content.trim()
      ? marked.parse(block.content.trim())
      : '';
    const component = buildMDXComponent(block.tag, block.attrs, innerHTML);
    // marked may or may not wrap the comment in <p>; handle both
    html = html
      .replace(`<p><!--MDX${idx}--></p>`, component)
      .replace(`<!--MDX${idx}-->`, component);
  });

  return html;
}

function postRender(container) {
  if (window.renderMathInElement) {
    try {
      renderMathInElement(container, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$',  right: '$',  display: false },
        ],
        throwOnError: false,
      });
    } catch (e) { /* silent */ }
  }
  if (window.hljs) {
    container.querySelectorAll('pre code').forEach((b) => hljs.highlightElement(b));
  }
}

/* ── Data Fetching ─────────────────────────────────────────── */

async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn(`fetchJSON failed for ${url}:`, e.message);
    return null;
  }
}

async function fetchText(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (e) {
    console.warn(`fetchText failed for ${url}:`, e.message);
    return null;
  }
}

async function fetchManifests() {
  const entries = Object.entries(MANIFESTS);
  const [results, logsData] = await Promise.all([
    Promise.all(entries.map(async ([type, m]) => {
      const data = await fetchJSON(m.path);
      return { type, dir: m.dir, items: data || [] };
    })),
    fetchJSON(LOGS_PATH),
  ]);

  const all = [];
  for (const { type, dir, items } of results) {
    for (const item of items) all.push({ ...item, type, dir });
  }
  state.items = all;
  state.logs  = logsData || [];
}

/* ── Badge Helpers ─────────────────────────────────────────── */

function pillarBadgeHTML(pillar) {
  const label = PILLAR_DISPLAY[pillar] || pillar || '';
  return label
    ? `<span class="badge-pillar badge-pillar-${pillar}">${label}</span>`
    : '';
}

function typeBadgeHTML(type) {
  const label = TYPE_LABELS[type] || type || '';
  return label
    ? `<span class="badge-type badge-type-${type}">${label}</span>`
    : '';
}

/* ── Item Card ─────────────────────────────────────────────── */

function renderItemCard(item, index) {
  const tags = (item.tags || [])
    .map((t) => `<span class="item-tag">${t}</span>`)
    .join('');

  return `
    <div class="item-card" data-index="${index}" data-pillar="${item.pillar || ''}" role="button" tabindex="0">
      <div class="item-card-left">
        <div class="item-title">${item.title || 'Untitled'}</div>
        <div class="item-meta">
          <span class="item-date">${item.date || ''}</span>
          ${pillarBadgeHTML(item.pillar)}
          ${typeBadgeHTML(item.type)}
        </div>
        ${tags ? `<div class="item-tags">${tags}</div>` : ''}
      </div>
      <div class="item-card-right">
        <span class="view-link">→ view</span>
      </div>
    </div>
  `;
}

/* ── Render: Home ──────────────────────────────────────────── */

function renderHome() {
  const homeBody = document.getElementById('home-body');
  if (!homeBody) return;

  const recent = [...state.items]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5);

  const recentHTML = recent.length > 0
    ? recent.map((item, i) => renderItemCard(item, i)).join('')
    : `<p style="color:var(--text-tertiary);font-size:0.875rem;padding:1rem 0;">No archive entries yet.</p>`;

  homeBody.innerHTML = `
    <section class="hero">
      <p class="hero-eyebrow">Prabakaran Chandran · Pracha Labs · 2026</p>
      <h1 class="hero-title">From Foundations<br>to Frontiers</h1>
      <p class="hero-description">
        A living archive of machine learning — from its mathematical roots to its research frontiers
        to the systems that make it real. Notes, implementations, reading logs, reference tables,
        and experiments, all organized under a single taxonomy that spans the full breadth and
        depth of the field.
      </p>
    </section>

    <div class="pillar-grid">
      <div class="pillar-card pillar-card-foundations">
        <div class="pillar-roman">I</div>
        <div class="pillar-name">Math, Algorithm,<br>Theory &amp; Computation</div>
        <div class="pillar-count">33 topics</div>
      </div>
      <div class="pillar-card pillar-card-frontiers">
        <div class="pillar-roman">II</div>
        <div class="pillar-name">Frontiers in AI<br>&amp; Machine Learning</div>
        <div class="pillar-count">30 topics</div>
      </div>
      <div class="pillar-card pillar-card-systems">
        <div class="pillar-roman">III</div>
        <div class="pillar-name">Computing &amp;<br>Engineering for ML</div>
        <div class="pillar-count">18 topics</div>
      </div>
    </div>

    <section class="home-section">
      <div class="home-section-header">
        <span class="home-section-label">Recent</span>
        <a href="#" class="home-section-link" id="view-all-link">View all →</a>
      </div>
      <div id="home-recent-list">${recentHTML}</div>
    </section>
  `;

  // Wire pillar card clicks → northstar
  homeBody.querySelectorAll('.pillar-card').forEach((card) => {
    card.addEventListener('click', () => switchTab('northstar'));
  });

  // Wire "View all"
  const viewAllLink = homeBody.querySelector('#view-all-link');
  if (viewAllLink) {
    viewAllLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab('archive');
    });
  }

  // Wire recent item clicks
  homeBody.querySelectorAll('.item-card').forEach((card) => {
    const idx  = parseInt(card.dataset.index, 10);
    const item = recent[idx];
    if (!item) return;
    const open = () => { switchTab('archive'); handleItemClick(item); };
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') open();
    });
  });
}

/* ── Render: Archive ───────────────────────────────────────── */

function renderArchive() {
  const archiveView   = document.getElementById('archive-view');
  const contentViewer = document.getElementById('content-viewer');

  if (state.selectedItem) {
    archiveView.classList.add('hidden');
    contentViewer.classList.remove('hidden');
    return;
  }

  archiveView.classList.remove('hidden');
  contentViewer.classList.add('hidden');

  const sorted = [...state.items].sort((a, b) => (a.date < b.date ? 1 : -1));

  const countEl = document.getElementById('archive-count');
  if (countEl) countEl.textContent = `${sorted.length} ${sorted.length === 1 ? 'entry' : 'entries'}`;

  const listEl = document.getElementById('archive-list');

  if (sorted.length === 0) {
    listEl.innerHTML = `<div class="archive-empty">No archive entries yet.</div>`;
    return;
  }

  listEl.innerHTML = sorted.map((item, i) => renderItemCard(item, i)).join('');

  listEl.querySelectorAll('.item-card').forEach((card) => {
    const idx  = parseInt(card.dataset.index, 10);
    const item = sorted[idx];
    card.addEventListener('click',  () => handleItemClick(item));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') handleItemClick(item);
    });
  });
}

/* ── Item Click → Content Viewer ───────────────────────────── */

async function handleItemClick(item) {
  state.selectedItem = item;
  renderArchive();

  const contentBody = document.getElementById('content-body');
  contentBody.innerHTML = '<p style="color:var(--text-tertiary);padding:2rem 0;">Loading…</p>';

  const url = item.dir + item.file;
  const ext = (item.file || '').split('.').pop().toLowerCase();

  try {
    if (ext === 'md') {
      let html = state.contentCache.get(url);
      if (!html) {
        const text = await fetchText(url);
        if (!text) throw new Error('Could not load file.');
        html = renderMarkdown(text.replace(/^---[\s\S]*?---\n?/, ''));
        state.contentCache.set(url, html);
      }
      contentBody.className = 'prose';
      contentBody.innerHTML = html;
      postRender(contentBody);

    } else if (ext === 'html') {
      contentBody.className = '';
      contentBody.innerHTML = `
        <iframe
          src="${url}"
          style="width:100%;height:82vh;border:1px solid var(--border);border-radius:var(--radius-lg);background:#fff;"
          title="${escAttr(item.title)}"
          sandbox="allow-scripts allow-same-origin"
        ></iframe>
        <p style="margin-top:0.6rem;font-size:0.8rem;color:var(--text-tertiary);">
          <a href="${url}" target="_blank" rel="noopener">Open in new tab →</a>
        </p>
      `;

    } else if (ext === 'pdf') {
      contentBody.className = '';
      contentBody.innerHTML = `
        <p style="margin-bottom:1rem;color:var(--text-secondary);">PDF document.</p>
        <iframe
          src="${url}"
          style="width:100%;height:80vh;border:1px solid var(--border);border-radius:var(--radius-lg);"
          title="${escAttr(item.title)}"
        ></iframe>
        <p style="margin-top:0.75rem;">
          <a href="${url}" target="_blank" rel="noopener">Open PDF in new tab →</a>
        </p>
      `;

    } else if (ext === 'ipynb') {
      const nbUrl = `https://nbviewer.org/url/${location.origin}/${url}`;
      contentBody.className = '';
      contentBody.innerHTML = `
        <p>View this notebook on nbviewer:</p>
        <p style="margin-top:0.75rem;">
          <a href="${nbUrl}" target="_blank" rel="noopener">Open on nbviewer →</a>
        </p>
      `;

    } else if (CODE_EXTENSIONS.has(ext)) {
      let highlighted = state.contentCache.get(url);
      if (!highlighted) {
        const text = await fetchText(url);
        if (!text) throw new Error('Could not load file.');
        const lang   = hljs?.getLanguage(ext) ? ext : 'plaintext';
        const result = hljs ? hljs.highlight(text, { language: lang }) : { value: escHTML(text) };
        highlighted  = result.value;
        state.contentCache.set(url, highlighted);
      }
      contentBody.className = 'prose';
      contentBody.innerHTML = `<pre><code class="hljs language-${ext}">${highlighted}</code></pre>`;

    } else {
      contentBody.className = '';
      contentBody.innerHTML = `
        <p>This file type (<code>${ext}</code>) cannot be previewed inline.</p>
        <p style="margin-top:0.75rem;">
          <a href="${url}" target="_blank" rel="noopener" download>Download →</a>
        </p>
      `;
    }
  } catch (err) {
    contentBody.className = '';
    contentBody.innerHTML = `<p style="color:#be123c;">Error: ${err.message}</p>`;
  }
}

/* ── Render: Northstar (with taxonomy layout) ───────────────── */

async function renderNorthstar() {
  const northstarBody = document.getElementById('northstar-body');
  if (!northstarBody) return;

  if (state.northstarHTML) {
    northstarBody.innerHTML = state.northstarHTML;
    enhanceNorthstarLayout(northstarBody);
    postRender(northstarBody);
    return;
  }

  northstarBody.innerHTML = '<p style="color:var(--text-tertiary);padding:2rem 0;">Loading…</p>';

  const text = await fetchText('northstar-map.md');
  if (!text) {
    northstarBody.innerHTML = '<p style="color:#be123c;">Could not load northstar map.</p>';
    return;
  }

  const html = renderMarkdown(text.replace(/^---[\s\S]*?---\n?/, ''));
  state.northstarHTML = html;

  northstarBody.innerHTML = html;
  enhanceNorthstarLayout(northstarBody);
  postRender(northstarBody);
}

/**
 * Enhance the rendered northstar map into a structured taxonomy layout:
 * - Wraps each h2 + following content in a .northstar-pillar section
 * - Within each pillar, wraps each h3 + following content in a .northstar-group div
 * - Moves topic paragraphs (those starting with <strong>) into a .northstar-topics grid
 * - Moves intro paragraphs (before first h3) into a .northstar-pillar-intro div
 */
function enhanceNorthstarLayout(container) {
  const pillars = ['foundations', 'frontiers', 'systems'];

  // Step 1: wrap each pillar (h2 + content until next h2)
  const h2s = Array.from(container.querySelectorAll('h2'));

  h2s.forEach((h2, pillarIdx) => {
    const section = document.createElement('section');
    section.className = `northstar-pillar northstar-pillar-${pillars[pillarIdx] || 'other'}`;

    // Collect siblings until next h2
    const toMove = [];
    let sib = h2.nextElementSibling;
    while (sib && sib.tagName !== 'H2') {
      toMove.push(sib);
      sib = sib.nextElementSibling;
    }

    h2.parentNode.insertBefore(section, h2);
    section.appendChild(h2);
    toMove.forEach((el) => section.appendChild(el));
  });

  // Step 2: within each pillar, separate intro from sub-sections
  container.querySelectorAll('.northstar-pillar').forEach((section) => {
    const h3s    = Array.from(section.querySelectorAll('h3'));
    const firstH3 = h3s[0];

    // Gather intro elements (between h2 and first h3)
    if (firstH3) {
      const introDiv = document.createElement('div');
      introDiv.className = 'northstar-pillar-intro';
      const introEls = [];
      let cur = section.querySelector('h2').nextElementSibling;
      while (cur && cur !== firstH3) {
        introEls.push(cur);
        cur = cur.nextElementSibling;
      }
      if (introEls.length > 0) {
        section.insertBefore(introDiv, firstH3);
        introEls.forEach((el) => introDiv.appendChild(el));
      }
    }

    // Step 3: wrap each h3 + following content in .northstar-group
    h3s.forEach((h3) => {
      const group = document.createElement('div');
      group.className = 'northstar-group';

      const toMove = [];
      let sib = h3.nextElementSibling;
      while (sib && sib.tagName !== 'H3') {
        toMove.push(sib);
        sib = sib.nextElementSibling;
      }

      h3.parentNode.insertBefore(group, h3);
      group.appendChild(h3);

      // Create topic grid for topic paragraphs; keep other content outside
      const topicGrid = document.createElement('div');
      topicGrid.className = 'northstar-topics';
      group.appendChild(topicGrid);

      toMove.forEach((el) => {
        // Topic paragraph: <p> whose first child element is <strong>
        const isTopicP = el.tagName === 'P' && el.children[0]?.tagName === 'STRONG';
        if (isTopicP) {
          el.className = 'northstar-topic';
          topicGrid.appendChild(el);
        } else {
          group.insertBefore(el, topicGrid);
        }
      });

      // Remove empty topic grid
      if (topicGrid.childElementCount === 0) group.removeChild(topicGrid);
    });
  });
}

/* ── Render: Logs ──────────────────────────────────────────── */

function renderLogs() {
  const logsBody = document.getElementById('logs-body');
  if (!logsBody) return;

  if (!state.logs || state.logs.length === 0) {
    logsBody.innerHTML = '<p style="color:var(--text-tertiary);">No log entries yet.</p>';
    return;
  }

  const sorted = [...state.logs].sort((a, b) => (a.date < b.date ? 1 : -1));

  logsBody.innerHTML = `<div class="log-list">${sorted.map((entry) => {
    const tags = (entry.tags || []).map((t) => `<span class="log-tag">${t}</span>`).join('');
    return `
      <div class="log-entry">
        <div class="log-entry-header">
          <span class="log-date">${entry.date || ''}</span>
          ${pillarBadgeHTML(entry.pillar)}
        </div>
        <p class="log-text">${entry.entry || ''}</p>
        ${tags ? `<div class="log-tags">${tags}</div>` : ''}
      </div>
    `;
  }).join('')}</div>`;
}

/* ── Tab Switching ─────────────────────────────────────────── */

function switchTab(tabName) {
  state.tab = tabName;

  // Update nav active state
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.classList.toggle('active', link.dataset.nav === tabName);
  });

  // Show/hide panels
  document.querySelectorAll('.tab-panel').forEach((panel) => {
    const active = panel.id === `tab-${tabName}`;
    panel.classList.toggle('hidden', !active);
  });

  // Render active tab
  if      (tabName === 'home')      renderHome();
  else if (tabName === 'archive')   renderArchive();
  else if (tabName === 'northstar') renderNorthstar();
  else if (tabName === 'logs')      renderLogs();
}

/* ── Init ──────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', async () => {
  // Wire nav links
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(link.dataset.nav);
    });
  });

  // Wire brand → home
  const brand = document.querySelector('.nav-brand');
  if (brand) brand.addEventListener('click', (e) => { e.preventDefault(); switchTab('home'); });

  // Wire back button
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      state.selectedItem = null;
      renderArchive();
    });
  }

  // Load data
  await fetchManifests();

  // Initial render
  switchTab('home');

  // Pre-fetch northstar in background
  renderNorthstar();
});
