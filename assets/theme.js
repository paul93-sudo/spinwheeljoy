/* SpinWheelJoy v0.9: accessible Light / Dark / System theme, global to all routes.
   No network calls. Preference is stored independently from wheel data. */
(function () {
  'use strict';
  const KEY = 'spinwheeljoy.ui.theme';
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const modes = new Set(['light','dark','system']);
  const getPreference = () => modes.has(root.dataset.themePreference) ? root.dataset.themePreference : 'system';
  function setMode(next) {
    const mode = modes.has(next) ? next : 'system';
    try { window.localStorage.setItem(KEY, mode); } catch (_) {}
    apply(mode);
  }
  function apply(preference) {
    const resolved = preference === 'system' ? (media.matches ? 'dark' : 'light') : preference;
    const changed = root.dataset.theme !== resolved;
    root.dataset.theme = resolved;
    root.dataset.themePreference = preference;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = resolved === 'dark' ? '#0e0b22' : '#f7f9fe';
    document.querySelectorAll('[data-theme-option]').forEach(btn => {
      const selected = btn.dataset.themeOption === preference;
      btn.setAttribute('aria-checked',String(selected));
      btn.classList.toggle('selected',selected);
    });
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      const symbol = document.getElementById('theme-symbol');
      if (symbol) symbol.textContent = resolved === 'dark' ? '☾' : '☼';
      const name = document.getElementById('theme-label');
      if (name) name.textContent = preference === 'system' ? 'Auto' : preference === 'dark' ? 'Dark' : 'Light';
      toggle.title = `Theme: ${preference}. Change appearance`;
    }
    if (changed) window.dispatchEvent(new CustomEvent('swj:themechange', {detail:{theme:resolved, preference}}));
  }
  function init() {
    const button = document.getElementById('theme-toggle');
    const menu = document.getElementById('theme-menu');
    if (!button || !menu) return;
    const close = (restoreFocus) => {
      menu.hidden = true;
      button.setAttribute('aria-expanded','false');
      if (restoreFocus) button.focus();
    };
    button.addEventListener('click', () => {
      const opening = menu.hidden;
      menu.hidden = !opening;
      button.setAttribute('aria-expanded',String(opening));
      if (opening) {
        const current = menu.querySelector(`[data-theme-option="${getPreference()}"]`);
        if (current) current.focus();
      }
    });
    menu.querySelectorAll('[data-theme-option]').forEach(option => option.addEventListener('click', () => {
      setMode(option.dataset.themeOption);
      close(true);
    }));
    document.addEventListener('pointerdown', e => {
      if (!menu.hidden && !e.target.closest('.theme-control')) close(false);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !menu.hidden) { e.preventDefault(); close(true); }
    });
    apply(getPreference());
  }
  media.addEventListener?.('change', () => { if (getPreference() === 'system') apply('system'); });
  window.SpinWheelTheme = {setMode, getMode:getPreference, getResolved:()=>root.dataset.theme};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
