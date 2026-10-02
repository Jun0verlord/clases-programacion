'use strict';

/** Barra lateral colapsable con navegación SPA. */

(function initSidebar() {
  const SIDEBAR_KEY = 'tsundoku-sidebar-collapsed';

  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  }

  ready(() => {
    initializeSidebar();
  });

  function initializeSidebar() {
    const sidebar = document.querySelector('[data-sidebar]');
    if (!sidebar) return;

    const toggleButton = document.querySelector('[data-sidebar-toggle]');
    const overlay = document.querySelector('[data-sidebar-overlay]');
    const mainContent = document.querySelector('[data-main-content]');

    // Cargar estado guardado
    const isCollapsed = localStorage.getItem(SIDEBAR_KEY) === 'true';
    sidebar.classList.toggle('is-collapsed', isCollapsed);
    mainContent?.classList.toggle('is-sidebar-collapsed', isCollapsed);
    updateToggleButton(toggleButton, isCollapsed);

    // Evento del botón toggle
    toggleButton?.addEventListener('click', () => {
      const newState = !sidebar.classList.contains('is-collapsed');
      sidebar.classList.toggle('is-collapsed', newState);
      mainContent?.classList.toggle('is-sidebar-collapsed', newState);
      localStorage.setItem(SIDEBAR_KEY, String(newState));
      updateToggleButton(toggleButton, newState);
    });

    // Cerrar en móvil al hacer clic en el overlay
    overlay?.addEventListener('click', () => {
      sidebar.classList.remove('is-open');
      overlay.classList.remove('is-visible');
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        sidebar.classList.remove('is-open');
        overlay?.classList.remove('is-visible');
      }
    });

    // Navegación SPA
    initializeNavigation(sidebar);
  }

  function updateToggleButton(button, isCollapsed) {
    if (!button) return;
    button.setAttribute('aria-expanded', String(!isCollapsed));
    button.setAttribute('aria-label', isCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral');
  }

  function initializeNavigation(sidebar) {
    const navItems = sidebar.querySelectorAll('[data-nav-item]');

    navItems.forEach((item) => {
      item.addEventListener('click', (event) => {
        const view = item.dataset.navItem;
        const href = item.getAttribute('href');

        // Actualizar estado activo
        navItems.forEach((nav) => nav.classList.remove('is-active'));
        item.classList.add('is-active');

        // Cerrar en móvil
        sidebar.classList.remove('is-open');
        document.querySelector('[data-sidebar-overlay]')?.classList.remove('is-visible');

        // Si no hay href, prevenir navegación
        if (!href) {
          event.preventDefault();
          return;
        }

        // Verificar si es una vista interna (hash) o una página diferente
        const isHashOnly = href.startsWith('#');
        const isSamePage = isHashOnly || href === window.location.pathname;

        if (isSamePage) {
          // Vista interna - prevenir navegación y disparar evento
          event.preventDefault();
          window.dispatchEvent(new CustomEvent('tsundoku:navigate', { detail: { view } }));
        } else {
          // Página diferente - permitir navegación normal
          // No llamamos a preventDefault(), el navegador navegará normalmente
        }
      });
    });
  }
})();
