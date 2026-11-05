(() => {
 const toggle=document.querySelector('.menu-toggle'), nav=document.querySelector('#main-nav');
 function close(){if(!toggle)return;toggle.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}
 toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
 nav?.addEventListener('click',e=>{if(e.target.closest('a'))close();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true'){close();toggle.focus();}});
 document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))close();});
 const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
 // Track the existing outgoing calls to action without transmitting form contents.
 document.addEventListener('click',e=>{const link=e.target.closest('a');if(!link||typeof window.gtag!=='function')return;let event;if(link.href.includes('forms.gle'))event='inquiry_form_click';else if(link.href.includes('youtube.com'))event='youtube_click';else if(link.href.includes('x.com/nyanmayade'))event='social_follow_click';if(event)window.gtag('event',event,{page_location:location.href});});
})();
