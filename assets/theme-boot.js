/* Resolve saved theme before stylesheets paint to prevent theme flashing. */
(function(){
  try {
    var mode=localStorage.getItem('spinwheeljoy.ui.theme')||'system';
    if(!['light','dark','system'].includes(mode))mode='system';
    var dark=mode==='dark'||(mode==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme=dark?'dark':'light';
    document.documentElement.dataset.themePreference=mode;
  } catch(_) {
    document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
    document.documentElement.dataset.themePreference='system';
  }
})();
