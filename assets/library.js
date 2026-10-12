/* Filter tools/templates in place, without networking or personal data. */
(function(){'use strict';
  const search=document.getElementById('library-search');
  if(!search)return;
  const tabs=Array.from(document.querySelectorAll('[data-category-filter]'));
  const cards=Array.from(document.querySelectorAll('[data-library-card]'));
  const groups=Array.from(document.querySelectorAll('[data-library-group]'));
  const empty=document.getElementById('library-empty');
  let selected='All';
  function apply(){
    const term=search.value.trim().toLocaleLowerCase();let count=0;
    cards.forEach(card=>{
      const okCategory=selected==='All'||card.dataset.category===selected;
      const okTerm=(card.dataset.search||'').toLocaleLowerCase().includes(term);
      card.hidden=!(okCategory&&okTerm);if(!card.hidden)count++;
    });
    groups.forEach(group=>{group.hidden=!group.querySelector('[data-library-card]:not([hidden])');
      const counter=group.querySelector('[data-visible-count]');if(counter)counter.textContent=String(group.querySelectorAll('[data-library-card]:not([hidden])').length);
    });
    if(empty)empty.hidden=count!==0;
  }
  search.addEventListener('input',apply);
  tabs.forEach(tab=>tab.addEventListener('click',()=>{
    selected=tab.dataset.categoryFilter;
    tabs.forEach(b=>b.setAttribute('aria-pressed',String(b===tab)));
    apply();
  }));
  apply();
})();
