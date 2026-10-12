/* SpinWheelJoy application MVP. No external services or third-party dependencies. */
(function () {
  'use strict';
  const E = window.SpinWheelEngine;
  if (!E) throw new Error('SpinWheel engine was not loaded');
  const page = document.body.dataset.tool || 'home';
  const root = document.body.dataset.root || './';
  const appNode = document.querySelector('#wheel-app');
  const storagePrefix = 'spinwheeljoy.v1.';
  const defaultLabels = {
    home: ['Alex','Jamie','Taylor','Morgan','Casey','Sam'],
    names: ['Alex','Jamie','Taylor','Morgan','Casey','Sam'],
    yesno: ['Yes','No'],
    numbers: ['1','2','3','4','5','6','7','8','9','10','11','12'],
    students: ['Avery','Jordan','Harper','Taylor','Charlie','Quinn','Riley','Skyler'],
    teams: ['Alex','Jamie','Taylor','Morgan','Casey','Sam','Avery','Jordan'],
    colors: ['Red','Orange','Yellow','Green','Blue','Purple'],
    prize: ['Mystery gift','Free drink','Bonus point','Pick again','Golden ticket','Lucky star'],
    decision: ['Go outside','Movie night','Read a book','Board game','Bake cookies','Take a walk'],
    truthdare: ['Tell a funny story','Do a silly dance','Describe a dream trip','Act like a cat','Share a fun fact','Sing a verse'],
    wouldrather: ['Fly or be invisible?','Beach or mountains?','Read minds or teleport?','Pizza or pasta?','Travel through time?','Cats or dogs?'],
    rewards: ['Extra art time','Pick a class song','Choose a game','Read with a friend','Sticker','Choose a seat'],
    dinner: ['Sushi','Tacos','Pasta','Pizza','Stir-fry','Salad'],
    chores: ['Set the table','Tidy the desk','Water plants','Fold laundry','Sweep floor','Feed pets'],
    dates: ['Picnic','Cook together','Museum','Sunset walk','Board-game night','Cafe visit'],
    challenges: ['Tell a joke','10 jumping jacks','Draw with eyes closed','Sing a chorus','Mime an animal','Compliment someone']
  };
  const presets = {
    names: {label:'Names',items:['Alex','Jamie','Taylor','Morgan','Casey','Sam']},
    yesno: {label:'Yes / No',items:['Yes','No']},
    numbers: {label:'Numbers',items:Array.from({length:12}, (_,i)=>String(i+1))},
    colors: {label:'Colors',items:['Red','Orange','Yellow','Green','Blue','Purple']},
    icebreakers: {label:'Icebreakers',items:['Dream destination?','Favorite snack?','A hidden talent?','Morning or night?','Best weekend?','Favorite movie?','A fun fact?','Your superpower?']},
    dinner: {label:'Dinner ideas',items:['Tacos','Pasta','Sushi','Pizza','Stir fry','Burgers','Salad','Noodles']},
    weekend: {label:'Weekend plans',items:['Go hiking','Visit a museum','Movie night','Try a new cafe','Board games','Go to the beach','Read a book','Cook together']},
    challenges: {label:'Fun challenges',items:['Tell a joke','Dance for 10 seconds','Act out a movie','Name 5 animals','Sing a chorus','Do 10 jumping jacks']},
    prize: {label:'Prizes',items:defaultLabels.prize},
    truthdare: {label:'Truth or Dare',items:defaultLabels.truthdare},
    wouldrather: {label:'Would You Rather',items:defaultLabels.wouldrather},
    rewards: {label:'Rewards',items:defaultLabels.rewards},
    decision: {label:'Decisions',items:defaultLabels.decision},
    chores: {label:'Chores',items:defaultLabels.chores},
    dates: {label:'Date ideas',items:defaultLabels.dates}
  };
  const palette = ['#fac56b','#fb8581','#ac9be9','#66c4ae','#78a6ee','#f4a77a','#8dc9b0','#f9d984','#b1c1f5','#eaa3ce'];
  const icons = {
    play: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    edit: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20h9M16 4l4 4L9 19l-4 1 1-4z"/></svg>',
    save: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h13l3 3v13H4zM8 4v6h8V4M8 20v-7h8v7"/></svg>',
    share: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.7 10.7 15.4 6.4M8.7 13.3l6.7 4.3"/></svg>',
    spark: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/></svg>',
    history: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 11a9 9 0 1 1 2.8 6.5M3 4v7h7M12 7v5l3 2"/></svg>',
    check: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" aria-hidden="true"><path d="m4 12 5 5L20 6"/></svg>',
    shuffle: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h4l12 16M16 20h4v-4M20 4h-4v4M4 20h4L20 4"/></svg>',
    reset: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 11a9 9 0 1 1 2.8 6.5M3 4v7h7"/></svg>'
  };

  const q = (selector, base=document) => base.querySelector(selector);
  const qa = (selector, base=document) => Array.from(base.querySelectorAll(selector));
  const esc = (text) => String(text).replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const textToEntries = (value, previous) => E.entriesFromText(value, previous);
  const makeItems = (labels) => textToEntries(labels.join('\n'));
  const safeRead = (key, fallback) => { try {const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback;} catch (_) {return fallback;} };
  const safeWrite = (key, obj) => { try { localStorage.setItem(key, JSON.stringify(obj)); return true; } catch (_) {return false;} };
  const clone = (v) => JSON.parse(JSON.stringify(v));
  let toastTimer = null;
  function toast(message) {
    const el = q('#toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 3600);
  }
  async function copyText(value) {
    try { await navigator.clipboard.writeText(value); toast('Copied to clipboard.'); return; } catch (_) {}
    const input = document.createElement('textarea');
    input.value = value;input.style.position='fixed';input.style.opacity='0';document.body.append(input);input.select();
    try { document.execCommand('copy'); toast('Copied to clipboard.'); }
    catch (_) { toast('Copy is unavailable in this browser.'); }
    input.remove();
  }
  function downloadJson(filename, data) {
    const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();
    setTimeout(() => URL.revokeObjectURL(url),1000);
  }
  function appDefaultState() {
    return {version:1,tool:page,name:'My Wheel',entries:makeItems(defaultLabels[page] || defaultLabels.home),elimination:false,removedIds:[],history:[],sound:true,teamCount:2,groups:[],numberMin:1,numberMax:12,numberStep:1};
  }
  function normalizeState(candidate) {
    const state = appDefaultState();
    if (!candidate || typeof candidate !== 'object' || !E.validateEntries(candidate.entries)) return state;
    state.entries=clone(candidate.entries);
    if(typeof candidate.tool==='string' && Object.hasOwn(defaultLabels,candidate.tool))state.tool=candidate.tool;
    state.name=typeof candidate.name==='string'?candidate.name.slice(0,80):state.name;
    state.elimination=!!candidate.elimination;
    const validIds = new Set(state.entries.map(x=>x.id));
    state.removedIds=Array.isArray(candidate.removedIds)?candidate.removedIds.filter(x=>validIds.has(x)).slice(0,60):[];
    state.history=Array.isArray(candidate.history)?candidate.history.filter(x=>x&&typeof x.label==='string'&&typeof x.id==='string').slice(0,80).map(x=>({id:x.id,label:x.label.slice(0,72),removed:!!x.removed,when:Number(x.when)||Date.now()})):[];
    state.sound=!!candidate.sound;
    state.teamCount=Number.isInteger(candidate.teamCount)?Math.max(2,Math.min(16,candidate.teamCount)):2;
    if (Array.isArray(candidate.groups) && candidate.groups.length<=16) state.groups=candidate.groups.map(x=>Array.isArray(x)?x.slice(0,60).map(v=>String(v).slice(0,72)):[]);
    ['numberMin','numberMax','numberStep'].forEach(k=>{if(Number.isSafeInteger(candidate[k]))state[k]=candidate[k];});
    return state;
  }
  // Separate persisted presentation preferences: no personal lists are transmitted.
  const experience=window.SpinWheelExperience;
  const defaults={sound:true,volume:0.37,celebration:true,fun:false,ambient:true};
  const loadedSettings=safeRead(storagePrefix+'effects',{});
  const effectSettings={...defaults,...Object.fromEntries(Object.entries(loadedSettings||{}).filter(([k])=>Object.hasOwn(defaults,k)))};
  if(experience)experience.configure(()=>effectSettings);
  let state = normalizeState(safeRead(storagePrefix+'working.'+page,null));
  let spinning = false;
  let latestWinner = state.history[0] || null;
  let wheelRotation=0;
  let ambientFrame=0, ambientLast=0, wheelVisible=true;
  const reducedMotion=()=>Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  function ambientShouldRun(){return page!=='teams' && !spinning && wheelVisible && !document.hidden && !reducedMotion() && !!effectSettings.ambient && !!q('#wheel-canvas');}
  function stopAmbient(){if(ambientFrame) cancelAnimationFrame(ambientFrame); ambientFrame=0;ambientLast=0;}
  function ambientStep(timestamp){
    if(!ambientShouldRun()){stopAmbient();return;}
    if(!ambientLast) ambientLast=timestamp;
    const dt=Math.min(45,Math.max(0,timestamp-ambientLast));ambientLast=timestamp;
    wheelRotation=(wheelRotation+dt*0.0055)%360; // one slow lap about every 65 seconds
    const canvas=q('#wheel-canvas');if(canvas){canvas.style.transition='none';canvas.style.transform=`rotate(${wheelRotation}deg)`;}
    ambientFrame=requestAnimationFrame(ambientStep);
  }
  function startAmbient(){if(!ambientFrame&&ambientShouldRun()){ambientLast=0;ambientFrame=requestAnimationFrame(ambientStep);}}
  function toggleEffect(key,value){
    effectSettings[key]=key==='volume'?Math.max(0,Math.min(1,Number(value))):!!value;
    safeWrite(storagePrefix+'effects',effectSettings);
    qa('[data-effect]').forEach(el=>{if(el.dataset.effect===key){if(el.type==='checkbox')el.checked=!!effectSettings[key];else if(el.type==='range')el.value=String(effectSettings[key]);}});
    const sound=q('#quick-sound'); if(sound){sound.textContent=effectSettings.sound?'🔊 Sound on':'🔇 Sound off';sound.setAttribute('aria-pressed',String(effectSettings.sound));}
    const vol=q('#volume-value');if(vol)vol.textContent=Math.round(effectSettings.volume*100)+'%';
    if(key==='ambient') {if(effectSettings.ambient)startAmbient();else stopAmbient();}
    if(key==='sound'&&effectSettings.sound&&experience)experience.prepareAudio();
  }

  let renderedIds='';
  let lastFocusedEditorButton=null;
  let activeTooltip=null;
  let editorInvalid=false;
  const urlSearch = new URLSearchParams(location.search);
  const presetKey = urlSearch.get('preset');
  if (presetKey && presets[presetKey] && page === 'home') {
    state.entries=makeItems(presets[presetKey].items);
    state.name=presets[presetKey].label;
    state.history=[];state.removedIds=[];
    latestWinner=null;
  }

  // Safe Wheel: regular spins never replace the master list of choices.
  // Recovery checkpoints are local and deliberately separate from working autosave and named wheels.
  const recoveryKey = storagePrefix+'recovery';
  const MAX_RECOVERY = 18;
  const recoverySignature = (candidate) => JSON.stringify({tool:candidate.tool,entries:(candidate.entries||[]).map(item=>item.label)});
  function recoveryRecords(){
    const list=safeRead(recoveryKey,[]);
    return Array.isArray(list)?list.filter(item=>item&&item.data&&E.validateEntries(item.data.entries)).slice(0,MAX_RECOVERY):[];
  }
  function checkpoint(reason, candidate=state) {
    if(!candidate || !E.validateEntries(candidate.entries) || !candidate.entries.length)return false;
    const copy=normalizeState(candidate);
    const signature=recoverySignature(copy);
    const list=recoveryRecords().filter(x=>recoverySignature(x.data)!==signature);
    list.unshift({id:E.randomId(),tool:copy.tool,name:copy.name || 'My Wheel',reason,when:Date.now(),data:clone(copy)});
    return safeWrite(recoveryKey,list.slice(0,MAX_RECOVERY));
  }
  let storageWarned=false;
  function persist() {
    const saved=safeWrite(storagePrefix+'working.'+page,{...state,groups:state.groups.slice(0,16)});
    const status=q('#autosave-status');
    if(status)status.textContent=saved?'Auto-saved on this device':'Not saved: export a backup';
    if(!saved&&!storageWarned){storageWarned=true;toast('Auto-save is blocked. Export your wheel as a JSON backup.');}
    return saved;
  }
  let editorCheckpointTimer=0;
  function captureEditChange() {
    // Save the original stable list once per editing burst, not after each keystroke.
    if(!editorCheckpointTimer)checkpoint('Before editing choices');
    clearTimeout(editorCheckpointTimer);
    editorCheckpointTimer=setTimeout(()=>{checkpoint('Edited choices');editorCheckpointTimer=0;},1800);
  }
  function beforeReplacingChoices(reason) {
    clearTimeout(editorCheckpointTimer);editorCheckpointTimer=0;
    checkpoint(reason);
  }
  const routes={home:'',names:'tools/random-name-picker/',yesno:'tools/yes-or-no-wheel/',numbers:'tools/number-wheel/',students:'tools/student-picker/',teams:'tools/team-generator/',colors:'tools/color-wheel/',prize:'tools/prize-wheel/',decision:'tools/decision-wheel/',truthdare:'tools/truth-or-dare-wheel/',wouldrather:'tools/would-you-rather-wheel/',rewards:'tools/classroom-reward-wheel/',dinner:'tools/what-to-eat-wheel/',chores:'tools/chore-wheel/',dates:'tools/date-idea-wheel/',challenges:'tools/random-challenge-wheel/'};
  function loadAcrossTool(candidate,tool){
    if(tool===page)return false;
    // Copy through sessionStorage to the destination route without embedding private names in the URL.
    try{sessionStorage.setItem(storagePrefix+'handoff',JSON.stringify(candidate));}catch(_){toast('Could not transfer this wheel. Use Export / Import JSON.');return false;}
    location.href=root+(routes[tool]||'')+'?load=1';
    return true;
  }
  function getSaved() {const records=safeRead(storagePrefix+'saved',[]); return Array.isArray(records)?records.slice(0,100):[];}
  function setSaved(records) {return safeWrite(storagePrefix+'saved',records.slice(0,100));}

  function studioMarkup() {
    const isTeam = page === 'teams';
    return `<div class="studio" id="studio">
       <div class="studio-topbar"><div class="topbar-left"><i class="live-dot" aria-hidden="true"></i><span>${isTeam?'Team workspace':'Your wheel workspace'}</span></div><div class="topbar-right"><span class="pill" id="choice-counter">${state.entries.length} choices</span><button class="recovery-quick" type="button" id="top-recovery" title="Restore a previous wheel">↶ Restore</button></div></div>
       <div class="studio-grid">
        <div class="wheel-side" id="wheel-panel">
         <div class="wheel-title"><span class="pill">${isTeam?'Random groups':'Ready to spin'}</span><span class="pill" id="mode-summary">${state.elimination?'No repeats':'Fair pick'}</span><button class="quick-sound" id="quick-sound" type="button" aria-pressed="${effectSettings.sound}">${effectSettings.sound?'🔊 Sound on':'🔇 Sound off'}</button></div>
         ${isTeam?teamStageMarkup():wheelStageMarkup()}
         <div class="wheel-actions">
           <button class="primary-btn spin-btn" id="spin-main" type="button">${icons.play}<span>${isTeam?'Generate teams':'Spin the wheel'}</span></button>
           <button class="secondary-btn mobile-edit-btn" id="mobile-edit" type="button" aria-haspopup="dialog" aria-controls="editor-panel">${icons.edit}<span>Edit</span></button>
         </div>
         <p class="helper-text" id="wheel-helper">${isTeam?'Random, balanced groups with one click.':'Spinning never deletes your original choices.'}</p><p class="autosave-line"><span class="safe-dot" aria-hidden="true"></span><span id="autosave-status">Auto-saved on this device</span> · <button type="button" class="inline-restore" id="restore-wheel">Restore earlier wheel</button></p>
         <div class="result-banner" id="result-banner" role="status" aria-live="polite" aria-atomic="true"><span class="result-icon">${icons.spark}</span><div class="result-message" id="result-text">${isTeam?'Add people, choose the number of teams, then generate.':'Ready when you are. Give it a spin!'}</div></div>
         <div class="result-buttons"><button type="button" class="text-btn" id="remove-winner" hidden>Remove winner</button><button type="button" class="text-btn" id="undo-result" ${state.history.length?'':'disabled'}>Undo last</button><button type="button" class="text-btn" id="reset-round">Reset round</button></div>
        </div>
        <aside class="editor-side" id="editor-panel" aria-label="Edit choices">
          <div class="editor-header"><h2>${isTeam?'People to group':'Make it your wheel'}</h2><button type="button" class="editor-close" id="editor-close" aria-label="Close choices editor">&times;</button></div>
          <p class="editor-description">${isTeam?'One person per line. Each person goes into exactly one team.':'Add one item per line. The wheel updates automatically.'}</p>
          ${isTeam?'':presetMarkup()}
          <label class="control-label" for="choices-input"><span>${isTeam?'Participants':'Your choices'}</span><span id="editor-count">${state.entries.length} items</span></label>
          ${page==='numbers'?numberMarkup():''}
          <textarea class="input-area" id="choices-input" spellcheck="false" autocomplete="off" maxlength="6000" placeholder="One choice per line"></textarea>
          <p class="help-line" id="input-help">Up to 60 choices. Blank lines are ignored. Names are private on this device.</p>
          <div class="editor-quick-actions"><button class="secondary-btn" id="shuffle-choices" type="button">${icons.shuffle} Shuffle</button><button class="secondary-btn" id="clear-choices" type="button">Clear all</button><button class="secondary-btn" id="import-choices" type="button">Import JSON</button><button class="secondary-btn" id="export-backup" type="button">↓ Export backup</button><button class="secondary-btn" id="recover-choices" type="button">↶ Restore earlier</button><input id="import-file" type="file" accept="application/json,.json" hidden></div>
          ${isTeam?teamCountMarkup():`<div class="toggle-row"><label for="no-repeat">No repeat picks <small>Remove chosen items from the next spin.</small></label><input type="checkbox" class="switch" id="no-repeat" ${state.elimination?'checked':''} aria-label="Enable no repeat picks"></div>`}
          ${isTeam?'':effectControlsMarkup()}
          <div class="editor-footer"><button type="button" class="primary-btn" id="save-wheel">${icons.save} Save</button><button type="button" class="secondary-btn" id="share-wheel">${icons.share} Share safely</button></div>
        </aside>
       </div>
      </div>
      <div class="sheet-backdrop" id="sheet-backdrop"></div>
      <div class="recent-strip" id="recent-strip"><div class="recent-strip-left"><span class="icon-frame">${icons.history}</span><div><b id="recent-title">${state.history.length?'Your latest result':'Make your first pick'}</b><p id="recent-detail">${state.history.length?esc(state.history[0].label):'Saved here as you spin.'}</p></div></div><button class="secondary-btn" type="button" id="view-history">${icons.history} View history</button></div>`;
  }
  function wheelStageMarkup() {
    return `<div class="wheel-stage" aria-label="Colorful spinning wheel"><canvas class="wheel-disc" id="wheel-canvas" width="700" height="700" role="img" aria-label="Wheel graphic. Choices are listed in the editor."></canvas><div class="wheel-pointer" aria-hidden="true"><svg viewBox="0 0 32 42"><path d="M16 40 1 8Q0 2 6 2H26Q32 2 31 8Z" fill="#182642"/><path d="M16 32 7 8H25Z" fill="#fff" opacity=".26"/></svg></div><button type="button" class="wheel-center" id="spin-center" aria-label="Spin the wheel">SPIN</button></div>`;
  }
  function teamStageMarkup() {
    return `<div class="team-preview" id="team-preview"><div class="team-stage-head"><span>Team maker</span><span id="team-stage-count">${state.teamCount} teams</span></div><div class="team-stage-body" id="team-stage-body">Your groups appear here after you press Generate teams.</div></div>`;
  }
  function presetMarkup() {
    const choices=page==='yesno'?['yesno','names','colors']:page==='numbers'?['numbers','names']:page==='colors'?['colors','names','yesno']:['names','yesno','numbers','colors'];
    return `<div class="preset-row" role="group" aria-label="Quick choice presets">${choices.map(key=>`<button class="preset-btn" type="button" data-preset="${key}">${esc(presets[key].label)}</button>`).join('')}</div>`;
  }
  function effectControlsMarkup(){
    return `<details class="experience-controls" id="experience-controls"><summary>✨ Sounds & celebration <span>Personalize</span></summary>
      <p>Fine-tune the fun for your device. Sound starts only after you press Spin.</p>
      <label class="experience-toggle">Spin sound (tick + winning jingle) <input type="checkbox" data-effect="sound" ${effectSettings.sound?'checked':''}></label>
      <label class="experience-range">Volume <input aria-label="Spin sound volume" type="range" data-effect="volume" min="0" max="1" step="0.05" value="${effectSettings.volume}"><span id="volume-value">${Math.round(effectSettings.volume*100)}%</span></label>
      <label class="experience-toggle">Slow floating wheel <input type="checkbox" data-effect="ambient" ${effectSettings.ambient?'checked':''}></label>
      <label class="experience-toggle">Winner confetti & ribbons <input type="checkbox" data-effect="celebration" ${effectSettings.celebration?'checked':''}></label>
      <label class="experience-toggle">Extra fun confetti <input type="checkbox" data-effect="fun" ${effectSettings.fun?'checked':''}></label>
      <button class="secondary-btn" type="button" id="preview-celebration">✨ Preview celebration</button>
      <small class="experience-note">Reduced motion disables background spinning and falling confetti automatically.</small>
    </details>`;
  }
  function numberMarkup() {
    return `<div class="number-controls" id="number-controls"><label>From<input type="number" id="number-min" value="${state.numberMin}" inputmode="numeric"></label><label>To<input type="number" id="number-max" value="${state.numberMax}" inputmode="numeric"></label><label>Step<input type="number" min="1" id="number-step" value="${state.numberStep}" inputmode="numeric"></label><button type="button" class="secondary-btn" id="number-create">Create number choices</button></div>`;
  }
  function teamCountMarkup() {
    return `<div class="toggle-row"><label for="team-count">Number of teams<small>Balanced groups, with one participant per team.</small></label><select class="team-count" id="team-count" aria-label="Number of teams">${Array.from({length:15},(_,i)=>i+2).map(n=>`<option value="${n}" ${n===state.teamCount?'selected':''}>${n}</option>`).join('')}</select></div>`;
  }

  function drawWheel(entries) {
    const canvas=q('#wheel-canvas');
    if (!canvas) return;
    const valid=entries || state.entries; // Keep the master list visible; eliminated choices are dimmed, not deleted.
    const width=canvas.clientWidth || 345;
    const dpr=Math.min(window.devicePixelRatio || 1,2);
    const size=Math.max(220,Math.round(width*dpr));
    canvas.width=size;canvas.height=size;
    const ctx=canvas.getContext('2d');
    ctx.scale(size/400,size/400);
    const cx=200,cy=200,r=195;
    ctx.clearRect(0,0,400,400);
    if (!valid.length) {
      ctx.fillStyle='#e5ebf5';ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#6e8099';ctx.font='700 19px sans-serif';ctx.textAlign='center';ctx.fillText('Add choices',200,274);
      return;
    }
    const part=Math.PI*2/valid.length;
    valid.forEach((item,i)=>{
      const start=-Math.PI/2+i*part;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,start,start+part);ctx.closePath();
      const excluded=state.elimination && state.removedIds.includes(item.id);
      ctx.fillStyle=excluded?'#e4e9f2':palette[i%palette.length];ctx.fill();ctx.lineWidth=2.4;ctx.strokeStyle='#fff';ctx.stroke();
      const center=start+part/2;
      ctx.save();ctx.translate(cx,cy);ctx.rotate(center);
      ctx.fillStyle=excluded?'#77849b':'#1a2a44';ctx.textBaseline='middle';
      const compact=valid.length>18;
      const shown=compact?String(i+1):item.label;
      const maxChars=valid.length>12?12:valid.length>8?16:21;
      const display=shown.length>maxChars?shown.slice(0,maxChars-1)+'...':shown;
      ctx.font=`${valid.length>30?'700 13px':valid.length>16?'700 15px':valid.length>10?'700 17px':'760 19px'} ui-sans-serif, sans-serif`;
      const left=Math.cos(center)<0;
      if(left){ctx.rotate(Math.PI);ctx.textAlign='left';ctx.fillText(display,-r+28,0,r-59);}
      else{ctx.textAlign='right';ctx.fillText(display,r-28,0,r-59);}
      ctx.restore();
    });
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle='#fff';ctx.lineWidth=7;ctx.stroke();
  }

  function syncUi(keepCanvas) {
    if (!appNode) return;
    const input=q('#choices-input');
    if (input && document.activeElement!==input) input.value=state.entries.map(x=>x.label).join('\n');
    q('#choice-counter').textContent=`${state.entries.length} ${page==='teams'?'people':'choices'}`;
    q('#editor-count').textContent=`${state.entries.length} items`;
    q('#mode-summary').textContent=page==='teams'?`${state.teamCount} teams`:state.elimination?'No repeats':'Fair pick';
    const noRepeat=q('#no-repeat');if(noRepeat)noRepeat.checked=state.elimination;
    const teamCount=q('#team-count');if(teamCount)teamCount.value=String(state.teamCount);
    if (!keepCanvas && page!=='teams') drawWheel();
    if (page==='teams') renderTeams();
    q('#spin-main').disabled=spinning || editorInvalid || state.entries.length===0 || (page!=='teams'&&E.availableEntries(state.entries,state.removedIds,state.elimination).length===0) || (page==='teams'&&state.entries.length<state.teamCount);
    if(q('#spin-center'))q('#spin-center').disabled=q('#spin-main').disabled;
    q('#undo-result').disabled=spinning || !state.history.length;
    const last=q('#recent-title'); const detail=q('#recent-detail');
    last.textContent=state.history.length?'Session history':'Make your first pick';
    detail.textContent=state.history.length?`${state.history.length} ${state.history.length===1?'result':'results'} in this session`:'Your results will appear here.';
    q('#remove-winner').hidden=page==='teams'||!latestWinner||!!latestWinner.removed;
    if (state.entries.length===0) setResult('Add at least one choice to get started.',false);
    if (state.elimination && E.availableEntries(state.entries,state.removedIds,true).length===0 && state.entries.length) setResult('Everyone has been selected. Reset the round to go again.',false);
    if (state.entries.length>18) q('#input-help').textContent='Large wheels use numbered slices. The full list stays in the editor and winner announcement.';
    else if(state.elimination) q('#input-help').textContent='Gray slices are skipped, not deleted. Reset round restores every choice.';
    else q('#input-help').textContent='Up to 60 choices. Blank lines are ignored. Names stay on this device.';
  }

  function setResult(message,isWin) {
    const banner=q('#result-banner'); const target=q('#result-text');
    if (!banner||!target) return;
    banner.classList.toggle('is-win',!!isWin);
    target.textContent=message;
  }
  function freezeControls(frozen) {
    const els=qa('#editor-panel input,#editor-panel textarea,#editor-panel select,#editor-panel button');
    els.forEach(el=>el.disabled=frozen);
    q('#spin-main').disabled=frozen;
    if(q('#spin-center'))q('#spin-center').disabled=frozen;
    q('#remove-winner').disabled=frozen;
    q('#reset-round').disabled=frozen;
    q('#view-history').disabled=frozen;
    q('#spin-main span').textContent=frozen?'Spinning...':page==='teams'?'Generate teams':'Spin the wheel';
  }
  // The winner is chosen *before* the wheel moves. The visual animation ends on the chosen segment.
  function spin() {
    if(spinning||editorInvalid)return;
    const chosen=E.selectEntry(state.entries,state.removedIds,state.elimination);
    if(!chosen){toast(state.entries.length?'Reset your round to spin again.':'Add choices first.');return;}
    if(experience)experience.prepareAudio(); // called synchronously inside user's click
    stopAmbient();
    spinning=true;freezeControls(true);
    setResult('The wheel is spinning…',false);
    const canvas=q('#wheel-canvas');
    canvas.style.transition='none';
    drawWheel(state.entries);
    const start=wheelRotation;
    const reduced=reducedMotion();
    const duration=reduced?220:4600;
    const originalIndex=state.entries.findIndex(item=>item.id===chosen.entry.id);
    const target=reduced?E.targetRotation(start,originalIndex,state.entries.length,1):E.targetRotation(start,originalIndex,state.entries.length,6);
    const slice=360/state.entries.length;
    let previousTick=Math.floor(start/slice);
    const begin=performance.now();
    function finish(){
      wheelRotation=target%360;
      canvas.style.transform=`rotate(${wheelRotation}deg)`;
      const record={id:chosen.entry.id,label:chosen.entry.label,removed:!!state.elimination,when:Date.now()};
      state.history.unshift(record);state.history=state.history.slice(0,80);
      if(state.elimination)state.removedIds.push(chosen.entry.id);
      latestWinner=record;spinning=false;freezeControls(false);
      setResult(`Selected: ${chosen.entry.label}`,true);
      persist();syncUi();
      if(experience){experience.winSound();experience.showWinner(chosen.entry.label,page,{noRepeat:state.elimination});}
      if(state.elimination&&E.availableEntries(state.entries,state.removedIds,true).length===0)toast('Round complete. Reset to start again.');
      startAmbient();
    }
    function frame(timestamp){
      if(!spinning)return;
      const progress=Math.min(1,(timestamp-begin)/duration);
      // Ease-out quartic has a strong initial sweep and a gentle final stop.
      const eased=1-Math.pow(1-progress,4);
      const angle=start+(target-start)*eased;
      canvas.style.transform=`rotate(${angle}deg)`;
      if(!reduced&&progress<.98){
        const sector=Math.floor(angle/slice);
        if(sector!==previousTick){previousTick=sector;if(experience)experience.tick();}
      }
      if(progress<1)requestAnimationFrame(frame);else finish();
    }
    requestAnimationFrame(frame);
  }
  function renderTeams() {
    if (page!=='teams')return;
    const area=q('#team-stage-body');
    q('#team-stage-count').textContent=`${state.teamCount} teams`;
    if (!state.groups.length) {area.className='team-stage-body';area.textContent='Your balanced groups will appear here.';return;}
    area.className='team-grid';
    area.innerHTML=state.groups.map((people,i)=>`<div class="team-card"><strong>Team ${i+1}</strong><ol>${people.map(label=>`<li>${esc(label)}</li>`).join('')}</ol></div>`).join('');
  }
  function generateTeams() {
    if (spinning)return;
    if (state.entries.length<state.teamCount){toast('Add at least one person for each team.');return;}
    state.groups=E.distributeTeams(state.entries.map(x=>x.label),state.teamCount);
    const record={id:E.randomId(),label:`${state.teamCount} teams created`,removed:false,when:Date.now()};
    state.history.unshift(record); state.history=state.history.slice(0,80); latestWinner=record;
    setResult(`${state.entries.length} people divided into ${state.teamCount} balanced teams.`,true);
    renderTeams();persist();syncUi(true);
    toast('Teams are ready. Copy the result or generate again.');
  }
  function editorChanged(value) {
    if (spinning)return;
    let updated;
    try {updated=textToEntries(value,state.entries);}catch(e){editorInvalid=true;q('#input-help').textContent=e.message;setResult('Fix your list before spinning.',false);q('#spin-main').disabled=true;return;}
    editorInvalid=false;
    const differs=updated.length!==state.entries.length||updated.some((x,i)=>x.label!==state.entries[i].label);
    if(!differs){syncUi(true);return;}
    captureEditChange();
    state.entries=updated;
    state.removedIds=[];state.history=[];state.groups=[];latestWinner=null;
    setResult('Your wheel is updated. Ready to spin!',false);
    persist();syncUi();
  }
  function usePreset(key) {
    if (spinning||!presets[key])return;
    editorInvalid=false;
    beforeReplacingChoices('Before loading preset');
    state.entries=makeItems(presets[key].items);
    state.name=presets[key].label;
    state.removedIds=[];state.history=[];latestWinner=null;
    persist();setResult(`${presets[key].label} preset loaded.`,false);
    syncUi();
    toast('Preset loaded. Customize it or spin now.');
  }
  function removeWinner() {
    if (!latestWinner||spinning||page==='teams')return;
    const id=latestWinner.id;
    if (!state.removedIds.includes(id))state.removedIds.push(id);
    latestWinner.removed=true;
    if (state.history.length && state.history[0].id===id)state.history[0].removed=true;
    state.elimination=true; persist();syncUi();
    setResult(`${latestWinner.label} is excluded from future picks. Your original wheel is unchanged. Use Reset round to restore all choices.`,false);
  }
  function undoLast() {
    if(!state.history.length||spinning)return;
    checkpoint('Before undoing the last result');
    const old=state.history.shift();
    if(old.removed)state.removedIds=state.removedIds.filter(id=>id!==old.id);
    latestWinner=state.history[0]||null;
    setResult('Last result was undone.',false);
    persist();syncUi();
  }
  function resetRound() {
    if(spinning)return;
    checkpoint('Before resetting the round');
    state.history=[];state.removedIds=[];state.groups=[];latestWinner=null;
    setResult('Round reset. All original choices are still here.',false);
    persist();syncUi();
  }
  function openEditor() {
    if(spinning)return;
    lastFocusedEditorButton=document.activeElement;
    document.body.classList.add('editor-open','lock-scroll');
    q('#editor-panel').setAttribute('role','dialog');
    q('#editor-panel').setAttribute('aria-modal','true');
    q('#choices-input').focus();
  }
  function closeEditor() {
    document.body.classList.remove('editor-open','lock-scroll');
    q('#editor-panel').removeAttribute('role');
    q('#editor-panel').removeAttribute('aria-modal');
    (lastFocusedEditorButton||q('#mobile-edit'))?.focus();
  }

  function dialogsMarkup() {
    document.body.insertAdjacentHTML('beforeend',`<dialog class="dialog" id="saved-dialog" aria-labelledby="saved-dialog-title"><div class="dialog-inner"><div class="dialog-title"><h2 id="saved-dialog-title">My saved wheels</h2><button class="close-icon" type="button" data-close="saved-dialog" aria-label="Close">&times;</button></div><p class="dialog-help">Stored in this browser, not on a server. Saved wheels on a different device will not appear here.</p><div id="saved-list"></div></div></dialog>
      <dialog class="dialog" id="save-dialog" aria-labelledby="save-dialog-title"><div class="dialog-inner"><div class="dialog-title"><h2 id="save-dialog-title">Save this wheel</h2><button class="close-icon" type="button" data-close="save-dialog" aria-label="Close">&times;</button></div><p class="dialog-help">Give your wheel a name. You can reopen it from My Wheels anytime on this device.</p><label class="control-label" for="wheel-name-input">Wheel name</label><input id="wheel-name-input" maxlength="80" style="padding:12px 14px;width:100%;border:1px solid var(--border);border-radius:11px;margin-bottom:16px;"><button class="primary-btn" type="button" id="confirm-save" style="width:100%">Save wheel</button></div></dialog>
      <dialog class="dialog" id="share-dialog" aria-labelledby="share-dialog-title"><div class="dialog-inner"><div class="dialog-title"><h2 id="share-dialog-title">Share safely</h2><button class="close-icon" type="button" data-close="share-dialog" aria-label="Close">&times;</button></div><p class="dialog-help">The public link shares this tool, NOT your private names or choices. To move your exact wheel, export a JSON file and share it only with someone you trust.</p><div class="dialog-actions"><button class="secondary-btn" id="copy-tool-link" type="button">${icons.share} Copy tool link</button><button class="secondary-btn" id="export-json" type="button">Export wheel JSON</button></div><p style="font-size:12px;color:#74839a;margin-top:16px">Cloud sharing is deliberately disabled in this MVP until a secure backend is implemented.</p></div></dialog>
      <dialog class="dialog" id="recovery-dialog" aria-labelledby="recovery-dialog-title"><div class="dialog-inner"><div class="dialog-title"><h2 id="recovery-dialog-title">Restore an earlier wheel</h2><button class="close-icon" type="button" data-close="recovery-dialog" aria-label="Close">&times;</button></div><p class="dialog-help">If you change a list or switch templates, earlier versions are available here. A spin never removes your original choices. Backups are kept only in this browser.</p><div id="recovery-list"></div><p class="recovery-warning">Browser storage can be cleared by the user or device. Export JSON for a separate backup.</p></div></dialog>
      <dialog class="dialog" id="history-dialog" aria-labelledby="history-dialog-title"><div class="dialog-inner"><div class="dialog-title"><h2 id="history-dialog-title">Spin history</h2><button class="close-icon" type="button" data-close="history-dialog" aria-label="Close">&times;</button></div><p class="dialog-help">Latest results saved on this device.</p><div id="history-list"></div><div class="dialog-actions" style="margin-top:18px"><button class="secondary-btn" type="button" id="copy-history">Copy results</button><button class="secondary-btn" type="button" id="reset-history">Reset round</button></div></div></dialog>
      <dialog class="winner-dialog" id="winner-dialog" aria-labelledby="winner-name" aria-describedby="winner-subtitle"><canvas id="celebration-canvas" class="celebration-canvas" aria-hidden="true"></canvas><div class="winner-card"><button type="button" id="winner-close" class="winner-close" aria-label="Close result">×</button><div class="winner-medal" aria-hidden="true">🏆</div><p class="winner-eyebrow" id="winner-eyebrow">WE HAVE A WINNER!</p><h2 class="winner-name" id="winner-name">Alex</h2><p class="winner-subtitle" id="winner-subtitle">A little joy in every spin</p><div class="winner-confetti-divider" aria-hidden="true"></div><div class="winner-actions"><button type="button" class="primary-btn" id="winner-spin-again">Spin again</button><button type="button" class="secondary-btn" id="winner-remove">Exclude this round</button><button type="button" class="secondary-btn" id="winner-copy">Copy result</button></div><button type="button" id="winner-dismiss" class="text-btn winner-action-label">Close and view wheel</button><p class="winner-footer">Your original list is preserved on this device</p></div></dialog>`);
    qa('[data-close]').forEach(b=>b.addEventListener('click',()=>q('#'+b.dataset.close).close()));
  }
  let editingSavedId=null;
  function showSaveDialog(existing) {
    editingSavedId=existing||null;
    q('#save-dialog-title').textContent=editingSavedId?'Rename saved wheel':'Save this wheel';
    const candidate=editingSavedId?getSaved().find(s=>s.id===editingSavedId):null;
    q('#wheel-name-input').value=candidate?candidate.name:state.name;
    q('#save-dialog').showModal();q('#wheel-name-input').focus();q('#wheel-name-input').select();
  }
  function handleSave() {
    const name=q('#wheel-name-input').value.trim().slice(0,80);
    if(!name){toast('Please enter a wheel name.');return;}
    const saved=getSaved();
    if(editingSavedId){const selected=saved.find(s=>s.id===editingSavedId); if(selected) selected.name=name;}
    else {saved.unshift({id:E.randomId(),name,tool:page,data:clone(state),date:Date.now()});state.name=name;}
    if (!setSaved(saved)) {toast('Storage is unavailable; your wheel was not saved. Try Export JSON instead.');return;}
    persist();q('#save-dialog').close();toast('Wheel saved in this browser.');
    if(q('#saved-dialog').open)renderSaved();
  }
  function renderSaved() {
    const list=q('#saved-list');if(!list)return;
    const saved=getSaved();
    if(!saved.length){list.innerHTML='<div class="empty-state">No saved wheels yet. Save one to find it here.</div><button type="button" class="secondary-btn open-recovery-in-saved">↶ Restore earlier wheel</button>'; qa('.open-recovery-in-saved',list).forEach(btn=>btn.addEventListener('click',showRecovery)); return;}
    list.innerHTML=saved.map(record=>`<div class="saved-item"><div><div class="saved-name">${esc(record.name)}</div><small>${esc(record.tool||'home')} &bull; ${new Date(record.date||Date.now()).toLocaleDateString()}</small></div><div class="saved-actions"><button type="button" data-load="${esc(record.id)}">Open</button><button type="button" data-rename="${esc(record.id)}">Rename</button><button class="danger" type="button" data-delete="${esc(record.id)}">Delete</button></div></div>`).join('')+'<button type="button" class="secondary-btn open-recovery-in-saved">↶ Restore earlier wheel</button>';
    qa('.open-recovery-in-saved',list).forEach(btn=>btn.addEventListener('click',showRecovery));
    qa('[data-load]',list).forEach(btn=>btn.addEventListener('click',()=>{
      const savedRecord=getSaved().find(x=>x.id===btn.dataset.load);
      if(!savedRecord)return;
      if(savedRecord.tool!==page){beforeReplacingChoices('Before opening saved wheel');loadAcrossTool(savedRecord.data,savedRecord.tool);return;}
      beforeReplacingChoices('Before opening saved wheel');
      state=normalizeState(savedRecord.data);state.name=savedRecord.name;latestWinner=state.history[0]||null;
      persist();syncUi();q('#saved-dialog').close();toast('Saved wheel loaded.');
    }));
    qa('[data-rename]',list).forEach(btn=>btn.addEventListener('click',()=>{q('#saved-dialog').close();showSaveDialog(btn.dataset.rename);}));
    qa('[data-delete]',list).forEach(btn=>btn.addEventListener('click',()=>{
      if(!confirm('Delete this named wheel? A recoverable checkpoint will be kept in this browser.'))return;
      const item=getSaved().find(x=>x.id===btn.dataset.delete); if(item) checkpoint('Before deleting named wheel',item.data);
      if(!setSaved(getSaved().filter(x=>x.id!==btn.dataset.delete))){toast('Could not delete wheel because browser storage is blocked.');return;}
      renderSaved();toast('Named wheel deleted. A recovery copy is available.');
    }));
  }
  function showRecovery() {
    const list=q('#recovery-list'); if(!list)return;
    const recovery=recoveryRecords();
    list.innerHTML=recovery.length?recovery.map(rec=>`<div class="saved-item"><div><div class="saved-name">${esc(rec.name||'My Wheel')}</div><small>${esc(rec.tool||'home')} · ${rec.data.entries.length} choices · ${new Date(rec.when).toLocaleString()}</small><small>${esc(rec.reason||'Earlier version')}</small></div><div class="saved-actions"><button type="button" data-recover="${esc(rec.id)}">Restore</button><button type="button" data-backup="${esc(rec.id)}">Export</button></div></div>`).join(''):'<div class="empty-state">No earlier versions yet. Your working wheel is auto-saved as you edit and spin.</div>';
    qa('[data-recover]',list).forEach(button=>button.addEventListener('click',()=>{
      const record=recoveryRecords().find(x=>x.id===button.dataset.recover);
      if(!record)return;
      beforeReplacingChoices('Before restoring another version');
      if(record.tool!==page){loadAcrossTool(record.data,record.tool);return;}
      state=normalizeState(record.data);editorInvalid=false;
      latestWinner=state.history[0]||null;persist();syncUi();q('#recovery-dialog').close();
      if(q('#saved-dialog')?.open)q('#saved-dialog').close();
      setResult('Earlier wheel restored. Your choices are back.',false);toast('Previous wheel restored.');
    }));
    qa('[data-backup]',list).forEach(button=>button.addEventListener('click',()=>{
      const record=recoveryRecords().find(x=>x.id===button.dataset.backup);
      if(record)downloadJson('spinwheeljoy-recovered-'+record.tool+'.json',{kind:'spinwheeljoy-export',version:1,data:record.data});
    }));
    if(q('#saved-dialog')?.open)q('#saved-dialog').close();
    q('#recovery-dialog').showModal();
  }
  function showHistory() {
    const list=q('#history-list');
    list.innerHTML=state.history.length?state.history.map((x,i)=>`<div class="saved-item"><div><div class="saved-name">${esc(x.label)}</div><small>${new Date(x.when).toLocaleString()} ${x.removed?' · removed from next pick':''}</small></div><span class="pill">#${state.history.length-i}</span></div>`).join(''):'<div class="empty-state">No spins yet. Your picks will appear here.</div>';
    q('#history-dialog').showModal();
  }
  function handleImportFile(file) {
    if(!file)return;
    if(file.size>100000){toast('This file is too large. Maximum 100KB.');return;}
    const reader=new FileReader();
    reader.onload=()=>{
      try {
        const imported=JSON.parse(String(reader.result));
        if(imported.kind!=='spinwheeljoy-export'||!E.validateEntries(imported.data?.entries))throw new Error('Invalid SpinWheelJoy export file');
        if(imported.data.tool!==page) throw new Error('Open the same tool type to import this wheel.');
        beforeReplacingChoices('Before importing JSON');
        editorInvalid=false;state=normalizeState(imported.data); latestWinner=state.history[0]||null;
        persist();syncUi();toast('Wheel imported successfully.');
      }catch(error){toast(error.message||'Could not import this file.');}
    };
    reader.readAsText(file);
  }
  function setupStudio() {
    if(!appNode)return;
    if(urlSearch.get('load')==='1') {
      try {const handoff=JSON.parse(sessionStorage.getItem(storagePrefix+'handoff'));if(handoff && handoff.tool===page)state=normalizeState(handoff);sessionStorage.removeItem(storagePrefix+'handoff');}catch(_){}
    }
    appNode.innerHTML=studioMarkup();dialogsMarkup();
    if(experience){experience.bindDialog({onAgain:spin,onRemove:removeWinner,onCopy:(label)=>copyText(label)});}
    const quickSound=q('#quick-sound');if(quickSound)quickSound.addEventListener('click',()=>toggleEffect('sound',!effectSettings.sound));
    qa('[data-effect]').forEach(el=>el.addEventListener(el.type==='range'?'input':'change',()=>toggleEffect(el.dataset.effect,el.type==='checkbox'?el.checked:el.value)));
    const preview=q('#preview-celebration');if(preview)preview.addEventListener('click',()=>{if(experience){experience.prepareAudio();experience.winSound();experience.showWinner('SURPRISE!',page,{preview:true});}});

    q('#choices-input').value=state.entries.map(x=>x.label).join('\n');
    q('#choices-input').addEventListener('input',(ev)=>editorChanged(ev.target.value));
    if(page==='teams'){
      q('#team-count').addEventListener('change',e=>{state.teamCount=Number(e.target.value);state.groups=[];persist();syncUi();});
    }
    if(page==='numbers'){
      q('#number-create').addEventListener('click',()=>{
        try {
          const min=Number(q('#number-min').value),max=Number(q('#number-max').value),step=Number(q('#number-step').value);
          beforeReplacingChoices('Before creating number choices');
          editorInvalid=false;state.entries=E.numbersBetween(min,max,step);state.numberMin=min;state.numberMax=max;state.numberStep=step;
          state.history=[];state.removedIds=[];latestWinner=null;persist();syncUi();setResult('Number wheel updated. Ready to spin!',false);
        }catch(e){toast(e.message);}
      });
    }
    const noRepeat=q('#no-repeat');
    if(noRepeat)noRepeat.addEventListener('change',e=>{checkpoint('Before changing no-repeat mode');state.elimination=e.target.checked;state.removedIds=[];state.history=[];latestWinner=null;persist();syncUi();});
    q('#spin-main').addEventListener('click',page==='teams'?generateTeams:spin);
    if(q('#spin-center'))q('#spin-center').addEventListener('click',spin);
    q('#remove-winner').addEventListener('click',removeWinner);
    q('#undo-result').addEventListener('click',undoLast);
    q('#reset-round').addEventListener('click',resetRound);
    q('#mobile-edit').addEventListener('click',openEditor);
    q('#editor-close').addEventListener('click',closeEditor);
    q('#sheet-backdrop').addEventListener('click',closeEditor);
    qa('[data-preset]').forEach(b=>b.addEventListener('click',()=>usePreset(b.dataset.preset)));
    q('#shuffle-choices').addEventListener('click',()=>{beforeReplacingChoices('Before shuffling');state.entries=E.shuffled(state.entries);state.history=[];state.removedIds=[];state.groups=[];latestWinner=null;persist();syncUi();toast('Choices shuffled.');});
    q('#clear-choices').addEventListener('click',()=>{if(state.entries.length&&!confirm('Clear all choices? You can recover a previous version from Restore earlier.'))return;beforeReplacingChoices('Before clearing choices');state.entries=[];state.history=[];state.removedIds=[];state.groups=[];latestWinner=null;persist();syncUi();});
    q('#import-choices').addEventListener('click',()=>q('#import-file').click());
    q('#top-recovery').addEventListener('click',showRecovery);
    q('#restore-wheel').addEventListener('click',showRecovery);
    q('#recover-choices').addEventListener('click',showRecovery);
    q('#export-backup').addEventListener('click',()=>downloadJson('spinwheeljoy-'+page+'-backup.json',{kind:'spinwheeljoy-export',version:1,data:state}));
    q('#import-file').addEventListener('change',e=>{handleImportFile(e.target.files[0]);e.target.value='';});
    q('#save-wheel').addEventListener('click',()=>{if(editorInvalid){toast('Fix your list before saving.');return;}showSaveDialog();});
    q('#share-wheel').addEventListener('click',()=>q('#share-dialog').showModal());
    q('#view-history').addEventListener('click',showHistory);
    q('#confirm-save').addEventListener('click',handleSave);
    q('#wheel-name-input').addEventListener('keydown',e=>{if(e.key==='Enter')handleSave();});
    q('#copy-tool-link').addEventListener('click',()=>{if(location.protocol==='file:'||location.origin==='null'){toast('Public links work after deployment over HTTPS.');return;}copyText(location.origin+location.pathname);});
    q('#export-json').addEventListener('click',()=>downloadJson('spinwheeljoy-'+page+'.json',{kind:'spinwheeljoy-export',version:1,data:state}));
    q('#copy-history').addEventListener('click',()=>copyText(state.history.map(x=>x.label).join('\n')));
    q('#reset-history').addEventListener('click',()=>{q('#history-dialog').close();resetRound();toast('Round reset.');});
    window.addEventListener('resize',()=>{if(page!=='teams'&&!spinning)drawWheel();});
    window.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('editor-open'))closeEditor();});
    syncUi();
    checkpoint('First recovery checkpoint');
    if(page!=='teams'){
      const stage=q('#wheel-panel');
      if('IntersectionObserver' in window){
        const observer=new IntersectionObserver(entries=>{wheelVisible=!!entries[0]?.isIntersecting;if(wheelVisible)startAmbient();else stopAmbient();},{threshold:0.01});
        observer.observe(stage);
      }
      document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAmbient();else startAmbient();});
      const mq=window.matchMedia('(prefers-reduced-motion: reduce)');
      if(mq.addEventListener)mq.addEventListener('change',()=>{if(mq.matches)stopAmbient();else startAmbient();});
      startAmbient();
    }
    if(urlSearch.get('saved')==='1')showSavedDialog();
    persist();
  }
  function showSavedDialog() {
    if(!q('#saved-dialog')){location.href=root+'?saved=1';return;}
    renderSaved();q('#saved-dialog').showModal();
  }
  function setupGlobal() {
    const menu=q('#mobile-menu-toggle');const nav=q('#mobile-nav');
    if(menu&&nav)menu.addEventListener('click',()=>{const open=nav.dataset.open==='true';nav.dataset.open=String(!open);menu.setAttribute('aria-expanded',String(!open));});
    qa('[data-global-saved]').forEach(b=>b.addEventListener('click',showSavedDialog));
  }
  function setupTemplateSearch() {
    const search=q('#template-search');if(!search)return;
    const cards=qa('[data-template-name]');
    search.addEventListener('input',()=>{const term=search.value.trim().toLowerCase();cards.forEach(card=>card.style.display=card.dataset.templateName.includes(term)?'':'none');});
  }
  setupGlobal();setupTemplateSearch();setupStudio();
})();
