/* Shared rendering functions — all return HTML strings */
const Render = (() => {

  /* ─── Utilities ─────────────────────────────────────────── */
  function esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function ago(dateStr) {
    if (!dateStr) return '';
    const then = new Date(dateStr + 'T00:00:00');
    const diff = Math.round((Date.now() - then) / 86400000);
    if (diff === 0) return 'today';
    if (diff === 1) return 'yesterday';
    if (diff < 7) return diff + 'd ago';
    if (diff < 30) return Math.round(diff / 7) + 'w ago';
    if (diff < 365) return Math.round(diff / 30) + 'mo ago';
    return Math.round(diff / 365) + 'y ago';
  }

  function excerpt(str, len) {
    if (!str) return '';
    const plain = str.replace(/\n/g, ' ');
    return plain.length > len ? plain.slice(0, len).trimEnd() + '…' : plain;
  }

  /* ─── Badges ────────────────────────────────────────────── */
  function statusBadge(status) {
    const labels = { active: 'Active', paused: 'Paused', complete: 'Complete', idea: 'Idea' };
    return `<span class="badge badge--${esc(status)}">${labels[status] || esc(status)}</span>`;
  }

  function typeBadge(type) {
    const labels = { cert: 'Cert', course: 'Course', experiment: 'Experiment', resource: 'Resource', note: 'Note' };
    return `<span class="badge badge--type-${esc(type)}">${labels[type] || esc(type)}</span>`;
  }

  /* ─── Tag list ──────────────────────────────────────────── */
  function tagList(tags) {
    if (!tags || tags.length === 0) return '';
    return `<ul class="tag-list" aria-label="Tags">${tags.map(t => `<li class="tag">${esc(t)}</li>`).join('')}</ul>`;
  }

  /* ─── Project card ──────────────────────────────────────── */
  function projectCard(project, opts = {}) {
    const { showPriority = false } = opts;
    const priorityEl = showPriority
      ? `<span class="priority-number">#${project.priority}</span>` : '';

    return `
      <article class="card project-card" data-status="${esc(project.status)}" data-id="${esc(project.id)}">
        <div class="card__meta">
          ${priorityEl}
          ${statusBadge(project.status)}
          <time class="card__date">${ago(project.lastUpdated)}</time>
        </div>
        <h3 class="card__title">
          <a href="project.html?id=${esc(project.id)}" class="card__title-link">${esc(project.title)}</a>
        </h3>
        <p class="card__description">${esc(excerpt(project.description, 140))}</p>
        <div class="card__footer">
          ${tagList(project.tags)}
          <a href="project.html?id=${esc(project.id)}" class="btn btn--ghost btn--sm">View →</a>
        </div>
      </article>`;
  }

  /* ─── Writing card ──────────────────────────────────────── */
  function writingCard(entry, opts = {}) {
    const { showProject = false, excerptLen = 120 } = opts;
    let projectEl = '';
    if (showProject && entry.projectId) {
      const p = (typeof PROJECTS !== 'undefined') ? PROJECTS.find(x => x.id === entry.projectId) : null;
      if (p) {
        projectEl = `<a href="project.html?id=${esc(p.id)}" class="writing-card__project">${esc(p.title)}</a>`;
      }
    }
    const preview = excerpt(entry.body, excerptLen);
    return `
      <article class="card writing-card" data-id="${esc(entry.id)}" data-project="${esc(entry.projectId || '')}">
        <div class="card__meta">
          <time class="card__date">${formatDate(entry.date)}</time>
          ${projectEl}
        </div>
        <h3 class="card__title">${esc(entry.title)}</h3>
        ${preview ? `<p class="card__description">${esc(preview)}</p>` : ''}
        <div class="card__footer">
          ${tagList(entry.tags)}
        </div>
      </article>`;
  }

  /* ─── Learning card ─────────────────────────────────────── */
  function learningCard(entry, opts = {}) {
    const { showProject = false } = opts;
    let projectEl = '';
    if (showProject && entry.projectId) {
      const p = (typeof PROJECTS !== 'undefined') ? PROJECTS.find(x => x.id === entry.projectId) : null;
      if (p) {
        projectEl = `<a href="project.html?id=${esc(p.id)}" class="learning-card__project">${esc(p.title)}</a>`;
      }
    }
    const externalLink = entry.url
      ? `<a href="${esc(entry.url)}" target="_blank" rel="noopener" class="external-link" aria-label="Open resource">↗</a>` : '';

    return `
      <article class="card learning-card" data-id="${esc(entry.id)}" data-type="${esc(entry.type)}" data-project="${esc(entry.projectId || '')}">
        <div class="card__meta">
          ${typeBadge(entry.type)}
          <time class="card__date">${formatDate(entry.date)}</time>
          ${projectEl}
        </div>
        <h3 class="card__title">${esc(entry.title)} ${externalLink}</h3>
        ${entry.notes ? `<p class="card__description">${esc(excerpt(entry.notes, 160))}</p>` : ''}
        <div class="card__footer">
          ${tagList(entry.tags)}
        </div>
      </article>`;
  }

  /* ─── Media thumb ───────────────────────────────────────── */
  function mediaThumb(item, index) {
    const placeholder = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='400' height='300' fill='%23242420'/><text x='50%25' y='50%25' fill='%23484840' font-family='system-ui' font-size='14' text-anchor='middle' dy='.35em'>No image</text></svg>`;
    return `
      <figure class="media-thumb" data-index="${index}" tabindex="0" role="button" aria-label="View ${esc(item.caption || 'image')}">
        <img src="${esc(item.src) || placeholder}" alt="${esc(item.caption || '')}" loading="lazy" class="media-thumb__img"
          onerror="this.src='${placeholder}'">
        ${item.caption ? `<figcaption class="media-thumb__caption">${esc(item.caption)}</figcaption>` : ''}
      </figure>`;
  }

  /* ─── Empty state ───────────────────────────────────────── */
  function emptyState(msg) {
    return `<div class="empty-state"><p>${esc(msg)}</p></div>`;
  }

  /* ─── Body text renderer (newlines → paragraphs) ────────── */
  function bodyText(str) {
    if (!str) return '';
    return str.split(/\n\n+/).map(p => `<p>${esc(p.trim())}</p>`).join('\n');
  }

  return {
    esc, formatDate, ago, excerpt,
    statusBadge, typeBadge, tagList,
    projectCard, writingCard, learningCard, mediaThumb,
    emptyState, bodyText
  };
})();
