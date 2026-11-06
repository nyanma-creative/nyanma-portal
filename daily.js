(() => {
 'use strict';
 const data=window.NYANMA_DAYS||[];if(!data.length)return;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 // Use explicit parts so the visitor's locale cannot change month/day order.
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Tokyo',month:'numeric',day:'numeric'}).formatToParts(new Date());
 const today=['month','day'].map(type=>Number(parts.find(p=>p.type===type).value));
 const picks=document.getElementById('daily-picks');
 if(picks){
  // Leap-year calendar keeps Feb 29 valid; circular distance handles New Year.
  const ordinal=(m,d)=>(Date.UTC(2000,m-1,d)-Date.UTC(2000,0,1))/86400000;
  const now=ordinal(...today);
  const distance=x=>{const d=Math.abs(ordinal(x.month,x.day)-now);return Math.min(d,366-d);};
  const rank=x=>x.month===today[0]?(x.day===today[1]?0:1):2;
  const selected=[...data].sort((a,b)=>rank(a)-rank(b)||distance(a)-distance(b)||a.id.localeCompare(b.id)).slice(0,3);
  picks.innerHTML=selected.map(x=>`<a href="kyou.html?art=${encodeURIComponent(x.id)}"><img src="${esc(x.src)}" alt="${esc(x.title)}" loading="lazy" width="400" height="533"><span>${x.month}.${String(x.day).padStart(2,'0')} / ${esc(x.title)}</span></a>`).join('');
  const label=document.getElementById('daily-label');
  if(label)label.textContent=rank(selected[0])===0?'今日と同じ日付の作品を先頭にご紹介':rank(selected[0])===1?`${today[0]}月の作品を中心に · 過去のイラストから`:'今日に近い日付の作品から';
  const monthLink=document.getElementById('daily-month-link');
  if(monthLink&&data.some(x=>x.month===today[0])){monthLink.href=`kyou.html?month=${today[0]}`;monthLink.textContent=`${today[0]}月のイラストを見る ↗`;}
 }
 const grid=document.getElementById('art-grid');if(!grid)return;
 let favorites=new Set(),storageAvailable=true;
 try{const saved=JSON.parse(localStorage.getItem('nyanma-favorites')||'[]');if(Array.isArray(saved))favorites=new Set(saved.filter(v=>typeof v==='string'));}catch{storageAvailable=false;}
 const month=document.getElementById('art-month'),search=document.getElementById('art-search'),favButton=document.getElementById('art-favorites'),more=document.getElementById('art-more'),dialog=document.getElementById('art-dialog');
 let theme='all',onlyFavorites=false,limit=18,filtered=[],current=null;
 const params=new URLSearchParams(location.search);if([...month.options].some(o=>o.value===params.get('month')))month.value=params.get('month');
 function matches(){const query=search.value.trim().normalize('NFKC').toLowerCase();return data.filter(x=>(month.value==='all'||x.month===Number(month.value))&&(theme==='all'||x.theme===theme)&&(!onlyFavorites||favorites.has(x.id))&&(!query||`${x.title} ${x.month}月${x.day}日`.normalize('NFKC').toLowerCase().includes(query)));}
 function render(reset=true){if(reset)limit=18;filtered=matches();grid.innerHTML=filtered.slice(0,limit).map(x=>`<article class="art-card"><button class="art-open" data-id="${esc(x.id)}" aria-label="${x.month}月${x.day}日 ${esc(x.title)}を拡大"><img src="${esc(x.src)}" alt="${esc(x.title)}のイラスト" width="400" height="533" loading="lazy"><span>${String(x.month).padStart(2,'0')}.${String(x.day).padStart(2,'0')}</span><strong>${esc(x.title)}</strong></button><button class="art-fav" data-id="${esc(x.id)}" aria-label="${esc(x.title)}のお気に入り" aria-pressed="${favorites.has(x.id)}">${favorites.has(x.id)?'♥ 保存済み':'♡ お気に入り'}</button></article>`).join('');document.getElementById('art-count').textContent=`${filtered.length}作品 / ${Math.min(limit,filtered.length)}作品を表示`;document.getElementById('art-empty').hidden=!!filtered.length;more.hidden=filtered.length<=limit;}
 function save(id){favorites.has(id)?favorites.delete(id):favorites.add(id);try{localStorage.setItem('nyanma-favorites',JSON.stringify([...favorites]));storageAvailable=true;}catch{storageAvailable=false;}render(false);if(current)updateDialog();if(!storageAvailable){document.querySelector('.archive-note').textContent='このブラウザーでは保存できないため、お気に入りはこのページを開いている間だけ有効です。';}}
 function updateDialog(){document.getElementById('art-title').textContent=`${current.month}月${current.day}日 / ${current.title}`;const img=document.getElementById('art-full');img.src=current.full;img.alt=current.title;const saveButton=document.getElementById('art-save');saveButton.textContent=favorites.has(current.id)?'♥ お気に入りに保存済み':'♡ お気に入りに保存';saveButton.setAttribute('aria-pressed',String(favorites.has(current.id)));const index=filtered.indexOf(current);document.getElementById('art-prev').disabled=index<=0;document.getElementById('art-next').disabled=index<0||index>=filtered.length-1;document.getElementById('art-feedback').textContent=storageAvailable?'お気に入りはこのブラウザーに保存されます。':'保存できないため、このページを開いている間だけ有効です。';}
 function open(id){current=data.find(x=>x.id===id);if(!current)return;updateDialog();dialog.showModal();document.documentElement.style.overflow='hidden';}
 function move(step){const next=filtered[filtered.indexOf(current)+step];if(next){current=next;updateDialog();}}
 grid.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.classList.contains('art-fav')){const id=b.dataset.id;save(id);grid.querySelector(`.art-fav[data-id="${CSS.escape(id)}"]`)?.focus();}else open(b.dataset.id);});
 document.getElementById('art-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{document.documentElement.style.overflow='';if(current)grid.querySelector(`.art-open[data-id="${CSS.escape(current.id)}"]`)?.focus();});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 document.getElementById('art-prev').addEventListener('click',()=>move(-1));document.getElementById('art-next').addEventListener('click',()=>move(1));document.getElementById('art-save').addEventListener('click',()=>save(current.id));dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')move(-1);if(e.key==='ArrowRight')move(1);});
 month.addEventListener('change',()=>render());search.addEventListener('input',()=>render());
 favButton.addEventListener('click',()=>{onlyFavorites=!onlyFavorites;favButton.setAttribute('aria-pressed',String(onlyFavorites));render();});
 document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{theme=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('is-active',x===b);x.setAttribute('aria-pressed',String(x===b));});render();}));
 document.getElementById('art-reset').addEventListener('click',()=>{month.value='all';search.value='';onlyFavorites=false;favButton.setAttribute('aria-pressed','false');document.querySelector('[data-filter="all"]').click();});
 more.addEventListener('click',()=>{const oldLimit=limit;limit+=18;render(false);grid.querySelectorAll('.art-open')[oldLimit]?.focus();});
 render();const initial=data.find(x=>x.id===params.get('art'));if(initial){month.value=String(initial.month);render();open(initial.id);}
})();
