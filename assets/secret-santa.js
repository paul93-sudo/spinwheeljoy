/* Secret Santa Drawer — standalone logic (v1.0)
 * Independent from the spin-wheel app. Uses SpinWheelEngine.secretSantaPairs().
 * Privacy: pairs live ONLY in memory. Never persisted, never displayed in full.
 * Reload or navigation clears the draw automatically.
 */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  var setupPanel = $('santa-setup');
  var drawnPanel = $('santa-drawn');
  var donePanel = $('santa-done');
  var namesInput = $('santa-names');
  var countEl = $('santa-count');
  var errorEl = $('santa-error');
  var drawBtn = $('santa-draw');
  var clearBtn = $('santa-clear-names');
  var picker = $('santa-picker');
  var revealBtn = $('santa-reveal');
  var revealCard = $('santa-reveal-card');
  var giftEl = $('santa-gift');
  var recipientEl = $('santa-recipient');
  var revealLabel = $('santa-reveal-label');
  var hideNextBtn = $('santa-hide-next');
  var progressEl = $('santa-progress');
  var redrawBtn = $('santa-redraw');
  var resetBtn = $('santa-reset');
  var againBtn = $('santa-again');

  // In-memory only. Cleared on reset / redraw / completion / reload.
  var participants = [];   // [{id, label}]
  var pairByGiver = {};    // giverId -> receiverId
  var revealedIds = [];    // giverIds who already revealed (order matters for progress)
  var currentGiverId = null;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
  }
  function clearError() {
    errorEl.textContent = '';
    errorEl.hidden = true;
  }

  function parseNames() {
    var lines = namesInput.value.split(/\r?\n/);
    var seen = {};
    var out = [];
    for (var i = 0; i < lines.length; i++) {
      var label = lines[i].trim().replace(/\s+/g, ' ');
      if (!label) continue;
      if (label.length > 40) label = label.slice(0, 40);
      out.push({ id: 'p' + i + '-' + out.length, label: label, raw: label.toLowerCase() });
    }
    return out;
  }

  function refreshCount() {
    var names = parseNames();
    var n = names.length;
    countEl.textContent = n === 1 ? '1 player' : n + ' players';
    drawBtn.disabled = n < 2;
  }

  function findDuplicates(names) {
    var seen = {};
    var dups = [];
    for (var i = 0; i < names.length; i++) {
      var k = names[i].raw;
      if (seen[k]) { if (dups.indexOf(names[i].label) === -1) dups.push(names[i].label); }
      seen[k] = true;
    }
    return dups;
  }

  function showPanel(which) {
    setupPanel.hidden = which !== 'setup';
    drawnPanel.hidden = which !== 'drawn';
    donePanel.hidden = which !== 'done';
  }

  function labelFor(id) {
    for (var i = 0; i < participants.length; i++) {
      if (participants[i].id === id) return participants[i].label;
    }
    return '';
  }

  function updateProgress() {
    var total = participants.length;
    var done = revealedIds.length;
    progressEl.textContent = done + ' of ' + total + ' revealed';
  }

  function buildPicker() {
    picker.innerHTML = '';
    var placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = '— Select your name —';
    picker.appendChild(placeholder);
    for (var i = 0; i < participants.length; i++) {
      var p = participants[i];
      if (revealedIds.indexOf(p.id) !== -1) continue; // already revealed — skip
      var opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.label;
      picker.appendChild(opt);
    }
    picker.value = '';
    currentGiverId = null;
    revealCard.hidden = true;
  }

  function doDraw() {
    clearError();
    var names = parseNames();
    if (names.length < 2) {
      showError('Add at least 2 players to draw.');
      return;
    }
    var dups = findDuplicates(names);
    if (dups.length) {
      showError('Duplicate names: ' + dups.join(', ') + '. Add a last initial so everyone can tell them apart.');
      return;
    }
    if (!window.SpinWheelEngine || !window.SpinWheelEngine.secretSantaPairs) {
      showError('The draw engine failed to load. Please reload the page.');
      return;
    }
    try {
      participants = names;
      var pairs = window.SpinWheelEngine.secretSantaPairs(names);
      pairByGiver = {};
      for (var i = 0; i < pairs.length; i++) {
        pairByGiver[pairs[i].giverId] = pairs[i].receiverId;
      }
      revealedIds = [];
      buildPicker();
      updateProgress();
      showPanel('drawn');
      // Scroll the draw panel into view (iPhone-friendly)
      drawnPanel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    } catch (e) {
      showError(e && e.message ? e.message : 'Could not complete the draw. Please try again.');
    }
  }

  function doReveal() {
    var giverId = picker.value;
    if (!giverId) {
      showError('Please select your name first.');
      return;
    }
    clearError();
    var receiverId = pairByGiver[giverId];
    if (!receiverId) {
      showError('Something went wrong — please start over.');
      return;
    }
    currentGiverId = giverId;
    revealLabel.textContent = labelFor(giverId) + ', you are buying a gift for…';
    recipientEl.textContent = labelFor(receiverId);
    revealCard.hidden = false;
    // Gift-open effect (skipped animation under Reduce Motion)
    giftEl.textContent = '🎁';
    if (!reduceMotion) {
      giftEl.classList.remove('santa-gift-open');
      // force reflow so the animation restarts
      void giftEl.offsetWidth;
      giftEl.classList.add('santa-gift-open');
      window.setTimeout(function () { giftEl.textContent = '🎉'; }, 650);
    } else {
      giftEl.textContent = '🎉';
    }
    revealCard.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    hideNextBtn.focus();
  }

  function doHideNext() {
    if (currentGiverId && revealedIds.indexOf(currentGiverId) === -1) {
      revealedIds.push(currentGiverId);
    }
    currentGiverId = null;
    // Scrub the visible recipient immediately
    recipientEl.textContent = '';
    revealLabel.textContent = 'You are buying a gift for…';
    giftEl.textContent = '🎁';
    giftEl.classList.remove('santa-gift-open');
    revealCard.hidden = true;

    if (revealedIds.length >= participants.length) {
      finishDraw();
      return;
    }
    buildPicker();
    updateProgress();
    picker.focus();
  }

  function clearSensitive() {
    participants = [];
    pairByGiver = {};
    revealedIds = [];
    currentGiverId = null;
    if (recipientEl) recipientEl.textContent = '';
  }

  function finishDraw() {
    clearSensitive();
    showPanel('done');
    donePanel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  function confirmAction(message) {
    return window.confirm(message);
  }

  // --- Events ---
  namesInput.addEventListener('input', function () { clearError(); refreshCount(); });
  namesInput.addEventListener('paste', function () {
    window.setTimeout(refreshCount, 0); // count after paste lands
  });
  drawBtn.addEventListener('click', doDraw);
  clearBtn.addEventListener('click', function () {
    namesInput.value = '';
    clearError();
    refreshCount();
    namesInput.focus();
  });
  revealBtn.addEventListener('click', doReveal);
  picker.addEventListener('change', function () { clearError(); });
  hideNextBtn.addEventListener('click', doHideNext);

  redrawBtn.addEventListener('click', function () {
    if (confirmAction('Draw again? This creates brand-new pairs and the current ones are discarded.')) {
      doDraw();
    }
  });
  resetBtn.addEventListener('click', function () {
    if (confirmAction('Start over? All names and pairs will be cleared.')) {
      clearSensitive();
      namesInput.value = '';
      refreshCount();
      clearError();
      showPanel('setup');
      namesInput.focus();
    }
  });
  againBtn.addEventListener('click', function () {
    clearSensitive();
    namesInput.value = '';
    refreshCount();
    clearError();
    showPanel('setup');
  });

  // Privacy: warn if leaving mid-draw (pairs live only in memory)
  window.addEventListener('beforeunload', function (e) {
    if (!drawnPanel.hidden && participants.length) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  // Enter in the select reveals (keyboard convenience)
  picker.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && picker.value) { doReveal(); }
  });

  refreshCount();
  showPanel('setup');
})();
