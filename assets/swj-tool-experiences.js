/* SpinWheelJoy 30 Tools Companion v1.5
 * Additive, local-only panels. Intentionally never modifies app.js, wheel timing,
 * LED effects, localStorage or the existing Secret Santa Drawer.
 * Public API: SpinWheelCompanions.mount(element, toolId)
 */
(function(scope){
  'use strict';
  const registry=scope.SpinWheelTools, engine=scope.SpinWheelEngine;
  if(scope.SWJ_DISABLE_COMPANIONS===true || !registry || !engine){ return; }
  const FEATURES=Object.freeze({
    names:'wheel',yesno:'wheel',numbers:'number',students:'wheel',teams:'teams',
    colors:'color',prize:'prize',decision:'wheel',truthdare:'prompt',wouldrather:'prompt',
    rewards:'wheel',dinner:'wheel',chores:'chores',dates:'wheel',challenges:'wheel',
    'workout-picker':'timer','vacation-picker':'wheel','gift-idea-wheel':'gift',
    'letter-picker':'letters','feelings-wheel':'prompt','icebreaker-wheel':'prompt',
    'movie-picker':'catalog','baby-name-picker':'wheel','pet-name-picker':'wheel',
    'board-game-picker':'catalog','song-picker':'catalog','brain-break-wheel':'timer',
    'secret-santa':'secret-santa','book-picker':'catalog','country-picker':'wheel'
  });
  const PROMPTS={
    truthdare:'A friendly question or challenge is ready. Everyone may choose to pass.',
    wouldrather:'Discuss both options. There is no wrong answer.',
    'feelings-wheel':'What might make someone feel this way? You can always pass.',
    'icebreaker-wheel':'Give everyone a chance to answer, or pass without explaining.'
  };
  const TIMER_DURATION={'brain-break-wheel':30,'workout-picker':45};
  const GIFTS={
    anyone:{small:['Handwritten card','Potted herb','Reusable notebook'],medium:['Cozy blanket','Art kit','Coffee tasting set'],large:['Workshop experience','Museum membership']},
    friend:{small:['Favorite snack box','Photo print','Travel mug'],medium:['Board game','Book bundle','Craft kit'],large:['Concert experience','Weekend activity']},
    partner:{small:['Personal letter','Picnic treats','Printed photo'],medium:['Cooking class','Movie night kit','Personalized journal'],large:['Day trip','Dinner experience']},
    coworker:{small:['Desk plant','Notebook','Tea sampler'],medium:['Reusable lunch set','Desk organizer','Coffee gift set'],large:['Skill workshop','Experience voucher']},
    family:{small:['Recipe cards','Puzzle','Photo frame'],medium:['Family board game','Baking set','Home movie kit'],large:['Family day out','Shared experience']}
  };
  const MAX_LINES=60,MAX_LABEL=72;
  const $=(selector,context=document)=>context.querySelector(selector);
  function n(tag,props={},value){const el=document.createElement(tag);Object.entries(props).forEach(([k,v])=>{if(k==='class')el.className=v;else if(k==='dataset')Object.entries(v).forEach(([key,val])=>el.dataset[key]=val);else if(k==='checked')el.checked=!!v;else if(k==='value')el.value=v;else el.setAttribute(k,String(v));});if(value!==undefined)el.textContent=String(value);return el;}
  function field(labelText, type='text', attrs={}){const label=n('label',{class:'swjx-field'});label.append(n('span',{},labelText));const input=n('input',{type,...attrs});label.append(input);return [label,input];}
  function btn(text,style='primary'){return n('button',{type:'button',class:'swjx-btn swjx-'+style},text);}
  function paragraphs(text){return n('p',{class:'swjx-intro'},text);}
  function setError(status,msg){status.textContent=msg;status.dataset.state='error';}
  function setSuccess(status,msg){status.textContent=msg;status.dataset.state='ok';}
  function clearResult(node){node.replaceChildren();}
  function lines(input,max=MAX_LINES){const parts=String(input).split(/\r?\n/).map(s=>s.trim()).filter(Boolean);if(parts.length>max)throw new Error('Maximum '+max+' items.');if(parts.some(s=>s.length>MAX_LABEL))throw new Error('Each item must have at most 72 characters.');return parts;}
  function uniqueNameList(value,max){const list=lines(value,max);if(new Set(list.map(x=>x.toLocaleLowerCase())).size!==list.length)throw new Error('Please use unique participant names.');return list;}
  async function copy(value,status){try{await navigator.clipboard.writeText(value);setSuccess(status,'Copied.');}catch(_){setError(status,'Clipboard is unavailable here. Select and copy the visible results instead.');}}
  function randint(count){return engine.secureIndex(count);}
  function sampleNumbers(min,max,count,unique){
    if(![min,max,count].every(Number.isSafeInteger) || min < -1000000000 || max>1000000000 || min>max || count<1 || count>30) throw new Error('Use whole-number bounds from -1 billion to 1 billion, and request 1–30 results.');
    const range=max-min+1;
    if(unique&&count>range)throw new Error('The range has fewer unique numbers than requested.');
    const out=[];
    if(!unique){for(let i=0;i<count;i++)out.push(min+randint(range));return out;}
    const swap=new Map();let remaining=range;
    for(let i=0;i<count;i++){
      const pick=randint(remaining);
      const selected=swap.has(pick)?swap.get(pick):pick;
      const tail=remaining-1;
      swap.set(pick,swap.has(tail)?swap.get(tail):tail);
      out.push(min+selected);remaining--;
    }
    return out;
  }
  function shell(tool,tagline){const article=n('section',{class:'swjx-panel', 'aria-label':tool.title+' extra tools'});article.style.setProperty('--swjx-accent',tool.accent);const head=n('div',{class:'swjx-head'});head.append(n('span',{class:'swjx-eyebrow'},'SPINWHEELJOY · TOOL STUDIO'),n('h2',{},tagline));article.append(head);return article;}
  function statusAndResult(panel){const status=n('div',{class:'swjx-status',role:'status','aria-live':'polite'});const result=n('div',{class:'swjx-result','aria-live':'polite'});panel.append(status,result);return{status,result};}
  function cards(result,items){clearResult(result);const ul=n('div',{class:'swjx-chipgrid'});items.forEach(item=>ul.append(n('span',{class:'swjx-chip'},item)));result.append(ul);}
  function mountNumbers(panel){
    panel.append(paragraphs('Generate one or more numbers instantly. For a visual draw, use the wheel above.'));
    const controls=n('div',{class:'swjx-formgrid'});
    const [lmin,min]=field('Minimum','number',{value:1,min:-1000000000,max:1000000000});
    const [lmax,max]=field('Maximum','number',{value:100,min:-1000000000,max:1000000000});
    const [lcount,count]=field('How many?','number',{value:1,min:1,max:30});
    const [lunique,unique]=field('Unique (no repeats)','checkbox',{checked:true});
    const go=btn('Generate numbers'),copyBtn=btn('Copy results','secondary');copyBtn.disabled=true;
    controls.append(lmin,lmax,lcount,lunique);const actions=n('div',{class:'swjx-actions'},undefined);actions.append(go,copyBtn);panel.append(controls,actions);
    const{status,result}=statusAndResult(panel);let last=[];
    go.addEventListener('click',()=>{try{last=sampleNumbers(Number(min.value),Number(max.value),Number(count.value),unique.checked);cards(result,last);copyBtn.disabled=false;setSuccess(status,last.length+' result'+(last.length===1?'':'s')+' generated.');}catch(e){last=[];copyBtn.disabled=true;clearResult(result);setError(status,e.message);}});
    copyBtn.addEventListener('click',()=>copy(last.join(', '),status));
  }
  function mountLetters(panel){
    panel.append(paragraphs('Pick a letter for spelling games. No repeats can be enabled for a full alphabet round.'));
    const vowels='AEIOU',alpha='ABCDEFGHIJKLMNOPQRSTUVWXYZ';const controls=n('div',{class:'swjx-formgrid'});
    const lab=n('label',{class:'swjx-field'});lab.append(n('span',{},'Letter set'));
    const select=n('select');[['all','A–Z'],['vowels','Vowels'],['consonants','Consonants']].forEach(([v,title])=>select.append(n('option',{value:v},title)));lab.append(select);
    const [lunique,unique]=field('No repeats','checkbox',{checked:true});
    const go=btn('Pick a letter'),reset=btn('Reset letters','secondary');controls.append(lab,lunique);
    const actions=n('div',{class:'swjx-actions'});actions.append(go,reset);panel.append(controls,actions);
    const{status,result}=statusAndResult(panel);const used=new Set();let oldGroup='all';
    function group(){return Array.from(select.value==='vowels'?vowels:select.value==='consonants'?alpha.split('').filter(x=>!vowels.includes(x)).join(''):alpha);}
    go.addEventListener('click',()=>{if(select.value!==oldGroup){used.clear();oldGroup=select.value;}const eligible=group().filter(x=>!unique.checked||!used.has(x));if(!eligible.length){setError(status,'All letters in this set have been used. Press Reset.');return;}const letter=eligible[randint(eligible.length)];used.add(letter);result.replaceChildren(n('div',{class:'swjx-giant-letter'},letter));setSuccess(status,'Picked '+letter+' · '+used.size+' distinct letter(s) used.');});
    reset.addEventListener('click',()=>{used.clear();oldGroup=select.value;clearResult(result);setSuccess(status,'Fresh letter round.');});
    select.addEventListener('change',()=>{used.clear();clearResult(result);oldGroup=select.value;status.textContent='';});
  }
  function mountChores(panel){
    panel.append(paragraphs('Assign every chore fairly. Each task goes to one person, and workloads differ by at most one. All data stays on this page.'));
    const grid=n('div',{class:'swjx-formgrid swjx-two'});
    const peopleLabel=n('label',{class:'swjx-field'});peopleLabel.append(n('span',{},'Participants, one per line'));
    const people=n('textarea',{rows:5,placeholder:'Alex\nJamie\nTaylor'});peopleLabel.append(people);
    const taskLabel=n('label',{class:'swjx-field'});taskLabel.append(n('span',{},'Tasks, one per line'));
    const tasks=n('textarea',{rows:5,placeholder:'Take out trash\nWash dishes\nWater plants'});tasks.value=registry.get('chores').labels.join('\n');taskLabel.append(tasks);
    grid.append(peopleLabel,taskLabel);panel.append(grid);
    const go=btn('Assign chores'),copyBtn=btn('Copy assignments','secondary');copyBtn.disabled=true;const actions=n('div',{class:'swjx-actions'});actions.append(go,copyBtn);panel.append(actions);
    const{status,result}=statusAndResult(panel);let output='';
    go.addEventListener('click',()=>{try{
      const members=uniqueNameList(people.value,30),jobs=lines(tasks.value,60);
      if(!members.length||!jobs.length)throw new Error('Enter at least one participant and one task.');
      if(output&&!scope.confirm('Create a new assignment and replace the on-screen results?'))return;
      const names=engine.shuffled(members),work=engine.shuffled(jobs);const groups=names.map(name=>({name,jobs:[]}));
      work.forEach((job,i)=>groups[i%groups.length].jobs.push(job));
      clearResult(result);const board=n('div',{class:'swjx-cards'});
      groups.forEach(({name,jobs})=>{const card=n('article',{class:'swjx-assignment'});card.append(n('h3',{},name));const ul=n('ul');jobs.forEach(job=>ul.append(n('li',{},job)));if(!jobs.length)ul.append(n('li',{},'No task this round'));card.append(ul);board.append(card);});result.append(board);
      output=groups.map(x=>x.name+': '+(x.jobs.join(', ')||'No task')).join('\n');copyBtn.disabled=false;setSuccess(status,jobs.length+' task(s) allocated across '+names.length+' participant(s).');
    }catch(e){setError(status,e.message);}});
    copyBtn.addEventListener('click',()=>copy(output,status));
  }
  function mountTeams(panel){
    panel.append(paragraphs('Your Team Generator above already creates balanced teams. Use this shortcut to copy the latest group results without changing them.'));
    const button=btn('Copy current teams');panel.append(button);const{status}=statusAndResult(panel);
    button.addEventListener('click',()=>{const teamCards=Array.from(document.querySelectorAll('#team-stage-body .team-card'));if(!teamCards.length){setError(status,'Generate teams first using the main tool above.');return;}
      const output=teamCards.map(card=>{const name=card.querySelector('strong')?.textContent||'Team';const members=Array.from(card.querySelectorAll('li')).map(el=>el.textContent);return name+'\n'+members.map(m=>'• '+m).join('\n');}).join('\n\n');copy(output,status);});
  }
  function mountPrompt(panel,toolId){
    panel.append(paragraphs('Spin the wheel above. Once you close the winner dialog, the selected prompt will appear here as a readable card.'));
    const{status,result}=statusAndResult(panel);
    const dialog=document.getElementById('winner-dialog');
    function show(label){clearResult(result);const card=n('article',{class:'swjx-prompt-card'});card.append(n('span',{class:'swjx-eyebrow'},'YOUR PICK'),n('h3',{},label),n('p',{},PROMPTS[toolId]||'Enjoy the next activity.'));
      if(toolId==='wouldrather'){const parts=label.replace(/\?$/,'').split(/\s+or\s+/i);if(parts.length===2){const opts=n('div',{class:'swjx-chipgrid'});parts.forEach(part=>opts.append(n('span',{class:'swjx-chip'},part.trim())));card.append(opts);}}
      result.append(card);setSuccess(status,'Ready to discuss or try the challenge.');}
    panel._showSelected=show;
    if(dialog)dialog.addEventListener('close',()=>{const mainResult=$('#result-text')?.textContent||'';if(!mainResult.startsWith('Selected:'))return;const label=$('#winner-name')?.textContent;if(label)show(label);});
  }
  function mountTimer(panel,toolId){
    const isBrain=toolId==='brain-break-wheel';panel.append(paragraphs(isBrain?'Spin for a quick classroom break, then run the timer below.':'Spin to choose a gentle exercise, then set a short activity timer below.'));
    const grid=n('div',{class:'swjx-formgrid'});const [lab,seconds]=field('Duration (seconds)','number',{min:10,max:600,value:TIMER_DURATION[toolId]});grid.append(lab);panel.append(grid);
    const buttons=n('div',{class:'swjx-actions'}),start=btn('Start timer'),stop=btn('Stop','secondary');stop.disabled=true;buttons.append(start,stop);panel.append(buttons);
    const{status,result}=statusAndResult(panel);const display=n('div',{class:'swjx-timer',role:'timer'},String(seconds.value)+'s');result.append(display);
    let clock=null,finishAt=0;
    function stopTimer(){if(clock!==null){scope.clearInterval(clock);clock=null;}start.disabled=false;stop.disabled=true;}
    start.addEventListener('click',()=>{
      const secs=Number(seconds.value);if(!Number.isSafeInteger(secs)||secs<10||secs>600){setError(status,'Enter 10–600 whole seconds.');return;}
      stopTimer();finishAt=Date.now()+secs*1000;display.textContent=secs+'s';start.disabled=true;stop.disabled=false;setSuccess(status,'Timer running. You can switch tabs and return.');
      clock=scope.setInterval(()=>{const left=Math.max(0,Math.ceil((finishAt-Date.now())/1000));display.textContent=left+'s';if(!left){stopTimer();setSuccess(status,'Time is up!');}},200);
    });
    stop.addEventListener('click',()=>{stopTimer();setSuccess(status,'Timer stopped.');});
    const dlg=$('#winner-dialog');if(dlg)dlg.addEventListener('close',()=>{const m=$('#result-text')?.textContent||'';if(m.startsWith('Selected:'))setSuccess(status,'Activity: '+($('#winner-name')?.textContent||'')+'. Start the timer when ready.');});
    scope.addEventListener('pagehide',stopTimer,{once:true});
  }
  function mountColor(panel){
    panel.append(paragraphs('Spin the color wheel, close the result, then copy the selected HEX value. Custom choices such as #4A90E2 are also supported.'));
    const{status,result}=statusAndResult(panel);
    const lookup={Red:'#E95060',Orange:'#FC9A3B',Yellow:'#F0C749',Green:'#26AA83',Blue:'#3B83D9',Purple:'#9165BE'};
    const dialog=$('#winner-dialog');if(!dialog)return;
    dialog.addEventListener('close',()=>{if(!($('#result-text')?.textContent||'').startsWith('Selected:'))return;const label=$('#winner-name')?.textContent?.trim()||'';
      const hex=/^#[0-9a-f]{6}$/i.test(label)?label:lookup[label];clearResult(result);
      if(!hex){setError(status,'No HEX preset for '+label+'. Try a standard color name or a #RRGGBB choice.');return;}
      const visual=n('div',{class:'swjx-color-preview'});visual.style.backgroundColor=hex;visual.setAttribute('aria-label','Selected color '+hex);
      const code=n('strong',{},hex.toUpperCase());const cp=btn('Copy HEX','secondary');cp.addEventListener('click',()=>copy(hex.toUpperCase(),status));result.append(visual,code,cp);setSuccess(status,'Your selected color is '+label+'.');
    });
  }
  function mountPrize(panel){
    panel.append(paragraphs('Optional prize inventory draw: enter a prize and quantity on each line (for example, Sticker | 3). This is separate from the wheel above and does not modify saved wheel data.'));
    const label=n('label',{class:'swjx-field'});label.append(n('span',{},'Prize name | quantity'));
    const input=n('textarea',{rows:4,placeholder:'Sticker | 3\nGolden ticket | 1\nBonus point | 5'});input.value='Sticker | 3\nGolden ticket | 1\nBonus point | 5';label.append(input);panel.append(label);
    const actions=n('div',{class:'swjx-actions'}),setup=btn('Set inventory','secondary'),draw=btn('Draw from inventory');draw.disabled=true;actions.append(setup,draw);panel.append(actions);
    const{status,result}=statusAndResult(panel);let stock=[],record=[];
    function remaining(){return stock.reduce((sum,p)=>sum+p.qty,0);}
    setup.addEventListener('click',()=>{try{
      const rows=lines(input.value,60),items=rows.map(row=>{const m=row.match(/^(.*?)\s*\|\s*(\d+)$/);if(!m||!m[1].trim())throw new Error('Use Prize name | quantity on every line.');const qty=Number(m[2]);if(!Number.isSafeInteger(qty)||qty<1||qty>1000)throw new Error('Each quantity must be 1–1000.');return {name:m[1].trim(),qty};});
      const total=items.reduce((a,b)=>a+b.qty,0);if(!total||total>1000)throw new Error('Inventory must contain 1–1000 prize units.');
      if(new Set(items.map(x=>x.name.toLocaleLowerCase())).size!==items.length)throw new Error('Prize names must be unique.');
      if(record.length&&!scope.confirm('Reset the previous inventory draw and its on-screen results?'))return;
      stock=items;record=[];draw.disabled=false;clearResult(result);setSuccess(status,total+' prizes ready. Each remaining unit has equal probability.');
    }catch(e){setError(status,e.message);}});
    draw.addEventListener('click',()=>{
      const total=remaining();if(!total){draw.disabled=true;setError(status,'All prizes have been awarded.');return;}
      const pick=randint(total);let cumulative=0,chosen=null;
      for(const item of stock){cumulative+=item.qty;if(pick<cumulative){chosen=item;break;}}
      chosen.qty--;record.push(chosen.name);
      clearResult(result);result.append(n('div',{class:'swjx-reveal-label'},'Draw #'+record.length),n('h3',{},chosen.name),n('p',{},remaining()+' units remaining'));
      if(!remaining())draw.disabled=true;setSuccess(status,'Award recorded for this session. Refreshing will reset the optional inventory.');
    });
    input.addEventListener('input',()=>{stock=[];record=[];draw.disabled=true;clearResult(result);setError(status,'Inventory changed. Press Set inventory again before drawing.');});
  }
  function mountGift(panel){
    panel.append(paragraphs('Choose a recipient and an approximate budget tier to explore gift ideas, then edit the wheel above if you want to spin among your favorites. Prices are not verified.'));
    const form=n('div',{class:'swjx-formgrid'});
    const recipientField=n('label',{class:'swjx-field'});recipientField.append(n('span',{},'For whom?'));
    const recipient=n('select');[['anyone','Anyone'],['friend','Friend'],['partner','Partner'],['coworker','Coworker'],['family','Family']].forEach(([id,label])=>recipient.append(n('option',{value:id},label)));recipientField.append(recipient);
    const budgetField=n('label',{class:'swjx-field'});budgetField.append(n('span',{},'Budget guide'));
    const budget=n('select');[['small','Small'],['medium','Medium'],['large','Larger']].forEach(([id,label])=>budget.append(n('option',{value:id},label)));budgetField.append(budget);
    const go=btn('Show ideas');form.append(recipientField,budgetField);panel.append(form,go);
    const{status,result}=statusAndResult(panel);go.addEventListener('click',()=>{const suggestions=GIFTS[recipient.value][budget.value];cards(result,suggestions);setSuccess(status,'Use these as starting points; adjust for your recipient.');});
  }
  function mountCatalog(panel,tool){
    panel.append(paragraphs('This wheel now starts with actual '+(tool.id==='song-picker'?'song titles':tool.id==='book-picker'?'book titles':tool.id==='movie-picker'?'movie titles':'game names')+' instead of genre labels. Your existing saved choices are not replaced.'));
    const{status,result}=statusAndResult(panel);const preview=btn('See example choices','secondary');panel.insertBefore(preview,status);
    preview.addEventListener('click',()=>{cards(result,tool.labels);setSuccess(status,'Edit the wheel above to add your own list.');});
  }
  function mount(host,toolId){
    const tool=registry.get(toolId);if(!tool||tool.id==='home'||!FEATURES[toolId])return null;
    if(scope.SWJ_COMPANION_FLAGS && scope.SWJ_COMPANION_FLAGS[toolId]===false){host.hidden=true;return null;}
    host.replaceChildren();const mode=FEATURES[toolId];host.dataset.swjxTool=toolId;host.dataset.swjxMode=mode;
    // Wheel-first tools already work with the existing engine, editor and Save/Restore.
    // Their companion is deliberately empty to keep the primary interaction uncluttered.
    if(mode==='wheel'||mode==='secret-santa'){host.hidden=true;return null;}
    host.hidden=false;
    const titles={number:'Number Generator',letters:'Letter Lab',chores:'Chore Assignment',teams:'Copy your teams',prompt:'After your spin',timer:'Activity Timer',color:'Color Result Lab',prize:'Prize Inventory Draw',gift:'Gift Idea Finder',catalog:'Pick real titles'};
    const panel=shell(tool,titles[mode]||'More ways to play');host.append(panel);
    if(mode==='number')mountNumbers(panel);else if(mode==='letters')mountLetters(panel);else if(mode==='chores')mountChores(panel);else if(mode==='teams')mountTeams(panel);else if(mode==='prompt')mountPrompt(panel,toolId);else if(mode==='timer')mountTimer(panel,toolId);else if(mode==='color')mountColor(panel);else if(mode==='prize')mountPrize(panel);else if(mode==='gift')mountGift(panel);else if(mode==='catalog')mountCatalog(panel,tool);
    return panel;
  }
  const api=Object.freeze({FEATURES,mount,sampleNumbers});scope.SpinWheelCompanions=api;
  function autoMount(){const page=document.body.dataset.tool;const node=$('#wheel-app');if(!page||!node)return;
    const region=n('div',{class:'swjx-container',id:'swjx-companion'});node.insertAdjacentElement('afterend',region);mount(region,page);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',autoMount,{once:true});else autoMount();
})(typeof window!=='undefined'?window:globalThis);
