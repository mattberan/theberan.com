/* ─── Theme ──────────────────────────────────────────────── */
(function () {
  const stored = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', stored);
})();

document.addEventListener('DOMContentLoaded', function () {

  /* ─── Theme toggle ──────────────────────────────────────── */
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    updateToggleIcon();
    toggle.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateToggleIcon();
    });
  }

  function updateToggleIcon() {
    if (!toggle) return;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    toggle.textContent = isDark ? '☀' : '◑';
    toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  /* ─── Mobile nav ────────────────────────────────────────── */
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
      const open = navLinks.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', open);
    });
  }

  /* ─── Active nav link ───────────────────────────────────── */
  const page = document.body.getAttribute('data-page');
  document.querySelectorAll('.nav__link[data-page]').forEach(function (el) {
    if (el.getAttribute('data-page') === page) {
      el.classList.add('nav__link--active');
      el.setAttribute('aria-current', 'page');
    }
  });

  /* ─── Route to page init ────────────────────────────────── */
  if (page === 'home')     initHome();
  if (page === 'projects') initProjects();
  if (page === 'project')  initProjectDetail();
  if (page === 'writing')  initWriting();
  if (page === 'learning') initLearning();
  if (page === 'media')    initMedia();

  /* ══════════════════════════════════════════════════════════
     HOME PAGE
  ══════════════════════════════════════════════════════════ */
  function initHome() {
    let filteredStatus = 'all';
    let sortBy = 'priority';

    renderPriorityProjects();
    renderRecentWriting();
    renderRecentLearning();
    renderRecentMedia();

    /* Status filter buttons */
    document.querySelectorAll('[data-filter-status]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        filteredStatus = btn.getAttribute('data-filter-status');
        document.querySelectorAll('[data-filter-status]').forEach(function (b) {
          b.classList.toggle('active', b === btn);
        });
        renderPriorityProjects();
      });
    });

    /* Sort select */
    const sortSel = document.getElementById('sortProjects');
    if (sortSel) {
      sortSel.addEventListener('change', function () {
        sortBy = this.value;
        renderPriorityProjects();
      });
    }

    function renderPriorityProjects() {
      const el = document.getElementById('priorityProjects');
      if (!el) return;

      let list = PROJECTS.slice();
      if (filteredStatus !== 'all') {
        list = list.filter(function (p) { return p.status === filteredStatus; });
      }
      list.sort(function (a, b) {
        if (sortBy === 'priority') return a.priority - b.priority;
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      });
      list = list.slice(0, 5);

      if (list.length === 0) {
        el.innerHTML = Render.emptyState('No projects match this filter.');
        return;
      }
      el.innerHTML = list.map(function (p) {
        return Render.projectCard(p, { showPriority: true });
      }).join('');
    }

    function renderRecentWriting() {
      const el = document.getElementById('recentWriting');
      if (!el) return;
      const list = WRITING.slice()
        .sort(function (a, b) { return new Date(b.date) - new Date(a.date); })
        .slice(0, 3);
      if (list.length === 0) {
        el.innerHTML = Render.emptyState('No writing yet.');
        return;
      }
      el.innerHTML = list.map(function (w) {
        return Render.writingCard(w, { showProject: true, excerptLen: 100 });
      }).join('');
    }

    function renderRecentLearning() {
      const el = document.getElementById('recentLearning');
      if (!el) return;
      const list = LEARNING.slice()
        .sort(function (a, b) { return new Date(b.date) - new Date(a.date); })
        .slice(0, 3);
      if (list.length === 0) {
        el.innerHTML = Render.emptyState('No learning logged yet.');
        return;
      }
      el.innerHTML = list.map(function (l) {
        return Render.learningCard(l, { showProject: true });
      }).join('');
    }

    function renderRecentMedia() {
      const el = document.getElementById('recentMedia');
      if (!el) return;
      const list = MEDIA.slice()
        .sort(function (a, b) { return new Date(b.date) - new Date(a.date); })
        .slice(0, 3);
      if (list.length === 0) {
        el.innerHTML = Render.emptyState('No media yet.');
        return;
      }
      el.innerHTML = list.map(function (m, i) { return Render.mediaThumb(m, i); }).join('');
    }
  }

  /* ══════════════════════════════════════════════════════════
     PROJECTS PAGE
  ══════════════════════════════════════════════════════════ */
  function initProjects() {
    let activeStatus = 'all';
    let activeTags = new Set();
    let sortBy = 'priority';

    buildTagFilters();
    render();

    document.querySelectorAll('[data-filter-status]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeStatus = btn.getAttribute('data-filter-status');
        document.querySelectorAll('[data-filter-status]').forEach(function (b) {
          b.classList.toggle('active', b === btn);
        });
        render();
      });
    });

    const sortSel = document.getElementById('sortProjects');
    if (sortSel) {
      sortSel.addEventListener('change', function () {
        sortBy = this.value;
        render();
      });
    }

    function buildTagFilters() {
      const el = document.getElementById('tagFilters');
      if (!el) return;
      const tags = [...new Set(PROJECTS.flatMap(function (p) { return p.tags; }))].sort();
      el.innerHTML = tags.map(function (t) {
        return `<button class="filter-btn" data-filter-tag="${Render.esc(t)}">${Render.esc(t)}</button>`;
      }).join('');
      el.querySelectorAll('[data-filter-tag]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const tag = btn.getAttribute('data-filter-tag');
          if (activeTags.has(tag)) { activeTags.delete(tag); btn.classList.remove('active'); }
          else { activeTags.add(tag); btn.classList.add('active'); }
          render();
        });
      });
    }

    function render() {
      const el = document.getElementById('projectsList');
      const countEl = document.getElementById('projectCount');
      if (!el) return;

      let list = PROJECTS.slice();
      if (activeStatus !== 'all') list = list.filter(function (p) { return p.status === activeStatus; });
      if (activeTags.size > 0) {
        list = list.filter(function (p) {
          return [...activeTags].every(function (t) { return p.tags.includes(t); });
        });
      }
      list.sort(function (a, b) {
        if (sortBy === 'priority') return a.priority - b.priority;
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      });

      if (countEl) countEl.textContent = list.length + ' project' + (list.length !== 1 ? 's' : '');

      if (list.length === 0) {
        el.innerHTML = Render.emptyState('No projects match these filters.');
        return;
      }
      el.innerHTML = list.map(function (p) { return Render.projectCard(p, { showPriority: true }); }).join('');
    }
  }

  /* ══════════════════════════════════════════════════════════
     PROJECT DETAIL PAGE
  ══════════════════════════════════════════════════════════ */
  function initProjectDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const project = id ? PROJECTS.find(function (p) { return p.id === id; }) : null;

    if (!project) {
      document.getElementById('projectContent').innerHTML = `
        <p style="color:var(--text-muted);padding:var(--sp-8) 0">
          Project not found. <a href="projects.html" style="color:var(--accent)">← Back to projects</a>
        </p>`;
      return;
    }

    document.title = project.title + ' — theberan.com';

    const writing = WRITING.filter(function (w) { return project.writeupIds.includes(w.id); });
    const learning = LEARNING.filter(function (l) { return project.learningIds.includes(l.id); });
    const media = MEDIA.filter(function (m) { return m.projectId === project.id; });

    const writingEl = writing.length > 0
      ? writing.map(function (w) { return Render.writingCard(w, { excerptLen: 160 }); }).join('')
      : Render.emptyState('No write-ups for this project yet.');

    const learningEl = learning.length > 0
      ? learning.map(function (l) { return Render.learningCard(l); }).join('')
      : Render.emptyState('No learning logged for this project yet.');

    const mediaEl = media.length > 0
      ? media.map(function (m, i) { return Render.mediaThumb(m, i); }).join('')
      : Render.emptyState('No media yet.');

    const urlEl = project.url
      ? `<div class="sidebar-meta__row">
           <span class="sidebar-meta__label">Link</span>
           <a href="${Render.esc(project.url)}" target="_blank" rel="noopener" class="sidebar-meta__value" style="color:var(--accent)">Visit ↗</a>
         </div>` : '';

    document.getElementById('projectContent').innerHTML = `
      <a href="projects.html" class="back-link">← All projects</a>
      <div class="project-detail">
        <div class="project-detail__body">
          <div style="display:flex;align-items:center;gap:var(--sp-3);margin-bottom:var(--sp-4)">
            ${Render.statusBadge(project.status)}
            ${Render.tagList(project.tags)}
          </div>
          <h1 class="project-detail__title">${Render.esc(project.title)}</h1>
          <div class="project-detail__description writing-body">
            ${Render.bodyText(project.description)}
          </div>

          ${media.length > 0 ? `
          <div class="project-detail__section">
            <h2 class="project-detail__section-title">Media</h2>
            <div class="media-grid">${mediaEl}</div>
          </div>` : ''}

          <div class="project-detail__section">
            <h2 class="project-detail__section-title">Write-ups</h2>
            <div class="card-grid">${writingEl}</div>
          </div>

          <div class="project-detail__section">
            <h2 class="project-detail__section-title">Learning</h2>
            <div class="card-grid">${learningEl}</div>
          </div>
        </div>

        <aside class="project-detail__sidebar">
          <div class="sidebar-meta">
            <div class="sidebar-meta__row">
              <span class="sidebar-meta__label">Status</span>
              <span class="sidebar-meta__value">${Render.statusBadge(project.status)}</span>
            </div>
            <div class="sidebar-meta__row">
              <span class="sidebar-meta__label">Priority</span>
              <span class="sidebar-meta__value">#${project.priority}</span>
            </div>
            <div class="sidebar-meta__row">
              <span class="sidebar-meta__label">Updated</span>
              <span class="sidebar-meta__value">${Render.formatDate(project.lastUpdated)}</span>
            </div>
            <div class="sidebar-meta__row">
              <span class="sidebar-meta__label">Write-ups</span>
              <span class="sidebar-meta__value">${writing.length}</span>
            </div>
            <div class="sidebar-meta__row">
              <span class="sidebar-meta__label">Learning</span>
              <span class="sidebar-meta__value">${learning.length}</span>
            </div>
            ${urlEl}
          </div>
        </aside>
      </div>`;

    /* Lightbox for project media */
    if (media.length > 0) initLightbox(media, '#projectContent .media-grid');
  }

  /* ══════════════════════════════════════════════════════════
     WRITING PAGE
  ══════════════════════════════════════════════════════════ */
  function initWriting() {
    let activeProject = 'all';
    let activeTags = new Set();
    let expanded = null;

    buildProjectFilter();
    buildTagFilters();
    render();

    function buildProjectFilter() {
      const el = document.getElementById('projectFilter');
      if (!el) return;
      const ids = [...new Set(WRITING.filter(function (w) { return w.projectId; }).map(function (w) { return w.projectId; }))];
      const opts = ids.map(function (id) {
        const p = PROJECTS.find(function (x) { return x.id === id; });
        return p ? `<option value="${Render.esc(id)}">${Render.esc(p.title)}</option>` : '';
      }).join('');
      el.innerHTML = `<option value="all">All projects</option>${opts}`;
      el.addEventListener('change', function () { activeProject = this.value; render(); });
    }

    function buildTagFilters() {
      const el = document.getElementById('tagFilters');
      if (!el) return;
      const tags = [...new Set(WRITING.flatMap(function (w) { return w.tags; }))].sort();
      el.innerHTML = tags.map(function (t) {
        return `<button class="filter-btn" data-tag="${Render.esc(t)}">${Render.esc(t)}</button>`;
      }).join('');
      el.querySelectorAll('[data-tag]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const tag = btn.getAttribute('data-tag');
          if (activeTags.has(tag)) { activeTags.delete(tag); btn.classList.remove('active'); }
          else { activeTags.add(tag); btn.classList.add('active'); }
          render();
        });
      });
    }

    function render() {
      const el = document.getElementById('writingList');
      const countEl = document.getElementById('writingCount');
      if (!el) return;

      let list = WRITING.slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
      if (activeProject !== 'all') list = list.filter(function (w) { return w.projectId === activeProject; });
      if (activeTags.size > 0) {
        list = list.filter(function (w) {
          return [...activeTags].every(function (t) { return w.tags.includes(t); });
        });
      }

      if (countEl) countEl.textContent = list.length + ' entr' + (list.length !== 1 ? 'ies' : 'y');

      if (list.length === 0) {
        el.innerHTML = Render.emptyState('No writing matches these filters.');
        return;
      }
      el.innerHTML = list.map(function (w) { return Render.writingCard(w, { showProject: true, excerptLen: 180 }); }).join('');
    }
  }

  /* ══════════════════════════════════════════════════════════
     LEARNING PAGE
  ══════════════════════════════════════════════════════════ */
  function initLearning() {
    let activeType = 'all';
    let activeProject = 'all';

    buildProjectFilter();
    render();

    document.querySelectorAll('[data-filter-type]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeType = btn.getAttribute('data-filter-type');
        document.querySelectorAll('[data-filter-type]').forEach(function (b) {
          b.classList.toggle('active', b === btn);
        });
        render();
      });
    });

    function buildProjectFilter() {
      const el = document.getElementById('projectFilter');
      if (!el) return;
      const ids = [...new Set(LEARNING.filter(function (l) { return l.projectId; }).map(function (l) { return l.projectId; }))];
      const opts = ids.map(function (id) {
        const p = PROJECTS.find(function (x) { return x.id === id; });
        return p ? `<option value="${Render.esc(id)}">${Render.esc(p.title)}</option>` : '';
      }).join('');
      el.innerHTML = `<option value="all">All projects</option>${opts}`;
      el.addEventListener('change', function () { activeProject = this.value; render(); });
    }

    function render() {
      const el = document.getElementById('learningList');
      const countEl = document.getElementById('learningCount');
      if (!el) return;

      let list = LEARNING.slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
      if (activeType !== 'all') list = list.filter(function (l) { return l.type === activeType; });
      if (activeProject !== 'all') list = list.filter(function (l) { return l.projectId === activeProject; });

      if (countEl) countEl.textContent = list.length + ' entr' + (list.length !== 1 ? 'ies' : 'y');

      if (list.length === 0) {
        el.innerHTML = Render.emptyState('No learning entries match these filters.');
        return;
      }
      el.innerHTML = list.map(function (l) { return Render.learningCard(l, { showProject: true }); }).join('');
    }
  }

  /* ══════════════════════════════════════════════════════════
     MEDIA PAGE
  ══════════════════════════════════════════════════════════ */
  function initMedia() {
    let activeProject = 'all';

    buildProjectFilter();
    render();

    function buildProjectFilter() {
      const el = document.getElementById('projectFilter');
      if (!el) return;
      const ids = [...new Set(MEDIA.filter(function (m) { return m.projectId; }).map(function (m) { return m.projectId; }))];
      if (ids.length === 0) { el.style.display = 'none'; return; }
      const opts = ids.map(function (id) {
        const p = PROJECTS.find(function (x) { return x.id === id; });
        return p ? `<option value="${Render.esc(id)}">${Render.esc(p.title)}</option>` : '';
      }).join('');
      el.innerHTML = `<option value="all">All projects</option>${opts}`;
      el.addEventListener('change', function () { activeProject = this.value; render(); });
    }

    function render() {
      const el = document.getElementById('mediaGallery');
      if (!el) return;
      let list = MEDIA.slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
      if (activeProject !== 'all') list = list.filter(function (m) { return m.projectId === activeProject; });

      if (list.length === 0) {
        el.innerHTML = Render.emptyState('No media yet. Drop images in assets/ and add entries to MEDIA in data.js.');
        return;
      }
      el.innerHTML = list.map(function (m, i) { return Render.mediaThumb(m, i); }).join('');
      initLightbox(list, '#mediaGallery');
    }
  }

  /* ══════════════════════════════════════════════════════════
     LIGHTBOX
  ══════════════════════════════════════════════════════════ */
  function initLightbox(items, containerSel) {
    const lb = document.getElementById('lightbox');
    if (!lb || items.length === 0) return;

    const img = lb.querySelector('.lightbox__img');
    const cap = lb.querySelector('.lightbox__caption');
    let current = 0;

    function open(index) {
      current = ((index % items.length) + items.length) % items.length;
      img.src = items[current].src || '';
      if (cap) cap.textContent = items[current].caption || '';
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      lb.focus();
    }

    function close() {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll(containerSel + ' .media-thumb').forEach(function (el) {
      el.addEventListener('click', function () { open(parseInt(el.getAttribute('data-index'), 10)); });
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') open(parseInt(el.getAttribute('data-index'), 10)); });
    });

    lb.querySelector('.lightbox__close').addEventListener('click', close);
    lb.querySelector('.lightbox__prev').addEventListener('click', function () { open(current - 1); });
    lb.querySelector('.lightbox__next').addEventListener('click', function () { open(current + 1); });

    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') open(current - 1);
      if (e.key === 'ArrowRight') open(current + 1);
    });
  }

});
