/* SpinWheelJoy v0.4: winner celebration and click-safe Web Audio, no dependencies. */
(function(scope){
 'use strict';
 let ctx=null; let lastTick=0; let animId=0; let particles=[]; let startedAt=0; let confettiCtx=null;
 const reduced=()=>!!(scope.matchMedia&&scope.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const colors=['#315fe9','#ffbf4f','#fc7c86','#6fcfbd','#b0a2f7','#ff9a5c','#f5d55a'];
 let settings=()=>({sound:true,volume:0.42,celebration:true,fun:false});
 function configure(getter){ if(typeof getter==='function')settings=getter; }
 function prepareAudio(){
   if(!settings().sound)return;
   try{const AudioCtx=scope.AudioContext||scope.webkitAudioContext;if(!AudioCtx)return;
     if(!ctx)ctx=new AudioCtx();
     if(ctx.state==='suspended')ctx.resume().catch(()=>{});
   }catch(e){}
 }
 function note(freq,duration,offset,level,type){
   try{if(!ctx||ctx.state!=='running'||!settings().sound)return;
     const volume=Math.max(0,Math.min(1,Number(settings().volume) || 0));
     if(volume===0)return;
     const t=ctx.currentTime+Math.max(0,offset||0);
     const osc=ctx.createOscillator();const gain=ctx.createGain();
     osc.type=type||'triangle';osc.frequency.setValueAtTime(freq,t);
     gain.gain.setValueAtTime(0.0001,t);
     gain.gain.exponentialRampToValueAtTime(Math.max(.0002,level*volume),t+.008);
     gain.gain.exponentialRampToValueAtTime(.0001,t+duration);
     osc.connect(gain);gain.connect(ctx.destination);osc.start(t);osc.stop(t+duration+.018);
   }catch(e){}
 }
 function tick(){
   if(!settings().sound)return;
   const now=performance.now();if(now-lastTick<67)return;lastTick=now;
   note(890,.042,0,.10,'triangle');note(560,.045,.006,.046,'sine');
 }
 function winSound(){
   if(!settings().sound)return;
   [[659,0,.19],[784,.095,.21],[988,.21,.24],[1318,.34,.39]].forEach(([f,offset,len])=>note(f,len,offset,.12,'sine'));
 }
 function stopConfetti(){if(animId)cancelAnimationFrame(animId);animId=0;particles=[];
   const c=document.getElementById('celebration-canvas');if(c){const x=c.getContext('2d');x&&x.clearRect(0,0,c.width,c.height);}}
 function celebrate(){
   stopConfetti();if(reduced()||!settings().celebration)return;
   const c=document.getElementById('celebration-canvas');if(!c)return;
   const dpr=Math.min(devicePixelRatio||1,2);
   const rect=()=>({w:Math.max(320,innerWidth),h:Math.max(400,innerHeight)});
   let {w,h}=rect();c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);c.style.width=w+'px';c.style.height=h+'px';
   confettiCtx=c.getContext('2d');const n=settings().fun?150:88;
   particles=Array.from({length:n},(_,i)=>{
      const ribbon=i%5===0;
      return {x:Math.random()*w,y:-Math.random()*h*.8-12, vx:(Math.random()-.5)*(ribbon?1.7:3.0), vy:2.2+Math.random()*3.2, sz:(ribbon?12:5)+Math.random()*(ribbon?17:7), spin:Math.random()*6.28, drift:Math.random()*6.28, col:colors[i%colors.length],ribbon};
   });
   startedAt=performance.now();let last=startedAt;
   function frame(t){
      const dt=Math.min(33,t-last)/16.7;last=t;
      const elapsed=t-startedAt;
      confettiCtx.clearRect(0,0,c.width,c.height);confettiCtx.save();confettiCtx.scale(dpr,dpr);
      particles.forEach(p=>{
         p.x+=(p.vx+Math.sin(p.drift+=.04)*.24)*dt;p.y+=p.vy*dt;p.spin+=.06*dt;
         confettiCtx.save();confettiCtx.translate(p.x,p.y);confettiCtx.rotate(p.spin);
         confettiCtx.fillStyle=p.col;confettiCtx.globalAlpha=Math.min(1,(2750-elapsed)/500);
         if(p.ribbon){
           confettiCtx.beginPath();confettiCtx.moveTo(-p.sz*.44,-p.sz*.5);confettiCtx.bezierCurveTo(p.sz*.35,-p.sz*.85,-p.sz*.35,p.sz*.8,p.sz*.44,p.sz*.5);
           confettiCtx.lineWidth=4;confettiCtx.strokeStyle=p.col;confettiCtx.stroke();
         }else confettiCtx.fillRect(-p.sz/2,-p.sz/4,p.sz,p.sz*.47);
         confettiCtx.restore();
      });confettiCtx.restore();
      if(elapsed<2700)animId=requestAnimationFrame(frame);else stopConfetti();
   }animId=requestAnimationFrame(frame);
 }
 function showWinner(label,context,options){
   const dlg=document.getElementById('winner-dialog');if(!dlg)return;
   const contexts={
     prize:['YOUR PRIZE IS','A lucky pick, just for fun'],
     decision:['THE WHEEL CHOSE','Your next move is here'],
     truthdare:['YOUR CHALLENGE','Game on!'],
     wouldrather:['WOULD YOU RATHER...','Your conversation starter'],
     rewards:['TODAY\'S CLASS REWARD','Make the moment count'],
     dinner:['TONIGHT\'S PICK','Good food, good mood'],
     chores:['YOUR NEXT TASK','Let\'s get it done'],
     dates:['YOUR DATE IDEA','Make a little memory'],
     yesno:['THE ANSWER IS','The wheel has spoken'],
     numbers:['YOUR NUMBER IS','A random result'],
     colors:['YOUR COLOR IS','Get creative'],
     students:['TODAY\'S PICK','Your classroom selection'],
     home:['WE HAVE A WINNER!','A little joy in every spin'],
     names:['WE HAVE A WINNER!','A little joy in every spin']
   };
   Object.assign(contexts, {
      'letter-picker':['YOUR LETTER IS','Keep the word game going'],
      'workout-picker':['TODAY’S MOVEMENT','A little movement, a lot of joy'],
      'vacation-picker':['YOUR NEXT ADVENTURE','Every journey starts somewhere'],
      'gift-idea-wheel':['GIFT IDEA','A thoughtful little surprise'],
      'feelings-wheel':['LET’S TALK ABOUT','A moment to check in'],
      'icebreaker-wheel':['ICEBREAKER QUESTION','A conversation worth having'],
      'movie-picker':['MOVIE NIGHT PICK','Lights, camera, action'],
      'baby-name-picker':['NAME IDEA','A sweet possibility'],
      'pet-name-picker':['PET NAME IDEA','A name with personality'],
      'board-game-picker':['GAME NIGHT PICK','Gather the group'],
      'song-picker':['MUSIC PICK','Let the music play'],
      'brain-break-wheel':['BRAIN BREAK','Time for a little reset'],
      'book-picker':['NEXT READ','Open a new chapter'],
      'country-picker':['COUNTRY PICK','Explore somewhere new'],
      'secret-santa':['SECRET SANTA','Shh... keep it a surprise'],
      'yes-or-no-wheel':['THE ANSWER IS','The wheel has spoken'],
      'prize-wheel':['YOU WON','Enjoy your prize'],
      'date-idea-wheel':['DATE NIGHT','Make it special'],
      'what-to-eat-wheel':['DINNER DECIDED','Bon appétit'],
      'truth-or-dare-wheel':['YOUR CHALLENGE','No backing out now'],
      'color-wheel':['YOUR COLOR','A splash of inspiration']
   });
   // v1.3.3: Per-tool winner icons and accent colors
   const winnerThemes = {
      'movie-picker':{icon:'🎬',color:'#c41e3a'},
      'secret-santa':{icon:'🎄',color:'#c41e3a'},
      'workout-picker':{icon:'💪',color:'#ff6b35'},
      'vacation-picker':{icon:'✈️',color:'#00bcd4'},
      'gift-idea-wheel':{icon:'🎁',color:'#e91e63'},
      'song-picker':{icon:'🎵',color:'#9b59b6'},
      'book-picker':{icon:'📚',color:'#800020'},
      'pet-name-picker':{icon:'🐾',color:'#ff8c69'},
      'board-game-picker':{icon:'🎲',color:'#8b0000'},
      'brain-break-wheel':{icon:'🧠',color:'#ff0000'},
      'baby-name-picker':{icon:'🍼',color:'#ff6b9d'},
      'country-picker':{icon:'🌎',color:'#2d6a4f'},
      'feelings-wheel':{icon:'💛',color:'#ff0000'},
      'icebreaker-wheel':{icon:'💬',color:'#f39c12'},
      'letter-picker':{icon:'🔤',color:'#ff0000'},
      'prize-wheel':{icon:'🏆',color:'#ffd700'},
      'date-idea-wheel':{icon:'💕',color:'#ff69b4'},
      'what-to-eat-wheel':{icon:'🍜',color:'#ff6f00'},
      'yes-or-no-wheel':{icon:'⚖️',color:'#00c853'},
      'truth-or-dare-wheel':{icon:'🎭',color:'#6a1b9a'},
      'color-wheel':{icon:'🎨',color:'#ff0000'},
      'home':{icon:'🏆',color:'#5665f4'}
   };
   const theme = winnerThemes[context] || winnerThemes.home;
   const iconEl = document.getElementById('winner-icon');
   if (iconEl) { iconEl.textContent = theme.icon; }
   const eyebrowEl = document.getElementById('winner-eyebrow');
   if (eyebrowEl) { eyebrowEl.style.color = theme.color; }
   const [title,subtitle]=contexts[context]||contexts.home;
   document.getElementById('winner-eyebrow').textContent=title;
   document.getElementById('winner-name').textContent=String(label);
   document.getElementById('winner-subtitle').textContent=subtitle;
   document.getElementById('winner-remove').hidden=!!(options&&(options.preview||options.noRepeat));
   document.getElementById('winner-spin-again').textContent=options&&options.preview?'Spin for real':'Spin again';
   if(!dlg.open)dlg.showModal();
   document.getElementById('winner-spin-again').focus({preventScroll:true});
   celebrate();
 }
 function closeWinner(){const dlg=document.getElementById('winner-dialog');if(dlg&&dlg.open)dlg.close();stopConfetti();}
 function bindDialog({onAgain,onRemove,onCopy}){
   const dlg=document.getElementById('winner-dialog');if(!dlg)return;
   dlg.addEventListener('close',stopConfetti);
   dlg.addEventListener('click',e=>{if(e.target===dlg)closeWinner();});
   document.getElementById('winner-close').addEventListener('click',closeWinner);
   document.getElementById('winner-dismiss').addEventListener('click',closeWinner);
   document.getElementById('winner-spin-again').addEventListener('click',()=>{closeWinner();onAgain&&onAgain();});
   document.getElementById('winner-remove').addEventListener('click',()=>{closeWinner();onRemove&&onRemove();});
   document.getElementById('winner-copy').addEventListener('click',()=>{onCopy&&onCopy(document.getElementById('winner-name').textContent);});
 }
 scope.SpinWheelExperience={configure,prepareAudio,tick,winSound,showWinner,closeWinner,bindDialog,stopConfetti};
})(window);
