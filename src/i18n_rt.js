/* idiomas: español (original), inglés y portugués. Las traducciones viajan dentro de la página y se aplican al cargar */
(function(){
  var LANGS=['es','en','pt'],L='es';
  try{var q=new URLSearchParams(location.search).get('lang');if(q&&LANGS.indexOf(q)>=0){L=q;try{localStorage.setItem('pap.lang',q)}catch(e){}try{window.name='pap.lang='+q}catch(e){}}
    else{var s=null;try{s=localStorage.getItem('pap.lang')}catch(e){}if(!s){var wn=String(window.name||'').match(/pap\.lang=(es|en|pt)/);if(wn)s=wn[1]}
      if(s&&LANGS.indexOf(s)>=0)L=s;else{var n=String(navigator.language||'es').toLowerCase();L=n.indexOf('pt')===0?'pt':n.indexOf('es')===0?'es':'en'}}}catch(e){}
  window.__LANG=L;document.documentElement.lang=L==='pt'?'pt-BR':L;
  function load(D){var M=new Map();if(L==='es'||!D)return M;var T=D[L]||[];for(var i=0;i<D.src.length;i++){if(T[i])M.set(D.src[i],T[i])}return M}
  var M=load(window.__I18N),PM=load(window.__I18N_PH);
  var O=(window.__I18N_OVR||{})[L]||{};for(var k in O)M.set(k,O[k]);
  window._t=function(s){if(L==='es'||typeof s!=='string')return s;var v=M.get(s);return v==null?s:v};
  /* marcadores entre corchetes dentro de los prompts en inglés: [sujeto] -> [subject] */
  window._tPh=function(s){if(L==='es'||typeof s!=='string'||s.indexOf('[')<0)return s;return s.replace(/\[([^\]\n]{2,80})\]/g,function(m,x){var v=PM.get(x);return v?'['+v+']':m})};
  var SKIP={id:1,demo:1,ch:1,cat:1,k:1,img:1,alias:1,icon:1,u:1,url:1},PH={code:1,tpl:1,pre:1,post:1,block:1,en:1};
  window._tWalk=function(o){if(L==='es')return;var ES=window.__ES||{},seen=new Set();(function w(o,ph){if(!o||typeof o!=='object'||seen.has(o))return;seen.add(o);
    var tr=function(v,isPh){if(!isPh)return window._t(v);var n=window._tPh(v);if(n!==v&&ES[v]&&!ES[n])ES[n]=ES[v];return n};
    if(Array.isArray(o)){for(var i=0;i<o.length;i++){var v=o[i];if(typeof v==='string')o[i]=tr(v,ph);else w(v,ph)}}
    else for(var k in o){if(SKIP[k])continue;var v=o[k],p=!!PH[k];if(typeof v==='string')o[k]=tr(v,p);else if(v&&typeof v==='object')w(v,p)}})(o,false)};
  /* textos fijos de la página */
  function dom(root){if(L==='es')return;var tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),n,list=[];while(n=tw.nextNode())list.push(n);
    list.forEach(function(n){var p=n.parentNode;if(!p||/^(SCRIPT|STYLE|CODE|TEXTAREA)$/.test(p.nodeName))return;var raw=n.nodeValue,key=raw.trim().replace(/\s+/g,' ');if(!key)return;var v=M.get(key);
      if(v!=null){var a=raw.match(/^\s*/)[0],b=raw.match(/\s*$/)[0];n.nodeValue=a+v+b}});
    root.querySelectorAll('[placeholder],[title],[aria-label],[alt]').forEach(function(el){['placeholder','title','aria-label','alt'].forEach(function(a){var v=el.getAttribute(a);if(v&&M.has(v))el.setAttribute(a,M.get(v))})})}
  dom(document.body);if(M.has(document.title))document.title=M.get(document.title);
  /* selector de idioma: recarga la página en el idioma elegido, en el mismo lugar */
  var sel=document.getElementById('lang');if(sel){sel.value=L;sel.addEventListener('change',function(){var v=sel.value;try{localStorage.setItem('pap.lang',v)}catch(e){}try{window.name='pap.lang='+v}catch(e){}
    var framed=false;try{framed=window.top!==window}catch(e){framed=true}if(framed){location.reload();return}var u=new URL(location.href);u.searchParams.set('lang',v);location.href=u.toString()})}
})();
