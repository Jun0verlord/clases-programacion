'use strict';

/** Inicialización del shell y controladores de cada vista. */

(function initTracker() {
  const page = document.body.dataset.page;
  let libraryState = null;
  let browseState = null;
  let shellState = null;

  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  }

  ready(() => {
    initializeShell();
    initializeSharedActions();

    const renderers = {
      dashboard: initializeDashboard,
      library: initializeLibrary,
      detail: initializeDetail,
      browse: initializeBrowse,
      shell: initializeShellApp
    };

    renderers[page]?.();

    TrackerStore.subscribe(() => {
      if (page === 'dashboard') renderDashboard();
      if (page === 'library') renderLibrary();
      if (page === 'detail') renderDetail();
      if (page === 'browse') renderBrowse();
      if (page === 'shell') renderShellView();
    });

    const initialRenderer = {
      dashboard: renderDashboard,
      library: renderLibrary,
      detail: renderDetail,
      browse: renderBrowse,
      shell: renderShellView
    };

    initialRenderer[page]?.();
  });

  function initializeShell() {
    initializeTheme();
    initializeMobileMenu();
    initializeCurrentDate();
    initializeGlobalSearch();
    initializeSidebarNavigation();
  }

  function initializeSidebarNavigation() {
    // Manejar navegación desde la barra lateral colapsable
    window.addEventListener('tsundoku:navigate', (event) => {
      const { view } = event.detail;
      const page = document.body.dataset.page;

      // Mapear vistas a páginas
      const viewToPage = {
        dashboard: 'index.html',
        library: 'pages/library.html',
        browse: 'pages/browse.html',
        sources: 'index.html#sources',
        settings: 'index.html#settings'
      };

      // Si la vista corresponde a una página diferente, navegar
      if (viewToPage[view]) {
        const targetUrl = viewToPage[view];
        const currentPath = window.location.pathname;

        // Verificar si ya estamos en la página correcta
        if (view === 'library' && currentPath.includes('library.html')) {
          // Ya estamos en biblioteca, solo actualizar estado activo
          updateSidebarActiveState(view);
        } else if (view === 'browse' && currentPath.includes('browse.html')) {
          updateSidebarActiveState(view);
        } else if (view === 'dashboard' && (currentPath.endsWith('index.html') || currentPath.endsWith('/'))) {
          updateSidebarActiveState(view);
        } else {
          // Navegar a la página correspondiente
          window.location.href = targetUrl;
          return;
        }
      }

      updateSidebarActiveState(view);
    });
  }

  function updateSidebarActiveState(view) {
    // Mapear vistas a items de navegación
    const viewToNavItem = {
      dashboard: 'dashboard',
      library: 'library',
      browse: 'browse',
      sources: 'sources',
      settings: 'settings'
    };

    const navItemValue = viewToNavItem[view];
    if (!navItemValue) return;

    // Actualizar estado activo en la barra lateral
    document.querySelectorAll('[data-nav-item]').forEach((item) => {
      const isActive = item.dataset.navItem === navItemValue;
      item.classList.toggle('is-active', isActive);
      if (isActive) {
        item.setAttribute('aria-current', 'page');
      } else {
        item.removeAttribute('aria-current');
      }
    });
  }

  function initializeTheme() {
    UI.applyTheme(UI.getStoredTheme());
    UI.mountThemeSelector();
    updateThemeControls();

    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        UI.cycleTheme();
        updateThemeControls();
      });
    });

    window.addEventListener('tsundoku:theme-change', () => {
      UI.refreshThemeSelector();
      updateThemeControls();
    });
  }

  function updateThemeControls() {
    const activeTheme = UI.getActiveTheme();
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.setAttribute('aria-label', `Tema actual: ${activeTheme.name}. Cambiar tema`);
      button.setAttribute('aria-pressed', 'false');
      button.title = `Tema: ${activeTheme.name}`;
      const label = button.querySelector('[data-theme-label]');
      if (label) label.textContent = activeTheme.name;
    });
  }

  function initializeMobileMenu() {
    const openButton = document.querySelector('[data-open-menu]');
    const closeButton = document.querySelector('[data-close-menu]');
    const overlay = document.querySelector('[data-menu-overlay]');
    if (!openButton || !closeButton || !overlay) return;

    function setOpen(isOpen) {
      document.body.classList.toggle('is-menu-open', isOpen);
      openButton.setAttribute('aria-expanded', String(isOpen));
      closeButton.setAttribute('aria-expanded', String(isOpen));
    }

    openButton.addEventListener('click', () => setOpen(true));
    closeButton.addEventListener('click', () => setOpen(false));
    overlay.addEventListener('click', () => setOpen(false));
    document.querySelectorAll('.sidebar a').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && document.body.classList.contains('is-menu-open')) {
        setOpen(false);
        openButton.focus();
      }
    });
  }

  function initializeCurrentDate() {
    const currentDate = new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(new Date());
    document.querySelectorAll('[data-current-date]').forEach((element) => {
      element.textContent = currentDate;
    });
  }

  function initializeGlobalSearch() {
    document.querySelectorAll('[data-global-search-form]').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const input = form.querySelector('input[name="q"]');
        const query = input?.value.trim() || '';
        window.location.href = `${UI.pageUrl('browse')}${query ? `&q=${encodeURIComponent(query)}` : ''}`;
      });
    });
  }

  function initializeSharedActions() {
    document.addEventListener('click', (event) => {
      const favoriteButton = event.target.closest('[data-favorite]');
      const completeButton = event.target.closest('[data-mark-complete]');
      const startButton = event.target.closest('[data-start-reading]');
      const currentButton = event.target.closest('[data-mark-current]');
      const chapterButton = event.target.closest('[data-chapter-toggle]');
      const openDialogButton = event.target.closest('[data-open-dialog]');
      const closeDialogButton = event.target.closest('[data-close-dialog]');
      const dismissToast = event.target.closest('[data-dismiss-toast]');

      if (favoriteButton) {
        const isFavorite = TrackerStore.toggleFavorite(favoriteButton.dataset.favorite);
        UI.toast(isFavorite ? 'Añadida a favoritos.' : 'Quitada de favoritos.');
        return;
      }

      if (completeButton) {
        TrackerStore.setStatus(completeButton.dataset.markComplete, 'completed');
        UI.toast('Novela marcada como completada.');
        return;
      }

      if (startButton) {
        const novelId = startButton.dataset.startReading;
        const chapterId = startButton.dataset.chapterId;
        TrackerStore.startReading(novelId, chapterId);
        UI.toast('Punto de lectura actualizado.');
        return;
      }

      if (currentButton) {
        const novelId = currentButton.dataset.markCurrent;
        const chapterId = currentButton.dataset.chapterId;
        const item = TrackerStore.getLibrary().find(({ novel }) => novel.id === novelId);
        if (item?.entry.completedChapters.includes(chapterId)) {
          UI.toast('Ese capítulo ya estaba marcado como leído.');
          return;
        }
        TrackerStore.toggleChapter(novelId, chapterId);
        UI.toast('Capítulo marcado como leído.');
        return;
      }

      if (chapterButton) {
        TrackerStore.toggleChapter(
          chapterButton.dataset.chapterToggle,
          chapterButton.dataset.chapterId
        );
        return;
      }

      if (openDialogButton) {
        openDialog(openDialogButton.dataset.openDialog);
        return;
      }

      if (closeDialogButton) {
        closeDialog(closeDialogButton.closest('dialog'));
        return;
      }

      if (dismissToast) {
        const toast = dismissToast.closest('.toast');
        toast?.classList.remove('is-visible');
      }
    });

    document.querySelectorAll('dialog').forEach((dialog) => {
      dialog.addEventListener('click', (event) => {
        if (event.target === dialog) closeDialog(dialog);
      });
    });
  }

  function openDialog(id) {
    const dialog = document.getElementById(id);
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    dialog.querySelector('input, select, textarea, button')?.focus();
  }

  function closeDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  }

  function initializeShellApp() {
    shellState = {
      view: 'library',
      filter: 'all',
      query: '',
      sourceTab: 'installed',
      installedSourceIds: TrackerStore.getInstalledSourceIds()
    };

    const shellViews = ['library', 'history', 'sources', 'settings'];
    const initialView = window.location.hash.replace('#', '');
    if (shellViews.includes(initialView)) shellState.view = initialView;

    const searchPanel = document.querySelector('[data-shell-search-panel]');
    const searchInput = document.querySelector('[data-shell-search-input]');
    const searchToggle = document.querySelector('[data-shell-search-toggle]');
    const menu = document.querySelector('[data-shell-menu]');
    const menuToggle = document.querySelector('[data-shell-menu-toggle]');

    searchToggle?.addEventListener('click', () => {
      const isHidden = searchPanel?.hidden ?? true;
      if (searchPanel) searchPanel.hidden = !isHidden;
      if (isHidden) searchInput?.focus();
    });

    searchInput?.addEventListener('input', () => {
      shellState.query = searchInput.value.trim().toLocaleLowerCase('es');
      if (shellState.view !== 'library') shellState.view = 'library';
      renderShellView();
    });

    document.querySelector('[data-shell-search-form]')?.addEventListener('submit', (event) => {
      event.preventDefault();
      if (searchInput) {
        shellState.query = searchInput.value.trim().toLocaleLowerCase('es');
        shellState.view = 'library';
        renderShellView();
      }
    });

    menuToggle?.addEventListener('click', () => {
      if (menu) menu.hidden = !menu.hidden;
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (searchPanel) searchPanel.hidden = true;
      if (menu) menu.hidden = true;
    });

    window.addEventListener('hashchange', () => {
      const nextView = window.location.hash.replace('#', '');
      if (shellViews.includes(nextView) && nextView !== shellState.view) {
        shellState.view = nextView;
        renderShellView();
      }
    });

    document.addEventListener('click', (event) => {
      const nav = event.target.closest('[data-shell-nav]');
      if (nav) {
        event.preventDefault();
        shellState.view = nav.dataset.shellNav;
        window.history.replaceState(null, '', `#${shellState.view}`);
        if (searchPanel) searchPanel.hidden = true;
        if (menu) menu.hidden = true;
        renderShellView();
        return;
      }

      const filter = event.target.closest('[data-shell-filter]');
      if (filter) {
        shellState.filter = filter.dataset.shellFilter;
        renderShellView();
        return;
      }

      const sourceTab = event.target.closest('[data-shell-source-tab]');
      if (sourceTab) {
        shellState.sourceTab = sourceTab.dataset.shellSourceTab;
        renderShellView();
        return;
      }

      const sourceAction = event.target.closest('[data-source-action]');
      if (sourceAction) {
        const sourceId = sourceAction.dataset.sourceId;
        const source = NovelData.getSourceById(sourceId);
        if (sourceAction.dataset.sourceAction === 'install' && source) {
          TrackerStore.installSource(sourceId);
          if (!shellState.installedSourceIds.includes(sourceId)) {
            shellState.installedSourceIds.push(sourceId);
          }
          shellState.sourceTab = 'installed';
          renderShellView();
          UI.toast(`${source.name} se instaló correctamente.`);
        } else if (sourceAction.dataset.sourceAction === 'explore' && source) {
          shellState.view = 'library';
          window.history.replaceState(null, '', '#library');
          renderShellView();
          UI.toast(`Explorando ${source.name}.`);
        }
        return;
      }

      const go = event.target.closest('[data-shell-go]');
      if (go) {
        shellState.view = go.dataset.shellGo;
        window.history.replaceState(null, '', `#${shellState.view}`);
        if (menu) menu.hidden = true;
        renderShellView();
        return;
      }

      if (event.target.closest('[data-shell-open-browse]')) {
        window.location.href = UI.pageUrl('browse');
        return;
      }

      if (event.target.closest('[data-shell-reset]')) {
        TrackerStore.reset();
        shellState.installedSourceIds = TrackerStore.getInstalledSourceIds();
        shellState.filter = 'all';
        shellState.query = '';
        if (searchInput) searchInput.value = '';
        renderShellView();
        UI.toast('Se han restablecido los datos de ejemplo.');
        return;
      }

      if (menu && !menu.hidden && !event.target.closest('[data-shell-menu]') && !event.target.closest('[data-shell-menu-toggle]')) {
        menu.hidden = true;
      }
    });

    document.querySelector('[data-shell-goal-form]')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = document.querySelector('[data-shell-goal-input]');
      if (!input) return;
      TrackerStore.setWeeklyGoal(input.value);
      UI.toast('Meta semanal actualizada.');
    });
  }

  function renderShellView() {
    if (!shellState) return;

    document.querySelectorAll('[data-shell-view]').forEach((view) => {
      view.hidden = view.dataset.shellView !== shellState.view;
    });

    document.querySelectorAll('[data-shell-nav]').forEach((item) => {
      const isActive = item.dataset.shellNav === shellState.view;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-current', isActive ? 'page' : 'false');
    });

    if (shellState.view === 'history') renderShellHistory();
    if (shellState.view === 'sources') renderShellSources();
    if (shellState.view === 'settings') renderShellSettings();
    if (shellState.view === 'library') renderShellLibrary();
  }

  function renderShellLibrary() {
    let library = TrackerStore.getLibrary();

    if (shellState.filter === 'favorites') {
      library = library.filter(({ favorite }) => favorite);
    } else if (shellState.filter !== 'all') {
      library = library.filter(({ entry }) => entry.status === shellState.filter);
    }

    if (shellState.query) {
      library = library.filter(({ novel }) => [
        novel.title,
        novel.author,
        novel.genre,
        ...(novel.tags || [])
      ].some((value) => value.toLocaleLowerCase('es').includes(shellState.query)));
    }

    library = sortByUpdated(library);
    setText('[data-shell-count]', `${library.length} ${library.length === 1 ? 'título' : 'títulos'}`);
    const queryLabel = document.querySelector('[data-shell-search-input]')?.value.trim();
    setText('[data-shell-search-summary]', shellState.query ? `Resultados para “${queryLabel || shellState.query}”` : 'Tu colección personal');

    document.querySelectorAll('[data-shell-filter]').forEach((button) => {
      const isActive = button.dataset.shellFilter === shellState.filter;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    const grid = document.querySelector('[data-shell-grid]');
    if (!grid) return;
    grid.innerHTML = library.length
      ? UI.coverGrid(library)
      : `<div class="col-span-full rounded-xl border border-dashed border-stone-300 p-10 text-center text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">No hay títulos que coincidan con este filtro.</div>`;
  }

  function renderShellHistory() {
    const activity = TrackerStore.getRecentActivity(12);
    setText('[data-shell-history-count]', `${activity.length} ${activity.length === 1 ? 'entrada' : 'entradas'}`);
    const list = document.querySelector('[data-shell-history]');
    if (!list) return;
    list.innerHTML = activity.length
      ? activity.map(UI.historyItem).join('')
      : `<div class="rounded-xl border border-dashed border-stone-300 p-10 text-center text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">Todavía no hay actividad registrada.</div>`;
  }

  function renderShellSources() {
    const sources = NovelData.sources.map((source) => ({
      ...source,
      isInstalled: shellState.installedSourceIds.includes(source.id)
    }));
    const installed = sources.filter(({ isInstalled }) => isInstalled);
    const available = sources.filter(({ isInstalled }) => !isInstalled);
    const showingInstalled = shellState.sourceTab !== 'available';
    const visibleSources = showingInstalled ? installed : available;

    document.querySelectorAll('[data-shell-source-tab]').forEach((tab) => {
      const isActive = (tab.dataset.shellSourceTab === 'installed') === showingInstalled;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });

    setText('[data-shell-source-count]', `${visibleSources.length} ${visibleSources.length === 1 ? 'fuente' : 'fuentes'}`);
    setText('[data-shell-source-note]', showingInstalled
      ? 'Fuentes disponibles para explorar desde tu biblioteca.'
      : 'Extensiones y repositorios que puedes añadir a Tsundoku.');

    const list = document.querySelector('[data-shell-source-list]');
    if (!list) return;
    list.innerHTML = visibleSources.length
      ? UI.sourceList(visibleSources)
      : `<div class="rounded-xl border border-dashed border-stone-300 p-10 text-center text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">No hay fuentes disponibles en esta sección.</div>`;
  }

  function renderShellSettings() {
    const state = TrackerStore.getState();
    const goalInput = document.querySelector('[data-shell-goal-input]');
    if (goalInput) goalInput.value = state.weeklyGoal;
    UI.refreshThemeSelector();
  }

  function initializeDashboard() {
    // El dashboard subscribe sus elementos en initializeSharedActions y se
    // vuelve a renderizar cuando cambia el estado desde cualquier vista.
  }

  function renderDashboard() {
    const library = TrackerStore.getLibrary();
    const reading = library
      .filter(({ entry }) => entry.status === 'reading' || entry.status === 'paused')
      .sort((a, b) => (b.entry.lastReadAt || 0) - (a.entry.lastReadAt || 0));
    const current = reading[0] || library[0];

    setText('[data-stat-reading]', library.filter(({ entry }) => entry.status === 'reading').length);
    setText('[data-stat-planned]', library.filter(({ entry }) => entry.status === 'planned').length);
    setText('[data-stat-completed]', library.filter(({ entry }) => entry.status === 'completed').length);
    setText('[data-stat-pages]', library.reduce((total, item) => total + item.pagesRead, 0).toLocaleString('es-ES'));

    if (!current) {
      document.querySelector('[data-current-reading]')?.setAttribute('hidden', '');
      return;
    }

    const currentPanel = document.querySelector('[data-current-reading]');
    currentPanel?.removeAttribute('hidden');
    const currentChapter = current.novel.chapters[current.entry.currentChapter - 1] || current.novel.chapters.at(-1);
    setText('[data-current-title]', current.novel.title);
    setText('[data-current-author]', current.novel.author);
    setText('[data-current-status]', UI.statusLabel(current.entry.status));
    const currentStatus = document.querySelector('[data-current-status]');
    if (currentStatus) currentStatus.className = `status-pill status-pill--${current.entry.status}`;
    setText('[data-current-chapter]', `Capítulo ${currentChapter.number} · ${currentChapter.title}`);
    setText('[data-current-percent]', `${current.progress}%`);
    setText('[data-current-page]', `${current.pagesRead} de ${current.novel.totalPages || current.novel.chapters.reduce((total, chapter) => total + chapter.pages, 0)} páginas`);
    setStyle('[data-current-bar]', '--progress', `${current.progress}%`);
    document.querySelector('[data-current-bar]')?.closest('[role="progressbar"]')?.setAttribute('aria-valuenow', String(current.progress));
    setSource('[data-current-cover]', UI.coverUrl(current.novel), `Portada de ${current.novel.title}`);
    setHref('[data-current-link]', UI.pageUrl('detail', current.novel.id));
    setAttribute('[data-start-reading]', 'data-chapter-id', currentChapter.id);
    setAttribute('[data-start-reading]', 'data-start-reading', current.novel.id);
    setText('[data-start-reading-label]', current.entry.status === 'planned' ? 'Empezar lectura' : 'Actualizar punto de lectura');

    renderList('[data-continue-list]', reading.slice(0, 3), UI.quickItem);
    renderList('[data-library-preview]', sortByUpdated(library).slice(0, 6), UI.novelCard);

    const weeklyStats = TrackerStore.getWeeklyStats();
    setText('[data-goal-pages]', `${weeklyStats.total} / ${weeklyStats.goal} páginas`);
    setText('[data-goal-percent]', `${Math.min(100, Math.round((weeklyStats.total / Math.max(weeklyStats.goal, 1)) * 100))}%`);
    setStyle('[data-goal-bar]', '--progress', `${Math.min(100, Math.round((weeklyStats.total / Math.max(weeklyStats.goal, 1)) * 100))}%`);
    setHtml('[data-activity-chart]', UI.activityChart(weeklyStats.days, weeklyStats.goal));
    renderList('[data-recent-activity]', TrackerStore.getRecentActivity(4), UI.activityItem);
  }

  function initializeLibrary() {
    libraryState = {
      filter: 'all',
      query: '',
      sort: 'recent'
    };
    const state = libraryState;

    const search = document.querySelector('[data-library-search]');
    const sort = document.querySelector('[data-library-sort]');

    search?.addEventListener('input', () => {
      state.query = search.value.trim().toLocaleLowerCase('es');
      renderLibrary();
    });

    sort?.addEventListener('change', () => {
      state.sort = sort.value;
      renderLibrary();
    });

    document.addEventListener('click', (event) => {
      const filter = event.target.closest('[data-library-filter]');
      if (filter) {
        state.filter = filter.dataset.libraryFilter;
        renderLibrary();
        return;
      }

      if (event.target.closest('[data-reset-library]')) {
        state.filter = 'all';
        state.query = '';
        if (search) search.value = '';
        renderLibrary();
      }
    });
  }

  function renderLibrary() {
    const state = libraryState || {
      filter: 'all',
      query: '',
      sort: 'recent'
    };
    let library = TrackerStore.getLibrary();
    updateSharedStats(library);

    if (state.filter === 'favorites') {
      library = library.filter(({ favorite }) => favorite);
    } else if (state.filter !== 'all') {
      library = library.filter(({ entry }) => entry.status === state.filter);
    }

    if (state.query) {
      library = library.filter(({ novel }) => [
        novel.title,
        novel.author,
        novel.genre,
        ...(novel.tags || [])
      ].some((value) => value.toLocaleLowerCase('es').includes(state.query)));
    }

    if (state.sort === 'title') {
      library.sort((a, b) => a.novel.title.localeCompare(b.novel.title, 'es'));
    } else if (state.sort === 'progress') {
      library.sort((a, b) => b.progress - a.progress);
    } else {
      library = sortByUpdated(library);
    }

    document.querySelectorAll('[data-library-filter]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.libraryFilter === state.filter);
      button.setAttribute('aria-pressed', String(button.dataset.libraryFilter === state.filter));
    });

    setText('[data-library-count]', `${library.length} ${library.length === 1 ? 'novela' : 'novelas'}`);

    const grid = document.querySelector('[data-library-grid]');
    if (!grid) return;
    grid.innerHTML = library.length
      ? UI.novelGrid(library)
      : UI.emptyState({
          iconName: 'search',
          title: 'No encontramos esa lectura',
          message: 'Prueba con otro título, autor o estado de lectura.',
          actionLabel: 'Limpiar filtros',
          action: 'data-reset-library'
        });
  }

  function initializeDetail() {
    // La vista de detalle se identifica mediante el parámetro ?id= de la URL.
  }

  function renderDetail() {
    const root = document.querySelector('[data-detail-view]');
    if (!root) return;

    const params = new URLSearchParams(window.location.search);
    const requestedId = params.get('id');
    const library = TrackerStore.getLibrary();
    updateSharedStats(library);
    const fallbackId = library.find(({ entry }) => entry.status === 'reading')?.novel.id;
    const item = library.find(({ novel }) => novel.id === requestedId)
      || (requestedId ? null : library.find(({ novel }) => novel.id === fallbackId));

    if (!item) {
      root.innerHTML = `
        <div class="breadcrumb"><a href="${UI.pageUrl('library')}">${UI.icon('chevronLeft', 'icon--sm')} Biblioteca</a></div>
        <section class="panel">
          ${UI.emptyState({
            iconName: 'book',
            title: 'No encontramos esa novela',
            message: 'El enlace puede estar incompleto o la lectura ya no está en tu biblioteca.',
            actionLabel: 'Volver a la biblioteca',
            action: `onclick="window.location.href='${UI.pageUrl('library')}'"`
          })}
        </section>
      `;
      return;
    }

    const { novel, entry, progress, pagesRead, favorite } = item;
    const totalPages = novel.totalPages || novel.chapters.reduce((total, chapter) => total + chapter.pages, 0);
    const currentChapter = novel.chapters[entry.currentChapter - 1] || novel.chapters[0];
    const lastRead = entry.lastReadAt ? UI.formatRelativeTime(entry.lastReadAt) : 'Todavía no empezada';

    document.title = `${novel.title} · Tsundoku`;
    setText('[data-detail-breadcrumb-title]', novel.title);
    setText('[data-detail-title]', novel.title);
    setText('[data-detail-author]', novel.author);
    setText('[data-detail-author-stat]', novel.author);
    setText('[data-detail-description]', novel.description);
    setSource('[data-detail-cover]', UI.coverUrl(novel), `Portada de ${novel.title}`);
    setText('[data-detail-genre]', novel.genre);
    setText('[data-detail-status]', UI.statusLabel(entry.status));
    const detailStatus = document.querySelector('[data-detail-status]');
    if (detailStatus) detailStatus.className = `status-pill status-pill--${entry.status}`;
    setText('[data-detail-percent]', `${progress}%`);
    setText('[data-detail-pages]', `${pagesRead} / ${totalPages}`);
    setText('[data-detail-total-pages]', String(totalPages));
    setText('[data-detail-current-chapter]', `Capítulo ${currentChapter.number} · ${currentChapter.title}`);
    setText('[data-detail-last-read]', lastRead);
    setText('[data-detail-page-count]', String(novel.chapters.length));
    setText('[data-detail-chapter-progress]', `${entry.completedChapters.length} de ${novel.chapters.length} capítulos`);
    setText('[data-detail-chapter-progress-stat]', `${entry.completedChapters.length} de ${novel.chapters.length}`);
    setStyle('[data-detail-bar]', '--progress', `${progress}%`);
    document.querySelector('[data-detail-bar]')?.closest('[role="progressbar"]')?.setAttribute('aria-valuenow', String(progress));
    setAttribute('[data-detail-favorite]', 'data-favorite', novel.id);
    setAttribute('[data-detail-favorite]', 'aria-pressed', String(favorite));
    setAttribute('[data-detail-favorite]', 'aria-label', favorite ? 'Quitar de favoritos' : 'Añadir a favoritos');
    setText('[data-detail-favorite] span', favorite ? 'En favoritos' : 'Favorito');
    document.querySelector('[data-detail-favorite]')?.classList.toggle('is-active', favorite);
    setAttribute('[data-mark-current]', 'data-mark-current', novel.id);
    setAttribute('[data-mark-current]', 'data-chapter-id', currentChapter.id);
    setText('[data-mark-current-label]', entry.completedChapters.includes(currentChapter.id) ? 'Capítulo leído' : 'Marcar capítulo como leído');
    setHtml('[data-detail-tags]', (novel.tags || [novel.genre]).map((tag) => `<span class="tag">${UI.escapeHTML(tag)}</span>`).join(''));
    setHtml('[data-chapter-list]', novel.chapters.map((chapter) => UI.chapterRow(chapter, item)).join(''));
  }

  function initializeBrowse() {
    browseState = {
      query: '',
      genre: 'all',
      sort: 'recommended'
    };
    const state = browseState;
    const params = new URLSearchParams(window.location.search);
    const searchInput = document.querySelector('[data-browse-search]');
    state.query = (params.get('q') || '').trim().toLocaleLowerCase('es');
    if (searchInput) searchInput.value = params.get('q') || '';

    searchInput?.addEventListener('input', () => {
      state.query = searchInput.value.trim().toLocaleLowerCase('es');
      renderBrowse();
    });

    document.addEventListener('click', (event) => {
      const genreButton = event.target.closest('[data-browse-genre]');
      if (genreButton) {
        state.genre = genreButton.dataset.browseGenre;
        renderBrowse();
      }
    });

    document.querySelector('[data-browse-form]')?.addEventListener('submit', (event) => {
      event.preventDefault();
      renderBrowse();
    });

    const novelForm = document.querySelector('[data-novel-form]');
    novelForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!novelForm.reportValidity()) return;

      const formData = new FormData(novelForm);
      const cover = String(formData.get('cover'));
      const validCover = NovelData.coverOptions.some(({ cover: option }) => option === cover)
        ? cover
        : NovelData.coverOptions[0].cover;
      const novel = TrackerStore.addNovel({
        title: String(formData.get('title')),
        author: String(formData.get('author')),
        genre: String(formData.get('genre')),
        cover: validCover,
        chapterCount: Number(formData.get('chapterCount')),
        description: String(formData.get('description')),
        status: String(formData.get('status'))
      });

      novelForm.reset();
      closeDialog(document.querySelector('#add-novel-dialog'));
      state.query = '';
      state.genre = 'all';
      if (searchInput) searchInput.value = '';
      renderBrowse();
      UI.toast(`“${novel.title}” se añadió a tu biblioteca.`);
    });
  }

  function renderBrowse() {
    const searchInput = document.querySelector('[data-browse-search]');
    const currentQuery = searchInput?.value || '';
    const state = browseState || { genre: 'all' };
    let library = TrackerStore.getLibrary();
    updateSharedStats(library);

    const query = currentQuery.trim().toLocaleLowerCase('es');
    if (query) {
      library = library.filter(({ novel }) => [
        novel.title,
        novel.author,
        novel.genre,
        ...(novel.tags || [])
      ].some((value) => value.toLocaleLowerCase('es').includes(query)));
    }

    const selectedGenre = state.genre || 'all';
    if (selectedGenre !== 'all') {
      library = library.filter(({ novel }) => novel.genre === selectedGenre);
    }

    if (selectedGenre === 'all' && !query) {
      library.sort((a, b) => Number(Boolean(b.novel.featured)) - Number(Boolean(a.novel.featured)));
    } else {
      library.sort((a, b) => a.novel.title.localeCompare(b.novel.title, 'es'));
    }

    document.querySelectorAll('[data-browse-genre]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.browseGenre === selectedGenre);
      button.setAttribute('aria-pressed', String(button.dataset.browseGenre === selectedGenre));
    });

    setText('[data-browse-count]', `${library.length} ${library.length === 1 ? 'resultado' : 'resultados'}`);
    const grid = document.querySelector('[data-browse-grid]');
    if (!grid) return;
    grid.innerHTML = library.length
      ? UI.novelGrid(library)
      : UI.emptyState({
          iconName: 'search',
          title: 'No hay coincidencias',
          message: 'Puedes buscar otra novela o añadir una lectura a tu biblioteca.',
          actionLabel: 'Añadir una novela',
          action: 'data-open-dialog="add-novel-dialog"'
        });
  }

  function updateSharedStats(library) {
    setText('[data-stat-reading]', library.filter(({ entry }) => entry.status === 'reading').length);
    setText('[data-stat-planned]', library.filter(({ entry }) => entry.status === 'planned').length);
    setText('[data-stat-completed]', library.filter(({ entry }) => entry.status === 'completed').length);
    setText('[data-stat-pages]', library.reduce((total, item) => total + item.pagesRead, 0).toLocaleString('es-ES'));
  }

  function sortByUpdated(items) {
    return [...items].sort((a, b) => {
      const dateA = a.entry.lastReadAt || a.entry.addedAt || 0;
      const dateB = b.entry.lastReadAt || b.entry.addedAt || 0;
      return dateB - dateA;
    });
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value;
    });
  }

  function setHtml(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.innerHTML = value;
  }

  function setHref(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.href = value;
  }

  function setSource(selector, source, alt) {
    const element = document.querySelector(selector);
    if (!element) return;
    element.src = source;
    if (alt) element.alt = alt;
  }

  function setStyle(selector, property, value) {
    const element = document.querySelector(selector);
    if (element) element.style.setProperty(property, value);
  }

  function setAttribute(selector, attribute, value) {
    const element = document.querySelector(selector);
    if (element) element.setAttribute(attribute, value);
  }

  function renderList(selector, items, renderer) {
    const element = document.querySelector(selector);
    if (element) element.innerHTML = items.map(renderer).join('');
  }
})();
