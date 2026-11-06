(() => {
 const toggle=document.querySelector('.menu-toggle'), nav=document.querySelector('#main-nav');
 function close(){if(!toggle)return;toggle.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}
 toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
 nav?.addEventListener('click',e=>{if(e.target.closest('a'))close();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true'){close();toggle.focus();}});
 document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))close();});
 const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
 // Record interactions, never form contents or visitor-entered query strings.
 const track=(event,params={})=>{if(typeof window.gtag==='function')window.gtag('event',event,params);};
 document.addEventListener('click',e=>{
  const link=e.target.closest('a');if(!link)return;
  const url=new URL(link.href,location.href);let event;
  if(url.hostname==='forms.gle')event='inquiry_form_click';
  else if(['youtube.com','www.youtube.com'].includes(url.hostname))event='youtube_click';
  else if(url.hostname==='x.com'&&url.pathname.startsWith('/nyanmayade'))event=url.pathname.includes('/status/')?'social_post_click':'social_profile_click';
  else if(url.origin===location.origin&&url.pathname.endsWith('/contact.html')&&!location.pathname.endsWith('/contact.html'))event='inquiry_page_click';
  if(event)track(event,{source_page:location.pathname});
 });
 document.querySelectorAll('video').forEach(video=>{
  const videoName=video.getAttribute('aria-labelledby')||video.querySelector('source')?.getAttribute('src')||video.getAttribute('src')||'site-video';
  let started=false,completed=false;
  video.addEventListener('playing',()=>{if(!started){started=true;track('portfolio_video_start',{video_name:videoName});}});
  video.addEventListener('ended',()=>{if(!completed){completed=true;track('portfolio_video_complete',{video_name:videoName});}});
 });
})();
