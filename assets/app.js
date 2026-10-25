/* GA4 — SpinWheelJoy property, installed 2026-10-24 (Measurement ID G-3SMC517LET).
   This loader is the SINGLE GA4 config for every page that loads app.js (home, blog,
   static pages, most tools). Do NOT also add a <head> gtag snippet anywhere: a second
   gtag('config') with the same ID would double-count pageviews. */
(function () {
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-3SMC517LET';
  document.head.appendChild(s);
  gtag('config', 'G-3SMC517LET');
})();
/* SpinWheelJoy application MVP. No external services or third-party dependencies. */
(function () {
  'use strict';
  // v0.10: theme handled by assets/theme.js + theme-boot.js (ChatGPT system)
  const E = window.SpinWheelEngine;
  if (!E) throw new Error('SpinWheel engine was not loaded');
  const page = document.body.dataset.tool || 'home';
  const root = document.body.dataset.root || './';
  const appNode = document.querySelector('#wheel-app');
  const storagePrefix = 'spinwheeljoy.v1.';
  // v1.3: Tool registry integration (with fallback to hardcoded values if registry not loaded).
  // The registry (tool-registry.js) is the single source of truth for tool metadata.
  const registry = window.SpinWheelTools || null;
  const registryTool = registry ? (registry.get(page) || registry.get('home')) : null;
  if (registryTool && registryTool.accent) {
    document.body.style.setProperty('--tool-accent', registryTool.accent);
  }
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
    challenges: ['Tell a joke','10 jumping jacks','Draw with eyes closed','Sing a chorus','Mime an animal','Compliment someone'],
    'movie-picker':['Inception','Coco','Toy Story','Titanic','Jurassic Park','La La Land','Lion King','Spider-Man','Avengers','Dune'],
    'workout-picker':['Push-ups','Squats','Plank','Jumping jacks','Lunges','Burpees','Mountain climbers','Sit-ups','High knees','Wall sit'],
    'secret-santa':['Alex','Jamie','Taylor','Morgan','Casey','Sam','Riley','Jordan'],
    'baby-name-picker':['Olivia','Liam','Emma','Noah','Ava','Oliver','Sophia','Elijah','Isabella','Mateo'],
    'letter-picker':['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
    'country-picker':['Japan','Italy','Brazil','Egypt','Canada','Australia','France','Mexico','Thailand','Kenya','Iceland','India'],
    'icebreaker-wheel':['Hidden talent?','Dream travel spot?','Favorite food?','Best weekend?','Superpower?','Childhood memory?','Guilty pleasure?','Bucket list?','Favorite movie?','Pet peeve?'],
    'song-picker':['Bohemian Rhapsody','Dancing Queen','Sweet Caroline','Livin on a Prayer','Billie Jean','Hotel California','Imagine','Hey Jude','Uptown Funk','Shake It Off'],
    'book-picker':['To Kill a Mockingbird','1984','Pride and Prejudice','The Great Gatsby','Harry Potter','The Hobbit','Dune','Jane Eyre','Moby Dick','Brave New World'],
    'pet-name-picker':['Biscuit','Luna','Max','Bella','Charlie','Daisy','Rocky','Molly','Buddy','Zoe'],
    'vacation-picker':['Beach resort','Mountain cabin','City adventure','Historic tour','Tropical island','Road trip','Ski lodge','Countryside retreat','Cruise','Desert safari'],
    'board-game-picker':['Codenames','Ticket to Ride','Catan','Pandemic','Azul','Splendor','Carcassonne','7 Wonders','Dixit','Chess'],
    'feelings-wheel':['Happy','Excited','Calm','Proud','Grateful','Curious','Brave','Silly','Peaceful','Hopeful','Playful','Loved'],
    'brain-break-wheel':['Dance freeze','Jumping jacks','Simon says','Stretch break','Animal walks','Freeze dance','Balloon breath','Wiggle break','Mirror moves','Shake it out'],
    'gift-idea-wheel':['Books','Experience day','Handmade gift','Plants','Art supplies','Games','Jewelry','Tech gadget','Cozy blanket','Gift card'],
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
    dates: {label:'Date ideas',items:defaultLabels.dates},
    secretsanta: {label:'Secret Santa',items:['Alex','Jamie','Taylor','Morgan','Casey','Sam','Riley','Jordan']},
    movienight: {label:'Movie Night',items:['Action blockbuster','Feel-good comedy','Animated family film','Classic drama','Sci-fi adventure','Documentary','Romantic comedy','Thriller']},
    workout: {label:'Workout',items:['20 push-ups','30 squats','60-second plank','20 jumping jacks','15 lunges each leg','30-second wall sit','20 mountain climbers','10 burpees']},
    datenight: {label:'Date Night',items:['Cook together','Movie marathon','Stargazing','Mini golf','Picnic at sunset','Museum visit','Dance class','Game cafe']},
    partygames: {label:'Party Games',items:['Charades','Pictionary','Two truths and a lie','Karaoke battle','Trivia quiz','Scavenger hunt','Limbo','Dance-off']},
    classroom: {label:'Classroom Picker',items:['Line leader','Board helper','Book captain','Tech assistant','Door holder','Messenger']},
    babynames: {label:'Baby Names',items:['Olivia','Liam','Emma','Noah','Ava','Ethan','Sophia','Mason','Isabella','Lucas']},
    vacation: {label:'Vacation Dreams',items:['Beach resort','Mountain cabin','City break','Road trip','Cruise','Countryside retreat','Island hopping','National parks tour']},
    bookclub: {label:'Book Club',items:['Mystery thriller','Sci-fi epic','Heartwarming romance','Inspiring biography','Fantasy adventure','Historical fiction','Thoughtful memoir','Page-turning suspense']},
    brainbreaks: {label:'Brain Breaks',items:['60-second dance party','Stretch like a cat','10 jumping jacks','Simon says','Freeze dance','Animal walks','Silent ball toss','Wiggle and shake']},
    songs: {label:'Song Picker',items:['Pop hit','Rock anthem','80s classic','Love ballad','Dance party','Acoustic chill','Throwback favorite','Guilty pleasure']},
    feelings: {label:'Feelings Check-in',items:['Happy','Excited','Calm','Proud','Nervous','Frustrated','Tired','Grateful','Curious','Brave']}
  };
  const defaultPalette = ['#ff0000','#ff6d00','#ffb300','#00c853','#2962ff','#aa00ff','#ff1744','#00b0ff','#f50057','#00e676'];
  // v0.13: per-tool wheel color themes
  const wheelThemes = {
    'movie-picker': ['#c41e3a','#f5c518','#1a1a2e','#e94560','#ffd700','#8b0000','#2d2d44','#ff6b6b','#16213e','#daa520'],
    'workout-picker': ['#ff6b35','#a8e10c','#00bfff','#ff2e63','#08d9d6','#f9ed69','#e23e57','#2a9d8f','#e9c46a','#f4845f'],
    'secret-santa': ['#c41e3a','#2d6a4f','#d4af37','#ffffff','#a01830','#40916c','#ffd700','#f8f9fa','#b7e4c7','#e63946'],
    'baby-name-picker': ['#ff6b9d','#4fc3f7','#ba68c8','#4dd0e1','#f48fb1','#9575cd','#fff176','#ce93d8','#80deea','#f8bbd0'],
    'letter-picker': ['#ff0000','#0000ff','#ffff00','#00ff00','#ff6600','#9900cc','#0099cc','#ff3399','#33cc33','#ffcc00'],
    'country-picker': ['#2d6a4f','#1d3557','#e07a5f','#81b29a','#f2cc8f','#457b9d','#e9c46a','#2a9d8f','#f4a261','#264653'],
    'icebreaker-wheel': ['#f39c12','#e67e22','#f1c40f','#e74c3c','#fd79a8','#fdcb6e','#e17055','#fab1a0','#ff7675','#ffeaa7'],
    'song-picker': ['#9b59b6','#e91e63','#00bcd4','#ff5722','#3f51b5','#ff9800','#4caf50','#f44336','#2196f3','#ffeb3b'],
    'book-picker': ['#800020','#2d5016','#b8860b','#f5f5dc','#5c4033','#8b6914','#4a6741','#d4af37','#3e2723','#a67c52'],
    'pet-name-picker': ['#ff8c69','#40e0d0','#ffd700','#ff69b4','#7fffd4','#ffa500','#00ced1','#ff1493','#adff2f','#ff6347'],
    'vacation-picker': ['#00bcd4','#ffdf6b','#ff6b6b','#2ec4b6','#ff9f1c','#06d6a0','#ffd166','#ef476f','#118ab2','#f4f1de'],
    'board-game-picker': ['#8b0000','#1a237e','#b8860b','#2e7d32','#4a148c','#e65100','#006064','#880e4f','#33691e','#3e2723'],
    'feelings-wheel': ['#ff0000','#ff7f00','#ffff00','#00ff00','#0000ff','#4b0082','#9400d3','#ff1493','#00ffff','#ff69b4'],
    'brain-break-wheel': ['#ff0000','#0000ff','#ffff00','#00ff00','#ff00ff','#00ffff','#ff8000','#8000ff','#008000','#ff0080'],
    'gift-idea-wheel': ['#e91e63','#ffd700','#c41e3a','#40e0d0','#ff69b4','#daa520','#ff1493','#00ced1','#ff6347','#f0e68c'],
    // v0.23: palettes for original 15 tools
    'random-name-picker': ['#2962ff','#00b0ff','#aa00ff','#ff1744','#ff6d00','#00e676','#ffb300','#f50057','#00c853','#ff0000'],
    'yes-or-no-wheel': ['#00c853','#00c853','#00c853','#00c853','#00c853','#ff0000','#ff0000','#ff0000','#ff0000','#ff0000'],
    'number-wheel': ['#1a237e','#283593','#3949ab','#3f51b5','#5c6bc0','#7986cb','#9fa8da','#c5cae9','#e8eaf6','#0d47a1'],
    'student-picker': ['#2e7d32','#43a047','#66bb6a','#81c784','#a5d6a7','#c8e6c9','#1b5e20','#388e3c','#4caf50','#8bc34a'],
    'team-generator': ['#e65100','#ef6c00','#f57c00','#fb8c00','#ff9800','#ffa726','#ffb74d','#ffcc80','#ffe0b2','#dd2c00'],
    'color-wheel': ['#ff0000','#ff7f00','#ffff00','#00ff00','#0000ff','#4b0082','#9400d3','#ff1493','#00ffff','#ff69b4'],
    'date-idea-wheel': ['#ff69b4','#ff1493','#f48fb1','#f8bbd0','#ec407a','#e91e63','#d81b60','#c2185b','#ad1457','#880e4f'],
    'decision-wheel': ['#37474f','#455a64','#546e7a','#607d8b','#78909c','#90a4ae','#b0bec5','#cfd8dc','#eceff1','#263238'],
    'what-to-eat-wheel': ['#ff6f00','#ff8f00','#ffa000','#ffb300','#ffc107','#ffca28','#ffd54f','#ffe082','#ff8f00','#e65100'],
    'prize-wheel': ['#ffd700','#daa520','#b8860b','#ffdf00','#ffcc00','#ffb300','#ffa000','#ff8f00','#ff6f00','#c9a227'],
    'truth-or-dare-wheel': ['#6a1b9a','#7b1fa2','#8e24aa','#9c27b0','#ab47bc','#ba68c8','#ce93d8','#e1bee7','#4a148c','#38006b'],
    'would-you-rather-wheel': ['#00695c','#00796b','#00897b','#009688','#26a69a','#4db6ac','#80cbc4','#b2dfdb','#004d40','#00332e'],
    'random-challenge-wheel': ['#d32f2f','#e53935','#f44336','#ef5350','#e57373','#ef9a9a','#ffcdd2','#c62828','#b71c1c','#ff5252'],
    'chore-wheel': ['#5d4037','#6d4c41','#795548','#8d6e63','#a1887f','#bcaaa4','#d7ccc8','#efebe9','#4e342e','#3e2723'],
    'classroom-reward-wheel': ['#f9a825','#fbc02d','#fdd835','#ffeb3b','#ffee58','#fff176','#fff59d','#fff9c4','#f57f17','#ff8f00'],
  };
  const palette = wheelThemes[page] || defaultPalette;
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
  // v0.11: probability weights. "Pizza x3", "Pizza:3", "Pizza *3" => weight 3. Default weight 1.
  function parseWeightSuffix(rawLabel) {
    const m = String(rawLabel).match(/^(.*?)(?:\s+[xX]\s*|\s*:\s*|\s*\*\s*)(\d{1,3})\s*$/);
    if (!m) return { label: String(rawLabel).trim(), weight: 1 };
    const w = Math.max(1, Math.min(100, parseInt(m[2], 10) || 1));
    return { label: m[1].trim(), weight: w };
  }
  function applyWeights(entries) {
    return entries.map((e) => {
      const pw = parseWeightSuffix(e.label);
      return pw.weight > 1 ? { id: e.id, label: pw.label, weight: pw.weight } : e;
    });
  }
  function entryDisplayLabel(entry) {
    return entry.weight > 1 ? entry.label + ' x' + entry.weight : entry.label;
  }
  function selectWeightedEntry(entries, removedIds, elimination) {
    const eligible = E.availableEntries(entries, removedIds, elimination);
    if (!eligible.length) return null;
    let total = 0;
    const cum = eligible.map((e) => { total += (e.weight || 1); return total; });
    if (total <= eligible.length) return E.selectEntry(entries, removedIds, elimination);
    const r = E.secureIndex(total);
    let lo = 0, hi = cum.length - 1;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (r < cum[mid]) hi = mid; else lo = mid + 1; }
    const entry = eligible[lo];
    const originalIndex = entries.findIndex((item) => item.id === entry.id);
    return { entry, index: originalIndex, eligible };
  }
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
    return {version:1,tool:page,name:'My Wheel',entries:makeItems(defaultLabels[page] || defaultLabels.home),elimination:false,removedIds:[],history:[],secretSantaAssignments:[],sound:true,teamCount:2,groups:[],numberMin:1,numberMax:12,numberStep:1}; // v1.3: secret santa state
  }
  function normalizeState(candidate) {
    const state = appDefaultState();
    if (!candidate || typeof candidate !== 'object' || !E.validateEntries(candidate.entries)) return state;
    state.entries=clone(candidate.entries);
    // v0.12: if saved entries are stale homepage defaults but this tool now has its own preset, use the preset
    try{
      const toolPreset=defaultLabels[page];
      if(toolPreset && page!=='home'){
        const savedLabels=state.entries.map(x=>x.label);
        const homeLabels=defaultLabels.home;
        const isStaleHome=savedLabels.length===homeLabels.length&&savedLabels.every((l,i)=>l===homeLabels[i]);
        const presetLabels=toolPreset;
        const matchesPreset=savedLabels.length===presetLabels.length&&savedLabels.every((l,i)=>l===presetLabels[i]);
        if(isStaleHome&&!matchesPreset){
          state.entries=makeItems(toolPreset);
          state.removedIds=[];state.history=[];
        }
      }
    }catch(e){}
    if(typeof candidate.tool==='string' && Object.hasOwn(defaultLabels,candidate.tool))state.tool=candidate.tool;
    state.name=typeof candidate.name==='string'?candidate.name.slice(0,80):state.name;
    state.elimination=!!candidate.elimination;
    const validIds = new Set(state.entries.map(x=>x.id));
    state.removedIds=Array.isArray(candidate.removedIds)?candidate.removedIds.filter(x=>validIds.has(x)).slice(0,60):[];
    // v1.3: Validate secret santa assignments (safe, backward compatible)
    if (Array.isArray(candidate.secretSantaAssignments) && candidate.secretSantaAssignments.length <= 60) {
      const ids=new Set(state.entries.map(x=>x.id));
      state.secretSantaAssignments=candidate.secretSantaAssignments.filter(x=>x && ids.has(x.giverId) && ids.has(x.receiverId) && x.giverId!==x.receiverId).map(x=>({giverId:x.giverId,receiverId:x.receiverId}));
    }
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
  // v1.3: Never overwrite a malformed legacy snapshot without first quarantining its raw bytes.
  const workingKey=storagePrefix+'working.'+page;
  let workingRaw=null,workingCandidate=null,workingWritable=true;
  try {
    workingRaw=localStorage.getItem(workingKey);
    if(workingRaw!==null)workingCandidate=JSON.parse(workingRaw);
  } catch(err) { workingCandidate=null; }
  if(workingRaw!==null && (!workingCandidate || !E.validateEntries(workingCandidate.entries))){
    const quarantineKey=storagePrefix+'quarantine.'+page+'.'+Date.now();
    try{localStorage.setItem(quarantineKey,workingRaw);}catch(_){workingWritable=false;}
  }
  let state = normalizeState(workingCandidate);
  let spinning = false;
  let latestWinner = state.history[0] || null;
  let wheelRotation=0;
  let ambientFrame=0, ambientLast=0, wheelVisible=true;
  const reducedMotion=()=>Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  function ambientShouldRun(){return page!=='teams' && !spinning && wheelVisible && !document.hidden && !reducedMotion() && !!effectSettings.ambient && !!q('#wheel-canvas');}
  function stopAmbient(){if(ambientFrame) cancelAnimationFrame(ambientFrame); ambientFrame=0;ambientLast=0;}
  let ambientTick=0;
  function ambientStep(timestamp){
    if(!ambientShouldRun()){stopAmbient();return;}
    if(!ambientLast) ambientLast=timestamp;
    const dt=Math.min(45,Math.max(0,timestamp-ambientLast));ambientLast=timestamp;
    wheelRotation=(wheelRotation+dt*0.0055)%360; // one slow lap about every 65 seconds
    const canvas=q('#wheel-canvas');if(canvas){canvas.style.transition='none';canvas.style.transform=`rotate(${wheelRotation}deg)`;}
    // v0.9: animate LED bulbs (throttled redraw, ~5fps)
    if(++ambientTick%12===0&&!spinning){try{drawWheel(state.entries);}catch(e){}}
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
  const presetKey = urlSearch.get('preset') || urlSearch.get('template');
  let templatePreview=false;
  if (presetKey && presets[presetKey] && page === 'home') {
    // v1.3: Snapshot the user's custom wheel to recovery BEFORE template replaces it.
    try {
      const desiredItems = presets[presetKey].items;
      const same = JSON.stringify(state.entries.map(x=>x.label))===JSON.stringify(desiredItems);
      if (!same && state.entries.length) {
        try { checkpoint('Before opening a template from a link', state); } catch(_){}
      }
      state.entries=applyWeights(makeItems(desiredItems));
      state.name=presets[presetKey].label;
    } catch(e) {
      // Fallback: still load template even if checkpoint fails
      try {
        state.entries=applyWeights(makeItems(presets[presetKey].items));
        state.name=presets[presetKey].label;
      } catch(_){}
    }
    state.history=[];state.removedIds=[];
    latestWinner=null;
    templatePreview=true; // v0.14: don't auto-save template previews
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
    if(templatePreview)return; // v0.14: don't overwrite user's saved wheel with template preview
    const saved=workingWritable && safeWrite(storagePrefix+'working.'+page,{...state,groups:state.groups.slice(0,16)}); // v1.3: respect quarantine
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
           <button class="secondary-btn" id="fullscreen-wheel" type="button" aria-label="Full screen wheel" title="Full screen">⛶</button>
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
          <p class="help-line" id="input-help">Up to 60 choices. Blank lines are ignored. Tip: add x2, x3 after a choice for a higher chance.</p>
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

  // v0.9 LED: animated bulbs. mode: 'idle' (twinkle), 'spin' (chase), 'win' (flash).
  let bulbMode='idle', bulbTick=0;
  const bulbColors=['#ffcd68','#fb857f','#b49be9','#62c6ad','#78a6ee'];
  function drawBulbs(ctx,cx,cy){
    bulbTick++;
    for(let i=0;i<20;i++){
      const a=i/20*Math.PI*2, bx=cx+Math.cos(a)*184, by=cy+Math.sin(a)*184;
      let glow=0.55; // base brightness
      if(bulbMode==='spin'){ glow = 0.2 + 0.8*Math.max(0,Math.sin(bulbTick*0.35 - i*0.63)); }
      else if(bulbMode==='idle'){ glow = 0.4 + 0.6*Math.sin(bulbTick*0.08 + i*1.7); }
      else if(bulbMode==='win'){ glow = (Math.floor(bulbTick/6)%2===0) ? 1 : 0.1; } // v1.2: stronger blink
      ctx.beginPath();ctx.arc(bx,by,4.6,0,Math.PI*2);
      ctx.shadowColor='rgba(24,38,66,.28)';ctx.shadowBlur=3;ctx.shadowOffsetY=1;
      ctx.globalAlpha=Math.max(0.2,Math.min(1,glow));
      ctx.fillStyle=bulbColors[i%bulbColors.length];ctx.fill();
      ctx.globalAlpha=1;ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;
      ctx.beginPath();ctx.arc(bx-1.2,by-1.4,1.5,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,.75)';ctx.fill();
    }
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
    const cx=200,cy=200,outer=196,r=186; // v1.2: thin rim
  // v1.3: Text color chosen by relative luminance rather than hardcoded white.
  // Ensures readability on both vibrant and light/pastel segments.
  function textColor(hex){
    if(typeof hex!=='string'||!/^#[0-9a-f]{6}$/i.test(hex)) return '#ffffff';
    const channels=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
    const luminance=channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
    return luminance>.35?'#13233b':'#ffffff';
  }
    ctx.clearRect(0,0,400,400);
    // Rim: soft white ring with colored bulbs. (v0.9: animated chase during spin)
    const rim=ctx.createLinearGradient(0,0,0,400);rim.addColorStop(0,'#ffffff');rim.addColorStop(1,'#e3eaf9');
    ctx.beginPath();ctx.arc(cx,cy,outer,0,Math.PI*2);ctx.fillStyle=rim;ctx.fill();
    ctx.beginPath();ctx.arc(cx,cy,outer-.8,0,Math.PI*2);ctx.lineWidth=1.6;ctx.strokeStyle='#d5def2';ctx.stroke();
    drawBulbs(ctx,cx,cy);
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
      const segColor=excluded?'#e4e9f2':palette[i%palette.length]; // v1.3: reused for adaptive text
      ctx.fillStyle=segColor;ctx.fill();ctx.lineWidth=2.4;ctx.strokeStyle='#fff';ctx.stroke();
      const center=start+part/2;
      ctx.save();ctx.translate(cx,cy);ctx.rotate(center);
      ctx.fillStyle=excluded?'#77849b':textColor(segColor);ctx.textBaseline='middle'; // v1.3: adaptive text
      const compact=valid.length>18&&!valid.every(x=>x.label&&x.label.length<=2); // v0.22: short labels always show
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
    if (input && document.activeElement!==input) input.value=state.entries.map(x=>entryDisplayLabel(x)).join('\n');
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
    if (state.entries.length>18&&!state.entries.every(x=>x.label&&x.label.length<=2)) q('#input-help').textContent='Large wheels use numbered slices. The full list stays in the editor and winner announcement.';
    else if(state.elimination) q('#input-help').textContent='Gray slices are skipped, not deleted. Reset round restores every choice.';
    else q('#input-help').textContent='Up to 60 choices. Blank lines are ignored. Tip: add x2, x3 after a choice for a higher chance.';
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
    templatePreview=false; // user spun = it's theirs now
    if(spinning||editorInvalid)return;
    const chosen=selectWeightedEntry(state.entries,state.removedIds,state.elimination);
    if(!chosen){toast(state.entries.length?'Reset your round to spin again.':'Add choices first.');return;}
    if(experience)experience.prepareAudio(); // called synchronously inside user's click
    stopAmbient();
    spinning=true;freezeControls(true);bulbMode='spin';
    setResult('The wheel is spinning…',false);
    const canvas=q('#wheel-canvas');
    canvas.style.transition='none';
    drawWheel(state.entries);
    const start=wheelRotation;
    const reduced=reducedMotion();
    const duration=reduced?220:6500; // v0.9: slow elegant spin like the reference video
    const originalIndex=state.entries.findIndex(item=>item.id===chosen.entry.id);
    const target=reduced?E.targetRotation(start,originalIndex,state.entries.length,1):E.targetRotation(start,originalIndex,state.entries.length,6);
    const slice=360/state.entries.length;
    let previousTick=Math.floor(start/slice);
    let begin=0;
    let safetyTimer=0;
    function finish(){
      if(safetyTimer){clearTimeout(safetyTimer);safetyTimer=0;}
      wheelRotation=target%360;
      canvas.style.transform=`rotate(${wheelRotation}deg)`;
      const record={id:chosen.entry.id,label:chosen.entry.label,removed:!!state.elimination,when:Date.now()};
      state.history.unshift(record);state.history=state.history.slice(0,80);
      if(state.elimination)state.removedIds.push(chosen.entry.id);
      latestWinner=record;spinning=false;freezeControls(false);
      setResult(`Selected: ${chosen.entry.label}`,true);
      persist();syncUi();
      bulbMode='win';setTimeout(()=>{bulbMode='idle';},2600);
      if(experience){experience.winSound();experience.showWinner(chosen.entry.label,page,{noRepeat:state.elimination});}
      if(state.elimination&&E.availableEntries(state.entries,state.removedIds,true).length===0)toast('Round complete. Reset to start again.');
      startAmbient();
    }
    function frame(timestamp){
      if(!spinning)return;
      if(!begin)begin=timestamp;
      const progress=Math.min(1,(timestamp-begin)/duration);
      // v0.9: ease-out cubic for a slow, luxurious slowdown (like the reference video).
      const eased=1-Math.pow(1-progress,3);
      const angle=start+(target-start)*eased;
      canvas.style.transform=`rotate(${angle}deg)`;
      if(!reduced&&progress<.98){
        const sector=Math.floor(angle/slice);
        if(sector!==previousTick){previousTick=sector;if(experience)experience.tick();}
      if(bulbTick%4===0){try{drawWheel(state.entries);}catch(e){}}
      }
      if(progress<1)requestAnimationFrame(frame);else finish();
    }
    requestAnimationFrame(frame);
    // Safety net: guarantee finish() even if rAF timestamps misbehave (iOS).
    safetyTimer=setTimeout(()=>{if(spinning){try{finish();}catch(e){spinning=false;freezeControls(false);}}},duration+3000);
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
    try {updated=applyWeights(textToEntries(value,state.entries));}catch(e){editorInvalid=true;q('#input-help').textContent=e.message;setResult('Fix your list before spinning.',false);q('#spin-main').disabled=true;return;}
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
    state.entries=applyWeights(makeItems(presets[key].items));
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
      <dialog class="winner-dialog" id="winner-dialog" aria-labelledby="winner-name" aria-describedby="winner-subtitle"><canvas id="celebration-canvas" class="celebration-canvas" aria-hidden="true"></canvas><div class="winner-card"><button type="button" id="winner-close" class="winner-close" aria-label="Close result">×</button><div class="winner-medal" id="winner-icon" aria-hidden="true">🏆</div><p class="winner-eyebrow" id="winner-eyebrow">WE HAVE A WINNER!</p><h2 class="winner-name" id="winner-name">Alex</h2><p class="winner-subtitle" id="winner-subtitle">A little joy in every spin</p><div class="winner-confetti-divider" aria-hidden="true"></div><div class="winner-actions"><button type="button" class="primary-btn" id="winner-spin-again">Spin again</button><button type="button" class="secondary-btn" id="winner-remove">Exclude this round</button><button type="button" class="secondary-btn" id="winner-copy">Copy result</button></div><button type="button" id="winner-dismiss" class="text-btn winner-action-label">Close and view wheel</button><p class="winner-footer">Your original list is preserved on this device</p></div></dialog>`);
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

    q('#choices-input').value=state.entries.map(x=>entryDisplayLabel(x)).join('\n');
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
    // v1.2: Fullscreen wheel mode
    const fsBtn=q('#fullscreen-wheel');
    if(fsBtn){
      fsBtn.addEventListener('click',()=>{
        const on=!document.body.classList.contains('wheel-focus');
        document.body.classList.toggle('wheel-focus',on);
        document.body.classList.toggle('lock-scroll',on);
        fsBtn.setAttribute('aria-label',on?'Exit full screen':'Full screen wheel');
        fsBtn.innerHTML=on?'✕':'⛶';
        if(on)window.scrollTo(0,0);
        requestAnimationFrame(()=>requestAnimationFrame(()=>{if(!spinning)drawWheel();}));
      });
      document.addEventListener('keydown',(e)=>{
        if(e.key==='Escape'&&document.body.classList.contains('wheel-focus'))fsBtn.click();
      });
    }
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
