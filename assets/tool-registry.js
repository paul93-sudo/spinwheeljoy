/* SpinWheelJoy v1.3: single source of truth for routes, defaults, presentation and behaviors.
 * Public presets only. Never transmit personal wheel entries in a URL. */
(function (scope) {
  'use strict';
  const wheel=(id,slug,title,category,icon,description,labels,colors,accent,mode='wheel')=>({
    id,slug,route:slug?`tools/${slug}/`:'',title,category,icon,description,
    labels:Object.freeze(labels.slice()), colors:Object.freeze(colors.slice()), accent, mode
  });
  const defs=[
    wheel('home','','Spin the Wheel','Popular','✦','A colorful random wheel for everyday choices.',['Alex','Jamie','Taylor','Morgan','Casey','Sam'],['#546EF5','#FF6F85','#F6BE56','#22BFA9','#9170E5','#42A5F5'],'#5665F4'),
    wheel('names','random-name-picker','Random Name Picker','Classroom','👤','Pick a name fairly from your own list.',['Alex','Jamie','Taylor','Morgan','Casey','Sam'],['#5077F2','#9A74F2','#53C2CC','#F2B955','#FF7991','#35B89A'],'#5575F2'),
    wheel('yesno','yes-or-no-wheel','Yes or No Wheel','Decisions','⚖','Answer a playful yes-or-no question.',['Yes','No'],['#20B99A','#F96D78'],'#20B99A'),
    wheel('numbers','number-wheel','Random Number Wheel','Classroom','🔢','Pick a number from a chosen range.',Array.from({length:12},(_,i)=>String(i+1)),['#193E7B','#397DC4','#68C6EE','#2D9EAD','#5F90DB','#ACCDE9'],'#2C88CC'),
    wheel('students','student-picker','Random Student Picker','Classroom','🎓','Choose students, with no-repeat mode available.',['Avery','Jordan','Harper','Taylor','Charlie','Quinn','Riley','Skyler'],['#36A9DD','#69CDBD','#FFCC6A','#8588D6','#68AE7C','#E4A6AF'],'#36A9DD'),
    wheel('teams','team-generator','Random Team Generator','Groups','👥','Divide a list fairly into balanced groups.',['Alex','Jamie','Taylor','Morgan','Casey','Sam','Avery','Jordan'],['#3070CE','#FF925F','#22BFA0','#7C71E8','#F5C45D','#49B2CD'],'#3070CE','teams'),
    wheel('colors','color-wheel','Random Color Wheel','Creative','🎨','Get a random color for art or games.',['Red','Orange','Yellow','Green','Blue','Purple'],['#E95060','#FC9A3B','#F0C749','#26AA83','#3B83D9','#9165BE'],'#9165BE'),
    wheel('prize','prize-wheel','Prize Wheel','Games','🎁','Reveal a playful prize with a celebratory spin.',['Mystery gift','Free drink','Bonus point','Pick again','Golden ticket','Lucky star'],['#F5BD49','#E95B76','#3E66C9','#9F65D7','#31B8A0','#FB8C50'],'#D99B1A'),
    wheel('decision','decision-wheel','Decision Wheel','Decisions','🧭','Give your options a fair chance.',['Go outside','Movie night','Read a book','Board game','Bake cookies','Take a walk'],['#6073DD','#39B0BA','#ECA5B2','#9D89D6','#F5C866','#6CC6A3'],'#6D72DA'),
    wheel('truthdare','truth-or-dare-wheel','Truth or Dare Wheel','Games','🎭','Family-friendly fun prompts for game night.',['Tell a funny story','Do a silly dance','Describe a dream trip','Act like a cat','Share a fun fact','Sing a verse'],['#EC5D91','#8952C8','#E9A856','#45A7D3','#F0746B','#AC6EDC'],'#C050A8'),
    wheel('wouldrather','would-you-rather-wheel','Would You Rather Wheel','Games','💬','Start a conversation with an either-or question.',['Fly or be invisible?','Beach or mountains?','Read minds or teleport?','Pizza or pasta?','Travel through time?','Cats or dogs?'],['#9A79EA','#F3A8CE','#52A4DA','#E8BA6D','#7F93ED','#DD8ABE'],'#8E75DE'),
    wheel('rewards','classroom-reward-wheel','Classroom Reward Wheel','Classroom','🏆','Celebrate everyday classroom achievements.',['Extra art time','Pick a class song','Choose a game','Read with a friend','Sticker','Choose a seat'],['#F3C94F','#43B9AF','#5B9CE1','#F49B83','#9F85DB','#76C17C'],'#319EAD'),
    wheel('dinner','what-to-eat-wheel','What to Eat Wheel','Lifestyle','🍜','Decide what to eat tonight.',['Sushi','Tacos','Pasta','Pizza','Stir-fry','Salad'],['#F07753','#4B9A65','#E6B957','#BC6159','#73B5A0','#F39868'],'#D5744A'),
    wheel('chores','chore-wheel','Chore Wheel','Lifestyle','🧹','Share chores in a fun way.',['Set the table','Tidy the desk','Water plants','Fold laundry','Sweep floor','Feed pets'],['#4078A6','#A4CA79','#E4BD67','#789DAA','#E19A74','#6AB8A4'],'#438DA0'),
    wheel('dates','date-idea-wheel','Date Idea Wheel','Lifestyle','💕','Find a sweet date-night activity.',['Picnic','Cook together','Museum','Sunset walk','Board-game night','Cafe visit'],['#D77D9C','#AF7ABB','#F0B2A2','#855F9A','#E9C182','#D998B9'],'#BA6895'),
    wheel('challenges','random-challenge-wheel','Random Challenge Wheel','Games','⚡','Pick a fun group challenge.',['Tell a joke','10 jumping jacks','Draw with eyes closed','Sing a chorus','Mime an animal','Compliment someone'],['#FF765E','#F4BD52','#4BC2A3','#7966D8','#48A5D8','#EA83A5'],'#E87A57'),
    wheel('workout-picker','workout-picker','Workout Picker','Lifestyle','💪','A playful way to choose your next exercise.',['Walk for 10 minutes','Stretch for 5 minutes','Bodyweight squats','Gentle yoga','Dance break','Plank practice'],['#FF8858','#2EC8AE','#405FBD','#F6BF56','#4C9CCA','#D67691'],'#EF7E54'),
    wheel('vacation-picker','vacation-picker','Vacation Picker','Lifestyle','✈️','Spin for travel inspiration.',['Beach town','Mountain cabin','City break','National park','Road trip','Lakeside weekend'],['#2A9AAF','#E6C36C','#5EB4C7','#3779BB','#64B98A','#EF9B6B'],'#268CA8'),
    wheel('gift-idea-wheel','gift-idea-wheel','Gift Idea Wheel','Holidays','🎀','Discover a thoughtful gift category.',['Books','Art supplies','Cozy blanket','Experience ticket','Plant','Handmade gift'],['#CE6F87','#F0B963','#7D9BBE','#63B59F','#AA7FCB','#EA8A7B'],'#C36E8D'),
    wheel('letter-picker','letter-picker','Random Letter Picker','Classroom','🔤','Select a letter for spelling and word games.','ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),['#29527E','#5589B8','#80B4D8','#9DC7DF','#456FA9','#2D8EA2'],'#3C80B7'),
    wheel('feelings-wheel','feelings-wheel','Feelings Wheel','Classroom','💛','Pick a feeling to discuss and reflect upon.',['Happy','Calm','Curious','Excited','Worried','Proud','Hopeful','Grateful'],['#F3CA5B','#84C5A7','#76A5D4','#F1A177','#B1A0DA','#F09DAD'],'#B48AD5'),
    wheel('icebreaker-wheel','icebreaker-wheel','Icebreaker Wheel','Groups','🗣️','Start a conversation with an easy question.',['Favorite weekend?','Dream destination?','A hidden talent?','Favorite snack?','Morning or night?','Best book lately?'],['#3AB1BD','#9B8CDC','#F0BF62','#6BC69B','#739CE4','#F49B9E'],'#3AAAB6'),
    wheel('movie-picker','movie-picker','Movie Night Picker','Lifestyle','🎬','Decide what to watch together.',['Comedy','Animation','Adventure','Mystery','Documentary','Drama'],['#304C7C','#5F63A4','#A57DC5','#EAA66F','#45689C','#6E9DBE'],'#545EAE'),
    wheel('baby-name-picker','baby-name-picker','Baby Name Picker','Lifestyle','🍼','Explore baby name ideas with a playful spin.',['Avery','Rowan','Mia','Elliot','Luna','Theo','Ivy','Noah'],['#F0B7C8','#A6C6E8','#D4B7E7','#9DD7C6','#E9C88A','#F3A9A6'],'#B98AC9'),
    wheel('pet-name-picker','pet-name-picker','Pet Name Picker','Lifestyle','🐾','Try fun pet name ideas.',['Mochi','Pepper','Sunny','Biscuit','Clover','Luna','Bean','Ollie'],['#A9D4A0','#F4C46E','#DCA6A0','#78B9B8','#C1ACDB','#E6B789'],'#76A987'),
    wheel('board-game-picker','board-game-picker','Board Game Picker','Games','🎲','Choose a game for the group.',['Strategy game','Card game','Co-op game','Word game','Party game','Puzzle game'],['#EC8B57','#5A7BCE','#F2BB5E','#38B69C','#B17EBB','#6FA9D3'],'#E68057'),
    wheel('song-picker','song-picker','Song Picker','Creative','🎵','Pick a music style or song prompt.',['Pop','Jazz','Rock','Instrumental','Classical','Dance','Folk','Indie'],['#6D6DD1','#E16E9D','#4D9EDD','#D89EED','#40B6C8','#F6B774'],'#916BCE'),
    wheel('brain-break-wheel','brain-break-wheel','Brain Break Wheel','Classroom','🧠','Try a short movement or thinking break.',['Stretch your arms','Take five breaths','Name 3 colors','Stand and shake','Draw a star','Look out the window'],['#6ECABB','#F0C662','#88A3E5','#E9A79E','#A49DDC','#60B5D9'],'#63B5AE'),
    wheel('secret-santa','secret-santa','Secret Santa Drawer','Holidays','🎄','Create local gift assignments without anyone gifting themselves.',['Alex','Jamie','Taylor','Morgan','Casey','Sam'],['#1E876E','#D85B60','#E8B759','#347CA4','#BB6D75','#5DA87C'],'#1E876E','secret-santa'),
    wheel('book-picker','book-picker','Book Picker','Lifestyle','📚','Pick a genre for your next read.',['Mystery','Fantasy','Biography','Romance','Science fiction','History'],['#997458','#D5A877','#7C9B8F','#B67E85','#9C93C9','#6D8897'],'#8F785F'),
    wheel('country-picker','country-picker','Country Picker','Classroom','🌎','Pick a country for geography games.',['Canada','Japan','Brazil','Kenya','Italy','Vietnam','Australia','Mexico'],['#2878A6','#4EAEB3','#56B18B','#E8BD60','#559ACB','#7D8FC6'],'#3B94B6')
  ];
  const byId=Object.freeze(Object.fromEntries(defs.map(d=>[d.id,Object.freeze(d)])));
  const bySlug=Object.freeze(Object.fromEntries(defs.filter(d=>d.slug).map(d=>[d.slug,d])));
  const categories=['Classroom','Decisions','Games','Groups','Lifestyle','Creative','Holidays'];
  function get(id){return byId[id]||null;}
  function getBySlug(slug){return bySlug[slug]||null;}
  function resolvedColors(id,dark){
    const d=get(id)||get('home');
    if(!dark)return d.colors;
    // More saturated accents on a dark canvas; preserve hue identity.
    return d.colors.map(hex=>{const n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;
      return '#'+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v*.96+6))).toString(16).padStart(2,'0')).join('');});
  }
  const api=Object.freeze({all:Object.freeze(defs),byId,bySlug,categories,get,getBySlug,resolvedColors});
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  scope.SpinWheelTools=api;
})(typeof window!=='undefined'?window:globalThis);
