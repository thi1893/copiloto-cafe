import {M, METHODS, PALETTES, R} from './data.js';
import {$, clamp, fmtT, parseNum, r1, tf, uid} from './util.js';
import {S, save} from './store.js';
import {baseRatio, burrK, burrNow, calc, ctxFromBrew, doseStep, gStore, makeCtx, memKey, ratioStep} from './recipe.js';
import {audio, audioSession, audioStarted, buzz, chime, keepAwake, quiet, snd} from './feedback.js';
import {UI, nav} from './ui.js';
import {elapsedMs, pourState, stepIdx} from './engine.js';
import {vGuide} from './views/guide.js';
import {vHome} from './views/home.js';
import {vMethod} from './views/method.js';
import {vPrep} from './views/prep.js';
import {vBrew} from './views/brew.js';
import {vDone} from './views/done.js';
import {histItems, vHistory} from './views/history.js';
import {vOnboard} from './views/onboard.js';
import {sheetHtml} from './views/sheets.js';
import {confirmHtml, tabbar, toastHtml} from './views/chrome.js';

/* Ponto de entrada: preparo em andamento, navegação, render e ações. */
const app=document.getElementById('app');

/* ---------- preparo ---------- */
function startBrew(){
  audio();
  const ctx={...UI.ctx};
  S.active={ctx,calc:calc(ctx),startedAt:Date.now(),pausedAt:null,pausedTotal:0,floor:0};
  save();UI.lastIdx=0;UI.lastTick='';UI.flash=false;keepAwake(true);snd.start();render();
}
function finishBrew(sec){
  const a=S.active;if(!a)return;
  const ctx=a.ctx,r=R[ctx.recipeId],c=a.calc,last=c.steps[stepIdx(a,elapsedMs(a))];
  const b={id:uid(),at:Date.now(),recipeId:r.id,method:r.method,
    dose:ctx.dose,ratio:ctx.ratio,water:c.water,ice:c.ice,grinder:ctx.grinder,burr:burrNow(),time:r.untimed?null:(a.shotSec??Math.round(sec)),
    judge:a.shotSec!=null||!!(last&&(last.drain||last.shot)),rating:0,taste:null,note:''};
  S.brews.unshift(b);if(S.brews.length>400)S.brews.length=400;
  const k=memKey(r.id),m=S.mem[k]||(S.mem[k]={});m.dose=ctx.dose;m.ratio=ctx.ratio;m.g=gStore(ctx.grinder,r);
  S.methodLast[r.method]=r.id;S.active=null;save();keepAwake(false);snd.done();quiet();
  UI.done=b.id;UI.applied={};UI.noteOpen=false;nav.stack=[{v:'home'}];render();window.scrollTo(0,0);
}
function tick(){
  const a=S.active;if(!a)return;
  const el=elapsedMs(a),st=a.calc.steps,i=stepIdx(a,el),s=st[i],r=R[a.ctx.recipeId];
  if(s.end){finishBrew(s.t);return}
  if(i!==UI.lastIdx){UI.lastIdx=i;UI.lastPour=i+':1';UI.flash=true;if(!a.pausedAt)snd.step();render();return}
  const ps=pourState(s,el);
  if(ps){ // ritmo do despejo: tempo que falta e peso esperado agora
    const key=i+':'+(ps.pouring?1:0);
    if(key!==UI.lastPour){const ended=UI.lastPour===i+':1'&&!ps.pouring;UI.lastPour=key;if(ended){if(!a.pausedAt)snd.halt();render();return}}
    const nx=st[i+1],L=$('#bpLeft'),N=$('#bpNow'),B=$('#bpBar');
    if(L)L.textContent=ps.pouring?fmtT(ps.left):(nx&&nx.t!=null?fmtT(Math.ceil(nx.t-el/1000)):'✓');
    if(N)N.textContent=(ps.pouring?'≈ ':'')+ps.now+' g';
    if(B)B.style.width=(ps.k*100).toFixed(1)+'%';
  }
  const tEl=$('#bTime');if(tEl)tEl.textContent=tf(r,el/1000);
  const n=st[i+1],inEl=$('#bIn');
  if(n&&n.t!=null&&inEl&&!(s.manual||s.drain||s.shot)){
    const rem=Math.ceil((n.t*1000-el)/1000);inEl.textContent='em '+fmtT(rem);
    const soon=rem<=3&&rem>=1;inEl.classList.toggle('soon',soon);
    const key=i+'_'+rem;if(soon&&S.prefs.countdown&&!a.pausedAt&&UI.lastTick!==key){UI.lastTick=key;snd.tick()}
  }
  const bar=$('#bBar');if(bar){const endS=r.time?r.time[1]:(st[st.length-1].t||60);bar.style.width=Math.min(100,el/10/endS)+'%'}
}
setInterval(tick,200);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&S.active){keepAwake(true);if(S.prefs.sound)audio();UI.lastIdx=-2;tick()}});
/* O iPhone interrompe o áudio ao bloquear a tela; qualquer toque durante o preparo o retoma. */
document.addEventListener('pointerdown',()=>{if(S.active&&S.prefs.sound&&audioStarted())audio()},{passive:true});

/* ---------- navegação ---------- */
function go(v,p={}){nav.stack.push({v,...p});try{history.pushState({d:nav.stack.length},'')}catch(e){}render();window.scrollTo(0,0)}
function back(){if(nav.stack.length>1){nav.stack.pop();render();window.scrollTo(0,0)}}
window.addEventListener('popstate',()=>{
  if(S.active||UI.done){try{history.pushState({},'')}catch(e){}return}
  if(UI.sheet){UI.sheet=null;render();return}
  if(nav.stack.length>1){nav.stack.pop();render()}
});
function tab(v){nav.stack=[{v}];UI.sheet=null;render();window.scrollTo(0,0)}
export function openPrep(ctx){if(!ctx)return;UI.ctx=ctx;UI.ratioOpen=false;go('prep')}
function toast(msg,undo){UI.toast={msg,undo,id:uid()};const id=UI.toast.id;render();setTimeout(()=>{if(UI.toast&&UI.toast.id===id){UI.toast=null;render()}},5000)}

/* ---------- render ---------- */
function applyTheme(){
  const t=S.prefs.theme,pal=PALETTES[S.prefs.palette]?S.prefs.palette:'cinza',{light,dark}=PALETTES[pal],root=document.documentElement;
  if(t==='auto')root.removeAttribute('data-theme');else root.dataset.theme=t;
  if(pal==='cinza')root.removeAttribute('data-palette');else root.dataset.palette=pal;
  const a=document.getElementById('tcLight'),b=document.getElementById('tcDark');
  if(a)a.content=t==='dark'?dark:light;if(b)b.content=t==='light'?light:dark;
}
function render(){
  applyTheme();
  const top=nav.stack[nav.stack.length-1];let html,tabs=false;
  if(!S.onboarded)html=vOnboard();
  else if(S.active)html=vBrew();
  else if(UI.done)html=vDone();
  else{
    if(top.v==='prep'&&!UI.ctx)nav.stack=[{v:'home'}];
    const t=nav.stack[nav.stack.length-1];
    html=t.v==='history'?vHistory():t.v==='guide'?vGuide(t.g):t.v==='method'?vMethod(t.m):t.v==='prep'?vPrep():vHome();
    tabs=['home','history'].includes(t.v);
  }
  const ae=document.activeElement,keep=ae&&ae.id&&ae.tagName==='INPUT'?{id:ae.id,s:ae.selectionStart}:null;
  // folha já aberta: mantém a rolagem e as seções abertas, sem repetir a animação de entrada
  const sh=document.querySelector('.sheet'),was=sh?{k:sh.dataset.k,top:sh.scrollTop,open:[...sh.querySelectorAll('details')].map(d=>d.open)}:null;
  app.innerHTML=html+(tabs?tabbar(nav.stack[nav.stack.length-1].v):'')+sheetHtml()+confirmHtml()+toastHtml();
  const now=document.querySelector('.sheet');
  if(was&&now&&now.dataset.k===was.k){
    now.classList.add('still');const sc=document.querySelector('.scrim');if(sc)sc.classList.add('still');
    now.querySelectorAll('details').forEach((d,i)=>{if(was.open[i])d.open=true});now.scrollTop=was.top;
  }
  if(keep){const el=document.getElementById(keep.id);if(el){el.focus();try{el.setSelectionRange(keep.s,keep.s)}catch(e){}}}
  document.body.style.overflow=UI.sheet||UI.confirm?'hidden':'';
}

/* ---------- ações ---------- */
function ask(o){UI.confirm=o;render()}
function reapply(b){
  const k=memKey(b.recipeId),m=S.mem[k]||(S.mem[k]={}),ap=UI.applied;let g=b.grinder,rt=b.ratio;
  for(const k in ap){if(ap[k].g!=null)g=ap[k].g;if(ap[k].ratio!=null)rt=ap[k].ratio}
  m.g=gStore(g,R[b.recipeId]);m.ratio=rt;save();
}
const A={
  tab:d=>tab(d.t),back:()=>back(),
  settings:()=>{UI.sheet={t:'settings'};render()},closeSheet:()=>{UI.sheet=null;render()},
  method:d=>go('method',{m:d.m}),
  guide:d=>go('guide',{g:d.g}),
  gDrink:d=>{UI.gDrink=d.v;render()},
  prep:d=>openPrep(makeCtx(d.r)),
  repeat:d=>{const b=S.brews.find(x=>x.id===d.id);UI.sheet=null;if(b)openPrep(ctxFromBrew(b))},
  fav:d=>{const i=S.favs.indexOf(d.m);if(i>=0)S.favs.splice(i,1);else S.favs.push(d.m);save();render()},
  favSet:d=>A.fav(d),
  dose:d=>{const r=R[UI.ctx.recipeId],st=doseStep(r);UI.ctx.dose=clamp(Math.round((UI.ctx.dose+st*d.d)/st)*st,r.espresso?7:st,r.espresso?22:2000);render()},
  grind:d=>{UI.ctx.grinder=clamp(UI.ctx.grinder+(+d.d),1,60);render()},
  ratio:d=>{const r=R[UI.ctx.recipeId],st=ratioStep(r);UI.ctx.ratio=r1(clamp(UI.ctx.ratio+st*d.d,1,25));render()},
  ratioReset:()=>{UI.ctx.ratio=baseRatio(R[UI.ctx.recipeId]);render()},
  ratioToggle:()=>{UI.ratioOpen=!UI.ratioOpen;render()},
  start:()=>startBrew(),
  pause:()=>{const a=S.active;if(a.pausedAt){a.pausedTotal+=Date.now()-a.pausedAt;a.pausedAt=null;keepAwake(true)}else a.pausedAt=Date.now();save();render()},
  restart:()=>{const a=S.active;Object.assign(a,{startedAt:Date.now(),pausedAt:null,pausedTotal:0,floor:0,shotSec:null});UI.lastIdx=0;UI.lastTick='';save();snd.start();render()},
  next:()=>{const a=S.active,el=elapsedMs(a),i=stepIdx(a,el),st=a.calc.steps;
    if(a.pausedAt){a.pausedTotal+=Date.now()-a.pausedAt;a.pausedAt=null}
    if(st[i].shot&&a.shotSec==null)a.shotSec=Math.floor(el/1000);
    if(i>=st.length-1||st[i+1].end){finishBrew(elapsedMs(a)/1000);return}
    a.floor=i+1;UI.lastIdx=stepIdx(a,elapsedMs(a));UI.flash=true;save();buzz(20);render()},
  cancel:()=>ask({title:'Cancelar preparo?',body:'O cronômetro para e este preparo não é salvo.',ok:'Continuar preparo',no:'Cancelar preparo',swap:1,onNo:()=>{S.active=null;save();keepAwake(false);quiet()}}),
  cOk:()=>{const c=UI.confirm;UI.confirm=null;if(c&&!c.swap&&c.onOk)c.onOk();render()},
  cNo:()=>{const c=UI.confirm;UI.confirm=null;if(c&&c.swap&&c.onNo)c.onNo();render()},
  rate:d=>{const b=S.brews.find(x=>x.id===UI.done);b.rating=b.rating===+d.v?0:+d.v;save();render()},
  taste:d=>{const b=S.brews.find(x=>x.id===UI.done);b.taste=b.taste===d.k?null:d.k;for(const k in UI.applied)if(k[0]==='s')delete UI.applied[k];reapply(b);render()},
  noteOpen:()=>{UI.noteOpen=true;render();const t=document.querySelector('textarea.note');if(t)t.focus()},
  apply:d=>{const b=S.brews.find(x=>x.id===UI.done),ap=UI.applied;
    if(ap[d.key])delete ap[d.key];
    else{const n={g:d.g!=null?+d.g:null,ratio:d.ratio!=null?+d.ratio:null};
      for(const k in ap){if((n.g!=null&&ap[k].g!=null)||(n.ratio!=null&&ap[k].ratio!=null))delete ap[k]}
      ap[d.key]=n}
    reapply(b);buzz(15);render()},
  finish:()=>{UI.done=null;nav.stack=[{v:'home'}];render();window.scrollTo(0,0)},
  hf:d=>{UI.hf=d.m;render()},
  brewSheet:d=>{UI.sheet={t:'brew',id:d.id};render()},
  delBrew:d=>{const i=S.brews.findIndex(x=>x.id===d.id);if(i<0)return;const[b]=S.brews.splice(i,1);UI.sheet=null;save();
    toast('Preparo excluído',()=>{S.brews.splice(i,0,b);save()})},
  undo:()=>{const t=UI.toast;UI.toast=null;if(t&&t.undo)t.undo();render()},
  pref:d=>{S.prefs[d.k]=!S.prefs[d.k];if(d.k==='silent')audioSession();if(d.k==='sound'&&S.prefs.sound)chime();save();render()},
  testSound:()=>{audioSession();chime();if(!S.active)quiet()},
  burr:d=>{S.burr=clamp(burrNow()+(+d.d),1,10);save();render()},
  burrK:d=>{S.burrK=clamp(burrK()+(+d.d),1,12);save();render()},
  theme:d=>{S.prefs.theme=d.v;save();render()},
  palette:d=>{S.prefs.palette=d.v;save();render()},
  clearHist:()=>ask({title:'Apagar todo o histórico?',body:'Seus ajustes de moedor continuam salvos.',ok:'Apagar histórico',no:'Cancelar',danger:1,onOk:()=>{S.brews=[];UI.sheet=null;save()}}),
  obToggle:d=>{UI.obFavs.has(d.m)?UI.obFavs.delete(d.m):UI.obFavs.add(d.m);render()},
  obNext:()=>{S.favs=METHODS.map(m=>m.id).filter(id=>UI.obFavs.has(id));S.onboarded=true;save();render()}
};
document.addEventListener('click',e=>{
  if(UI.lp){UI.lp=false;e.preventDefault();return}
  const el=e.target.closest('[data-a]');if(!el)return;
  const fn=A[el.dataset.a];if(fn){e.preventDefault();fn(el.dataset,el,e)}
});
document.addEventListener('keydown',e=>{
  if((e.key==='Enter'||e.key===' ')&&e.target.matches('[role="button"][data-a]')){e.preventDefault();e.target.click()}
  if(e.key==='Enter'&&e.target.matches('input[data-c]'))e.target.blur();
  if(e.key==='Escape'&&(UI.sheet||UI.confirm)){UI.sheet=null;UI.confirm=null;render()}
});
document.addEventListener('change',e=>{
  const el=e.target;if(!el.dataset||!el.dataset.c||!UI.ctx)return;const v=parseNum(el.value),ctx=UI.ctx,r=R[ctx.recipeId];
  if(el.dataset.c==='dose'&&v>0)ctx.dose=r1(clamp(v,1,2000));
  if(el.dataset.c==='water'&&v>0){const base=r.water+(r.ice||0);ctx.dose=r1(clamp(v*base/r.water/ctx.ratio,1,2000))}
  if(el.dataset.c==='grind'&&v>0)ctx.grinder=clamp(Math.round(v),1,60);
  render();
});
document.addEventListener('input',e=>{
  if(e.target.id==='hq'){UI.hq=e.target.value;const l=$('#hlist');if(l)l.innerHTML=histItems()}
  if(e.target.dataset&&e.target.dataset.c==='note'){const b=S.brews.find(x=>x.id===UI.done);if(b){b.note=e.target.value;save()}}
});
document.addEventListener('focusin',e=>{if(e.target.matches('.stp input'))setTimeout(()=>e.target.select(),0)});
/* toque longo = favoritar (atalho; a estrela na tela do método faz o mesmo) */
let lpT=null,lpXY=null;
document.addEventListener('pointerdown',e=>{const el=e.target.closest('[data-lp]');if(!el||e.target.closest('button'))return;lpXY=[e.clientX,e.clientY];
  lpT=setTimeout(()=>{const id=el.dataset.lp,was=S.favs.includes(id);A.fav({m:id});UI.lp=true;buzz(20);toast(`${M[id].name} ${was?'removido dos':'adicionado aos'} favoritos`,()=>A.fav({m:id}))},550)});
['pointerup','pointercancel'].forEach(t=>document.addEventListener(t,()=>{clearTimeout(lpT)}));
document.addEventListener('pointermove',e=>{if(lpXY&&Math.hypot(e.clientX-lpXY[0],e.clientY-lpXY[1])>10)clearTimeout(lpT)});

/* ---------- início ---------- */
if(S.active){
  const el=elapsedMs(S.active);
  if(el>6*3600*1000){S.active=null;save()}else{UI.lastIdx=stepIdx(S.active,el);keepAwake(true)}
}
try{history.replaceState({d:1},'')}catch(e){}
render();

/* Uso offline e armazenamento durável */
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))
  window.addEventListener('load',()=>{navigator.serviceWorker.register('./sw.js').catch(()=>{})});
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{})}catch(e){}
