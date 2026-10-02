'use strict';

/** Utilidades visuales compartidas por todas las vistas. */

const UI = (() => {
  const iconPaths = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9h13v-9M9.5 19v-5h5v5"/>',
    library: '<path d="M4 19.5V5.5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2Z"/><path d="M6 17.5h13M8 7h7M8 10h7"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4 4"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.86 2.86-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.55v-.1A1.7 1.7 0 0 0 8.5 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.86-2.86.06-.06A1.7 1.7 0 0 0 4.1 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2.3V9.55h.1A1.7 1.7 0 0 0 4.1 8.5a1.7 1.7 0 0 0-.34-1.88l-.06-.06L6.56 3.7l.06.06A1.7 1.7 0 0 0 8.5 4.1a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V2.3h4.05v.1A1.7 1.7 0 0 0 15 4.1a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.86 2.86-.06.06A1.7 1.7 0 0 0 19.4 8.5c.14.4.35.74.6 1 .3.3.7.45 1.1.45h.1v4.05h-.1A1.7 1.7 0 0 0 19.4 15Z"/>',
    moon: '<path d="M20 15.2A8.5 8.5 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    bookmark: '<path d="M6.5 4.5A2.5 2.5 0 0 1 9 2h6a2.5 2.5 0 0 1 2.5 2.5V22L12 18.5 6.5 22V4.5Z"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16ZM20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    arrowRight: '<path d="M5 12h14M14 7l5 5-5 5"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    download: '<path d="M12 3v11m0 0 4-4m-4 4-4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
    externalLink: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4M8 21h8M9 17h6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    layers: '<path d="m12 3-9 5 9 5 9-5-9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
    bookOpen: '<path d="M3 5.5A3.5 3.5 0 0 1 6.5 2H11v18H6.5A3.5 3.5 0 0 0 3 23V5.5ZM21 5.5A3.5 3.5 0 0 0 17.5 2H13v18h4.5A3.5 3.5 0 0 1 21 23V5.5Z"/>',
    sparkles: '<path d="m12 3 1.1 3.2L16 8l-2.9 1.8L12 13l-1.1-3.2L8 8l2.9-1.8L12 3ZM5 14l.8 2.2L8 17.5l-2.2 1.3L5 21l-.8-2.2L2 17.5l2.2-1.3L5 14ZM19 13l.7 1.8 1.8.7-1.8.7L19 18l-.7-1.8-1.8-.7 1.8-.7L19 13Z"/>',
    sliders: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6"/>'
  };

  const statusLabels = {
    reading: 'En lectura',
    planned: 'Por leer',
    paused: 'En pausa',
    completed: 'Completada'
  };

  const THEME_STORAGE_KEY = 'tsundoku-theme';
  const LEGACY_THEME_STORAGE_KEY = 'novel-tracker:theme';
  const DEFAULT_THEME = 'midnight';
  const THEMES = Object.freeze([
    {
      id: 'amoled',
      name: 'AMOLED Dark',
      description: 'Negro puro y contraste máximo.',
      swatches: ['#000000', '#121212', '#80A0FF']
    },
    {
      id: 'midnight',
      name: 'Mihon Midnight',
      description: 'Azul profundo, el tema predeterminado.',
      swatches: ['#0F141C', '#1A212D', '#4D88FF']
    },
    {
      id: 'mocha',
      name: 'Mocha / Warm',
      description: 'Tonos cálidos y suaves para leer.',
      swatches: ['#1E1E2E', '#313244', '#F5C2E7']
    },
    {
      id: 'parchment',
      name: 'Pergamino Claro',
      description: 'Claro, cálido y de alto confort visual.',
      swatches: ['#F4EFEA', '#FFFFFF', '#7A2E3B']
    }
  ]);
  const THEME_IDS = THEMES.map(({ id }) => id);

  function isThemeId(theme) {
    return THEME_IDS.includes(theme);
  }

  function getStoredTheme() {
    try {
      const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (isThemeId(storedTheme)) return storedTheme;

      // Migra la preferencia anterior sin perder el tema elegido.
      const legacyTheme = window.localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
      if (legacyTheme === 'light') return 'parchment';
      if (legacyTheme === 'dark') return 'midnight';
    } catch (error) {
      console.warn('No se pudo leer el tema guardado.', error);
    }

    return DEFAULT_THEME;
  }

  function applyTheme(theme) {
    const nextTheme = isThemeId(theme) ? theme : DEFAULT_THEME;
    if (document.documentElement) document.documentElement.dataset.theme = nextTheme;
    return nextTheme;
  }

  function getActiveTheme() {
    const activeTheme = document.documentElement?.dataset.theme;
    return THEMES.find(({ id }) => id === activeTheme) || THEMES.find(({ id }) => id === DEFAULT_THEME);
  }

  function saveTheme(theme) {
    const nextTheme = applyTheme(theme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (error) {
      console.warn('No se pudo guardar el tema seleccionado.', error);
    }
    window.dispatchEvent(new CustomEvent('tsundoku:theme-change', { detail: { theme: nextTheme } }));
    return nextTheme;
  }

  function cycleTheme() {
    const activeTheme = getActiveTheme();
    const currentIndex = THEMES.findIndex(({ id }) => id === activeTheme.id);
    return saveTheme(THEMES[(currentIndex + 1) % THEMES.length].id);
  }

  function themeOption(theme) {
    const swatches = theme.swatches
      .map((color) => `<span style="background:${escapeHTML(color)}"></span>`)
      .join('');

    return `
      <button class="theme-option" type="button" data-theme-option="${escapeHTML(theme.id)}" aria-pressed="false">
        <span class="theme-option__swatches" aria-hidden="true">${swatches}</span>
        <span class="theme-option__copy"><strong>${escapeHTML(theme.name)}</strong><small>${escapeHTML(theme.description)}</small></span>
        <span class="theme-option__check" aria-hidden="true">${icon('check', 'icon--sm')}</span>
      </button>
    `;
  }

  function themeSelector() {
    return THEMES.map(themeOption).join('');
  }

  function refreshThemeSelector() {
    const activeTheme = getActiveTheme();
    document.querySelectorAll('[data-theme-option]').forEach((option) => {
      const isActive = option.dataset.themeOption === activeTheme.id;
      option.classList.toggle('is-active', isActive);
      option.setAttribute('aria-pressed', String(isActive));
    });
  }

  function mountThemeSelector(selector = '[data-theme-selector]') {
    document.querySelectorAll(selector).forEach((root) => {
      root.classList.add('theme-selector');
      root.setAttribute('role', 'group');
      root.setAttribute('aria-label', 'Selector de tema');
      root.innerHTML = themeSelector();

      if (root.dataset.themeSelectorReady === 'true') return;
      root.dataset.themeSelectorReady = 'true';
      root.addEventListener('click', (event) => {
        const option = event.target.closest('[data-theme-option]');
        if (!option || !root.contains(option)) return;
        saveTheme(option.dataset.themeOption);
        refreshThemeSelector();
      });
    });

    refreshThemeSelector();
  }

  function escapeHTML(value = '') {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function icon(name, extraClass = '') {
    const path = iconPaths[name] || iconPaths.book;
    return `<svg class="icon ${escapeHTML(extraClass)}" viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;
  }

  function assetUrl(path) {
    const prefix = document.body?.dataset.assetPrefix || './';
    return `${prefix}${String(path || '').replace(/^\.?\//, '')}`;
  }

  function coverUrl(novel) {
    return assetUrl(novel.cover);
  }

  function pageUrl(page, id) {
    const prefix = document.body?.dataset.pagePrefix || './';
    const query = id ? `?id=${encodeURIComponent(id)}` : '';
    return `${prefix}pages/${page}.html${query}`;
  }

  function homeUrl() {
    const prefix = document.body?.dataset.pagePrefix || './';
    return `${prefix}index.html`;
  }

  function statusLabel(status) {
    return statusLabels[status] || statusLabels.planned;
  }

  function progressBar(progress, label = 'Progreso') {
    const value = Math.max(0, Math.min(100, Number(progress) || 0));
    return `
      <div class="progress-track" role="progressbar" aria-label="${escapeHTML(label)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${value}">
        <span class="progress-fill" style="--progress: ${value}%"></span>
      </div>
    `;
  }

  function novelCard(item) {
    const { novel, entry, progress, favorite, pagesRead } = item;
    const detailUrl = pageUrl('detail', novel.id);
    const actionLabel = entry.status === 'planned' ? 'Ver novela' : 'Continuar';

    return `
      <article class="novel-card" data-novel-id="${escapeHTML(novel.id)}">
        <a class="novel-card__cover" href="${detailUrl}" aria-label="Ver ${escapeHTML(novel.title)}">
          <img src="${escapeHTML(coverUrl(novel))}" alt="Portada de ${escapeHTML(novel.title)}" loading="lazy">
          <span class="novel-card__genre">${escapeHTML(novel.genre)}</span>
        </a>
        <div class="novel-card__body">
          <div class="novel-card__meta">
            <span class="status-pill status-pill--${escapeHTML(entry.status)}">${escapeHTML(statusLabel(entry.status))}</span>
            <button class="favorite-button ${favorite ? 'is-active' : ''}" type="button" data-favorite="${escapeHTML(novel.id)}" aria-label="${favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}" aria-pressed="${favorite}">
              ${icon('bookmark', 'icon--sm')}
            </button>
          </div>
          <h3><a href="${detailUrl}">${escapeHTML(novel.title)}</a></h3>
          <p class="novel-card__author">${escapeHTML(novel.author)}</p>
          <div class="novel-card__progress">
            <div class="progress-meta">
              <span>${pagesRead} de ${novel.totalPages || novel.chapters.reduce((total, chapter) => total + chapter.pages, 0)} págs.</span>
              <strong>${progress}%</strong>
            </div>
            ${progressBar(progress, `Progreso de ${novel.title}`)}
          </div>
          <div class="novel-card__actions">
            <a class="novel-card__link" href="${detailUrl}">${actionLabel} ${icon('arrowRight', 'icon--sm')}</a>
            ${entry.status === 'reading' || entry.status === 'paused' ? `<button class="favorite-button" type="button" data-mark-complete="${escapeHTML(novel.id)}" aria-label="Marcar ${escapeHTML(novel.title)} como completada" title="Marcar como completada">${icon('check', 'icon--sm')}</button>` : ''}
          </div>
        </div>
      </article>
    `;
  }

  function novelGrid(items) {
    return items.map(novelCard).join('');
  }

  function quickItem(item) {
    const { novel, progress, entry } = item;
    return `
      <a class="quick-item" href="${pageUrl('detail', novel.id)}">
        <img class="quick-cover" src="${escapeHTML(coverUrl(novel))}" alt="" loading="lazy">
        <span>
          <h3>${escapeHTML(novel.title)}</h3>
          <p>${escapeHTML(statusLabel(entry.status))} · ${progress}%</p>
        </span>
        <span class="quick-item__arrow">${icon('chevronDown', 'icon--sm')}</span>
      </a>
    `;
  }

  function activityItem(item) {
    return `
      <a class="activity-item" href="${pageUrl('detail', item.novel.id)}">
        <span class="activity-item__icon">${icon(item.pages ? 'bookOpen' : 'plus', 'icon--sm')}</span>
        <span class="activity-item__copy">
          <strong>${item.pages ? escapeHTML(item.chapterTitle) : 'Añadiste una novela'}</strong>
          <span>${escapeHTML(item.novel.title)} · ${escapeHTML(formatRelativeTime(item.timestamp))}</span>
        </span>
      </a>
    `;
  }

  function unreadCount(item) {
    const { novel, entry } = item;
    return Math.max(0, novel.chapters.length - entry.completedChapters.length);
  }

  function coverCard(item) {
    const { novel, entry, progress, favorite } = item;
    const unread = unreadCount(item);
    const detailUrl = pageUrl('detail', novel.id);
    const statusClass = entry.status === 'completed'
      ? 'shell-cover-status--completed'
      : entry.status === 'reading'
        ? 'shell-cover-status--reading'
        : entry.status === 'paused'
          ? 'shell-cover-status--paused'
          : 'shell-cover-status--planned';

    return `
      <article class="shell-library-card group" data-novel-id="${escapeHTML(novel.id)}">
        <a class="shell-cover-link relative block aspect-[2/3] overflow-hidden rounded-lg bg-stone-200 shadow-sm dark:bg-stone-800" href="${detailUrl}" aria-label="Abrir ${escapeHTML(novel.title)}">
          <img class="shell-cover-image h-full w-full object-cover" src="${escapeHTML(coverUrl(novel))}" alt="Portada de ${escapeHTML(novel.title)}" loading="lazy">
          ${unread > 0 ? `<span class="shell-unread-badge absolute right-0 top-0 bg-rose-700 text-white text-xs px-1.5 py-0.5 rounded-br-lg font-bold shadow" title="${unread} capítulos sin leer">${unread}</span>` : ''}
          <span class="shell-cover-status ${statusClass}">${escapeHTML(statusLabel(entry.status))}</span>
        </a>
        <div class="shell-card-meta mt-2 flex min-w-0 items-start gap-1">
          <a class="shell-card-title min-w-0 flex-1 truncate text-xs font-semibold" href="${detailUrl}" title="${escapeHTML(novel.title)}">${escapeHTML(novel.title)}</a>
          <button class="shell-favorite-button shrink-0 rounded p-1 ${favorite ? 'is-active' : ''}" type="button" data-favorite="${escapeHTML(novel.id)}" aria-label="${favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}" aria-pressed="${favorite}">${icon('bookmark', 'icon--sm')}</button>
        </div>
        <div class="mt-1.5 flex items-center gap-2">
          <div class="shell-mini-progress h-1 flex-1 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700"><span class="block h-full rounded-full bg-blue-700 dark:bg-blue-400" style="width: ${progress}%"></span></div>
          <span class="text-[10px] tabular-nums text-stone-500 dark:text-stone-400">${progress}%</span>
        </div>
      </article>
    `;
  }

  function coverGrid(items) {
    return items.map(coverCard).join('');
  }

  function historyItem(item) {
    return `
      <a class="shell-history-item flex gap-3 rounded-lg border border-stone-200 bg-white p-3 transition hover:border-blue-300 hover:bg-blue-50/40 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-blue-700 dark:hover:bg-stone-800/60" href="${pageUrl('detail', item.novel.id)}">
        <span class="shell-history-icon grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300">${icon(item.pages ? 'bookOpen' : 'plus', 'icon--sm')}</span>
        <span class="min-w-0 flex-1">
          <strong class="block truncate text-xs font-semibold">${item.pages ? escapeHTML(item.chapterTitle) : 'Añadiste una novela'}</strong>
          <span class="mt-0.5 block truncate text-[11px] text-stone-500 dark:text-stone-400">${escapeHTML(item.novel.title)} · ${escapeHTML(formatRelativeTime(item.timestamp))}</span>
        </span>
        <span class="text-stone-400 dark:text-stone-500">${icon('arrowRight', 'icon--sm')}</span>
      </a>
    `;
  }

  function sourceCard({ title, description, count, iconName = 'layers', action = '', href = '' }) {
    const content = `
      <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300">${icon(iconName)}</span>
      <span class="min-w-0 flex-1"><strong class="block text-sm font-semibold">${escapeHTML(title)}</strong><span class="mt-0.5 block text-[11px] text-stone-500 dark:text-stone-400">${escapeHTML(description)}</span></span>
      <span class="text-xs font-semibold text-stone-400 dark:text-stone-500">${escapeHTML(count)}</span>
    `;
    const classes = 'shell-source-card flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-stone-700 dark:bg-stone-900 dark:hover:border-blue-700';
    return href
      ? `<a class="${classes}" href="${href}">${content}</a>`
      : `<button class="${classes}" type="button" ${action}>${content}</button>`;
  }

  function sourceRow(source) {
    const action = source.isInstalled
      ? `<button class="source-action source-action--installed" type="button" data-source-action="explore" data-source-id="${escapeHTML(source.id)}">Explorar ${icon('arrowRight', 'icon--sm')}</button>`
      : `<button class="source-action source-action--install" type="button" data-source-action="install" data-source-id="${escapeHTML(source.id)}">${icon('download', 'icon--sm')} Instalar</button>`;

    return `
      <article class="source-row" data-source-id="${escapeHTML(source.id)}" data-source-installed="${source.isInstalled}">
        <span class="source-logo"><img src="${escapeHTML(assetUrl(source.favicon))}" alt="Logo de ${escapeHTML(source.name)}" loading="eager"></span>
        <span class="source-copy">
          <span class="source-title-row"><strong>${escapeHTML(source.name)}</strong><span class="source-language">${escapeHTML(source.lang)}</span></span>
          <span class="source-description">${escapeHTML(source.description)}</span>
          <a class="source-url" href="${escapeHTML(source.baseUrl)}" target="_blank" rel="noreferrer">${escapeHTML(source.baseUrl)} ${icon('externalLink', 'icon--sm')}</a>
        </span>
        ${action}
      </article>
    `;
  }

  function sourceList(sources) {
    return sources.map(sourceRow).join('');
  }

  function activityChart(days, goal) {
    const maximum = Math.max(goal, ...days.map(({ pages }) => pages), 1);
    return days.map(({ label, pages, key }) => {
      const height = pages === 0 ? 4 : Math.max(12, Math.round((pages / maximum) * 100));
      const isCurrent = key === new Date().toLocaleDateString('sv-SE');
      return `
        <div class="bar-column" title="${pages} páginas">
          <div class="bar-column__plot">
            <span class="bar-column__bar ${pages ? 'has-value' : ''}" data-current="${isCurrent}" style="height: ${height}%"></span>
          </div>
          <span class="bar-column__label">${escapeHTML(label)}</span>
        </div>
      `;
    }).join('');
  }

  function chapterRow(chapter, item) {
    const isCompleted = item.entry.completedChapters.includes(chapter.id);
    const isCurrent = item.entry.currentChapter === chapter.number && !isCompleted;
    return `
      <li class="chapter-row ${isCompleted ? 'is-completed' : ''}">
        <button class="chapter-button" type="button" data-chapter-toggle="${escapeHTML(item.novel.id)}" data-chapter-id="${escapeHTML(chapter.id)}" aria-pressed="${isCompleted}" aria-label="Capítulo ${chapter.number}: ${escapeHTML(chapter.title)}. ${isCompleted ? 'Marcar como pendiente' : 'Marcar como leído'}">
          <span class="chapter-check">${icon('check', 'icon--sm')}</span>
          <span class="chapter-copy">
            <h3>Capítulo ${chapter.number} · ${escapeHTML(chapter.title)}</h3>
            <p>${chapter.pages} páginas de lectura</p>
          </span>
          <span class="chapter-row__meta">
            ${isCurrent ? '<span class="chapter-current">Actual</span>' : ''}
            <span>${isCompleted ? 'Leído' : 'Pendiente'}</span>
          </span>
        </button>
      </li>
    `;
  }

  function emptyState({ iconName = 'book', title, message, actionLabel = '', action = '' }) {
    return `
      <div class="empty-state">
        <div class="empty-state__inner">
          <span class="empty-state__icon">${icon(iconName, 'icon--lg')}</span>
          <h2>${escapeHTML(title)}</h2>
          <p>${escapeHTML(message)}</p>
          ${actionLabel ? `<button class="button" type="button" ${action}>${escapeHTML(actionLabel)}</button>` : ''}
        </div>
      </div>
    `;
  }

  function formatDate(timestamp) {
    if (!timestamp) return 'Sin actividad';
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(timestamp));
  }

  function formatRelativeTime(timestamp) {
    if (!timestamp) return 'Añadida recientemente';
    const elapsed = Math.max(0, Date.now() - timestamp);
    const minutes = Math.floor(elapsed / 60000);
    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} h`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    return formatDate(timestamp);
  }

  function themeIcon() {
    const activeTheme = getActiveTheme();
    return activeTheme.id === 'parchment'
      ? icon('sun', 'theme-icon--sun')
      : icon('moon', 'theme-icon--moon');
  }

  function toast(message, options = {}) {
    let toastElement = document.querySelector('#app-toast');
    if (!toastElement) {
      toastElement = document.createElement('div');
      toastElement.id = 'app-toast';
      toastElement.className = 'toast';
      toastElement.setAttribute('role', 'status');
      toastElement.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastElement);
    }

    window.clearTimeout(toastElement._hideTimer);
    toastElement.innerHTML = `${icon('check', 'icon--sm')}<span>${escapeHTML(message)}</span><button class="toast__close" type="button" data-dismiss-toast aria-label="Cerrar aviso">${icon('close', 'icon--sm')}</button>`;
    toastElement.classList.add('is-visible');
    toastElement._hideTimer = window.setTimeout(() => {
      toastElement.classList.remove('is-visible');
    }, options.duration || 3200);
  }

  return {
    icon,
    escapeHTML,
    assetUrl,
    coverUrl,
    pageUrl,
    homeUrl,
    statusLabel,
    progressBar,
    novelCard,
    novelGrid,
    coverCard,
    coverGrid,
    unreadCount,
    historyItem,
    sourceCard,
    sourceRow,
    sourceList,
    quickItem,
    activityItem,
    activityChart,
    chapterRow,
    emptyState,
    formatDate,
    formatRelativeTime,
    THEME_STORAGE_KEY,
    DEFAULT_THEME,
    THEMES,
    getStoredTheme,
    getActiveTheme,
    applyTheme,
    saveTheme,
    cycleTheme,
    themeSelector,
    mountThemeSelector,
    refreshThemeSelector,
    themeIcon,
    toast
  };
})();

window.UI = UI;
