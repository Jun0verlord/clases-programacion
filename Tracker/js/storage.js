'use strict';

/**
 * Capa de persistencia. Todo el estado editable de la aplicación vive en
 * localStorage y se puede volver a crear desde NovelData si no existe.
 */

const TrackerStore = (() => {
  const STORAGE_KEY = 'novel-tracker:state:v1';
  const THEME_KEY = 'tsundoku-theme';
  const stateEvent = 'novel-tracker:change';
  let cachedState = null;

  function dateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function daysAgo(numberOfDays) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - numberOfDays);
    return dateKey(date);
  }

  function hoursAgo(numberOfHours) {
    return Date.now() - numberOfHours * 60 * 60 * 1000;
  }

  function makeEntry(novel) {
    const { seed } = novel;
    const completedCount = Math.min(
      novel.chapters.length,
      Math.round((seed.progress / 100) * novel.chapters.length)
    );

    return {
      status: seed.status,
      currentChapter: Math.min(completedCount + 1, novel.chapters.length),
      completedChapters: novel.chapters
        .slice(0, completedCount)
        .map(({ id }) => id),
      lastReadAt: seed.lastReadHoursAgo === null
        ? null
        : hoursAgo(seed.lastReadHoursAgo),
      addedAt: hoursAgo(seed.addedDaysAgo * 24),
      updatedAt: seed.lastReadHoursAgo === null
        ? hoursAgo(seed.addedDaysAgo * 24)
        : hoursAgo(seed.lastReadHoursAgo)
    };
  }

  function createInitialState() {
    const novelEntries = {};
    const activity = [];

    NovelData.novels.forEach((novel) => {
      const entry = makeEntry(novel);
      novelEntries[novel.id] = entry;

      if (entry.lastReadAt !== null) {
        const chapter = novel.chapters[Math.max(0, entry.currentChapter - 2)];
        activity.push({
          id: `activity-${novel.id}-seed`,
          novelId: novel.id,
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          timestamp: entry.lastReadAt,
          pages: chapter.pages
        });
      }
    });

    return {
      version: 1,
      novels: novelEntries,
      favorites: NovelData.novels
        .filter(({ seed }) => seed.isFavorite)
        .map(({ id }) => id),
      activity: activity.sort((a, b) => b.timestamp - a.timestamp),
      readingLog: [
        { date: daysAgo(6), pages: 22 },
        { date: daysAgo(5), pages: 0 },
        { date: daysAgo(4), pages: 18 },
        { date: daysAgo(3), pages: 34 },
        { date: daysAgo(2), pages: 28 },
        { date: daysAgo(1), pages: 0 },
        { date: daysAgo(0), pages: 16 }
      ],
      weeklyGoal: 180,
      installedSources: NovelData.getInstalledSources().map(({ id }) => id),
      customNovels: []
    };
  }

  function normalizeState(parsedState) {
    const base = createInitialState();
    if (!parsedState || typeof parsedState !== 'object') return base;

    return {
      ...base,
      ...parsedState,
      novels: {
        ...base.novels,
        ...(parsedState.novels || {})
      },
      favorites: Array.isArray(parsedState.favorites)
        ? [...new Set(parsedState.favorites)]
        : base.favorites,
      activity: Array.isArray(parsedState.activity)
        ? parsedState.activity
        : base.activity,
      readingLog: Array.isArray(parsedState.readingLog)
        ? parsedState.readingLog
        : base.readingLog,
      installedSources: Array.isArray(parsedState.installedSources)
        ? [...new Set(parsedState.installedSources)]
        : base.installedSources,
      customNovels: Array.isArray(parsedState.customNovels)
        ? parsedState.customNovels
        : []
    };
  }

  function loadState() {
    if (cachedState) return cachedState;

    try {
      const rawState = window.localStorage.getItem(STORAGE_KEY);
      cachedState = rawState
        ? normalizeState(JSON.parse(rawState))
        : createInitialState();
    } catch (error) {
      console.warn('No se pudo leer el progreso guardado. Se usarán los datos iniciales.', error);
      cachedState = createInitialState();
    }

    persistState();
    return cachedState;
  }

  function persistState() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedState));
    } catch (error) {
      console.warn('No se pudo guardar el progreso en localStorage.', error);
    }
  }

  function commit() {
    persistState();
    window.dispatchEvent(new CustomEvent(stateEvent, { detail: cachedState }));
  }

  function notifyStateChange() {
    window.dispatchEvent(new CustomEvent(stateEvent, { detail: cachedState }));
  }

  function getNovel(id) {
    const state = loadState();
    return NovelData.getById(id)
      || state.customNovels.find((novel) => novel.id === id)
      || null;
  }

  function getEntry(novelId) {
    const state = loadState();
    return state.novels[novelId] || null;
  }

  function getProgress(novelOrId, entry) {
    const novel = typeof novelOrId === 'string' ? getNovel(novelOrId) : novelOrId;
    const chapterEntry = entry || (novel ? getEntry(novel.id) : null);
    if (!novel || !chapterEntry) return 0;

    return Math.round(
      (chapterEntry.completedChapters.length / novel.chapters.length) * 100
    );
  }

  function getPagesRead(novelOrId, entry) {
    const novel = typeof novelOrId === 'string' ? getNovel(novelOrId) : novelOrId;
    const chapterEntry = entry || (novel ? getEntry(novel.id) : null);
    if (!novel || !chapterEntry) return 0;

    const completed = new Set(chapterEntry.completedChapters);
    return novel.chapters.reduce(
      (total, chapter) => total + (completed.has(chapter.id) ? chapter.pages : 0),
      0
    );
  }

  function getCurrentPage(novelOrId, entry) {
    const novel = typeof novelOrId === 'string' ? getNovel(novelOrId) : novelOrId;
    const chapterEntry = entry || (novel ? getEntry(novel.id) : null);
    if (!novel || !chapterEntry) return 0;
    return getPagesRead(novel, chapterEntry);
  }

  function getLibrary() {
    const state = loadState();
    const allNovels = [...NovelData.novels, ...state.customNovels];

    return allNovels
      .map((novel) => {
        const entry = state.novels[novel.id];
        if (!entry) return null;
        return {
          novel,
          entry,
          progress: getProgress(novel, entry),
          pagesRead: getPagesRead(novel, entry),
          favorite: state.favorites.includes(novel.id),
          updatedAt: entry.updatedAt || entry.addedAt
        };
      })
      .filter(Boolean);
  }

  function updateEntry(novelId, updates) {
    const state = loadState();
    const current = state.novels[novelId];
    if (!current) return null;

    state.novels[novelId] = {
      ...current,
      ...updates,
      updatedAt: Date.now()
    };
    commit();
    return state.novels[novelId];
  }

  function toggleFavorite(novelId) {
    const state = loadState();
    const isFavorite = state.favorites.includes(novelId);
    state.favorites = isFavorite
      ? state.favorites.filter((id) => id !== novelId)
      : [...state.favorites, novelId];
    commit();
    return !isFavorite;
  }

  function setStatus(novelId, status) {
    const novel = getNovel(novelId);
    if (!novel || !['reading', 'planned', 'paused', 'completed'].includes(status)) return;

    const current = getEntry(novelId);
    const allChapterIds = novel.chapters.map(({ id }) => id);
    const updates = { status };

    if (status === 'completed') {
      updates.completedChapters = allChapterIds;
      updates.currentChapter = novel.chapters.length;
    } else if (status === 'planned') {
      updates.completedChapters = [];
      updates.currentChapter = 1;
      updates.lastReadAt = null;
    } else if (status === 'reading' && current.status === 'completed') {
      updates.completedChapters = [];
      updates.currentChapter = 1;
      updates.lastReadAt = Date.now();
    } else if (status === 'reading' && current.lastReadAt === null) {
      updates.lastReadAt = Date.now();
    }

    updateEntry(novelId, updates);
  }

  function startReading(novelId, chapterId) {
    const novel = getNovel(novelId);
    if (!novel) return null;
    const chapter = novel.chapters.find(({ id }) => id === chapterId)
      || novel.chapters[Math.max(0, getEntry(novelId).currentChapter - 1)];

    return updateEntry(novelId, {
      currentChapter: chapter.number,
      lastReadAt: Date.now(),
      status: 'reading'
    });
  }

  function addReadingPages(novelId, pages, chapterTitle) {
    const state = loadState();
    const today = dateKey();
    const existingLog = state.readingLog.find((item) => item.date === today);

    if (existingLog) {
      existingLog.pages += pages;
    } else {
      state.readingLog.push({ date: today, pages });
    }

    state.readingLog = state.readingLog.slice(-60);
    recordActivity(novelId, chapterTitle, pages);
  }

  function recordActivity(novelId, chapterTitle, pages = 0) {
    const state = loadState();
    state.activity.unshift({
      id: `activity-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      novelId,
      chapterTitle,
      timestamp: Date.now(),
      pages
    });
    state.activity = state.activity.slice(0, 30);
  }

  function toggleChapter(novelId, chapterId) {
    const novel = getNovel(novelId);
    const current = getEntry(novelId);
    if (!novel || !current) return;

    const chapter = novel.chapters.find(({ id }) => id === chapterId);
    if (!chapter) return;

    const completed = new Set(current.completedChapters);
    const isCompleted = completed.has(chapterId);

    if (isCompleted) {
      completed.delete(chapterId);
    } else {
      completed.add(chapterId);
      addReadingPages(novelId, chapter.pages, chapter.title);
    }

    const completedInOrder = novel.chapters
      .filter(({ id }) => completed.has(id))
      .map(({ id }) => id);
    const nextUnreadChapter = novel.chapters.find(({ id }) => !completed.has(id));
    const nextChapter = isCompleted
      ? nextUnreadChapter?.number || chapter.number
      : Math.min(chapter.number + 1, novel.chapters.length);
    const nextStatus = completedInOrder.length === novel.chapters.length
      ? 'completed'
      : 'reading';

    updateEntry(novelId, {
      completedChapters: completedInOrder,
      currentChapter: nextChapter,
      lastReadAt: Date.now(),
      status: nextStatus
    });
  }

  function getRecentActivity(limit = 4) {
    const state = loadState();
    return state.activity
      .map((item) => ({ ...item, novel: getNovel(item.novelId) }))
      .filter((item) => item.novel)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  function getWeeklyStats() {
    const state = loadState();
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      const key = dateKey(date);
      const pages = state.readingLog
        .filter((item) => item.date === key)
        .reduce((total, item) => total + item.pages, 0);

      return {
        date,
        key,
        pages,
        label: new Intl.DateTimeFormat('es-ES', { weekday: 'short' })
          .format(date)
          .replace('.', '')
      };
    });

    return {
      days,
      total: days.reduce((total, day) => total + day.pages, 0),
      goal: state.weeklyGoal
    };
  }

  function addNovel(payload) {
    const state = loadState();
    const baseId = payload.title
      .toLocaleLowerCase('es')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'mi-novela';
    const id = `${baseId}-${Date.now().toString(36)}`;
    const chapterCount = Math.max(1, Number(payload.chapterCount) || 1);
    const chapters = Array.from({ length: chapterCount }, (_, index) => ({
      id: `c${index + 1}`,
      number: index + 1,
      title: `Capítulo ${index + 1}`,
      pages: 12
    }));
    const novel = {
      id,
      title: payload.title.trim(),
      author: payload.author.trim() || 'Autor desconocido',
      genre: payload.genre,
      tags: [payload.genre],
      cover: payload.cover,
      description: payload.description.trim() || 'Una nueva lectura esperando en tu biblioteca.',
      featured: false,
      custom: true,
      chapters
    };

    state.customNovels.push(novel);
    state.novels[id] = {
      status: payload.status || 'planned',
      currentChapter: 1,
      completedChapters: [],
      lastReadAt: null,
      addedAt: Date.now(),
      updatedAt: Date.now()
    };

    recordActivity(id, 'Añadida a tu biblioteca', 0);
    commit();
    return novel;
  }

  function getInstalledSourceIds() {
    const state = loadState();
    return state.installedSources.filter((id) => NovelData.getSourceById(id));
  }

  function installSource(id) {
    const state = loadState();
    if (!NovelData.getSourceById(id) || state.installedSources.includes(id)) return false;
    state.installedSources.push(id);
    commit();
    return true;
  }

  function setWeeklyGoal(goal) {
    const state = loadState();
    const parsedGoal = Number(goal);
    if (!Number.isFinite(parsedGoal) || parsedGoal < 0) return;
    state.weeklyGoal = Math.round(parsedGoal);
    commit();
  }

  function reset() {
    cachedState = createInitialState();
    commit();
  }

  function subscribe(listener) {
    window.addEventListener(stateEvent, listener);
    return () => window.removeEventListener(stateEvent, listener);
  }

  function setTheme(theme) {
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.warn('No se pudo guardar la preferencia de tema.', error);
    }
  }

  loadState();

  return {
    THEME_KEY,
    getState: loadState,
    getNovel,
    getEntry,
    getLibrary,
    getProgress,
    getPagesRead,
    getCurrentPage,
    getRecentActivity,
    getWeeklyStats,
    updateEntry,
    toggleFavorite,
    setStatus,
    startReading,
    toggleChapter,
    addNovel,
    getInstalledSourceIds,
    installSource,
    setWeeklyGoal,
    reset,
    subscribe,
    setTheme
  };
})();

window.TrackerStore = TrackerStore;
