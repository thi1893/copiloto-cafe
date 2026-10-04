import {M, R, RATE_L, TASTE} from '../data.js';
import {cap, clamp, esc, fmtR, fmtT, r1, tf} from '../util.js';
import {S} from '../store.js';
import {line} from '../recipe.js';
import {UI} from '../ui.js';
import {vHome} from './home.js';

export function vDone(){
  const b=S.brews.find(x=>x.id===UI.done);if(!b){UI.done=null;return vHome()}
  const r=R[b.recipeId],m=M[r.method],fam=r.espresso?'espresso':'filter';
  let verdict='';
  if(b.judge&&r.time&&b.time!=null){
    const[lo,hi]=r.time,rg=r.espresso?r.exp:`${fmtT(lo)}–${fmtT(hi)}`,act=r.act||{},d=act.d||2,fast=act.fast??lo,slow=act.slow??hi;
    let k='ok',title=`Dentro do esperado`,body=`${rg} para esta receita.`,g=null;
    if(b.time<fast&&fast>0){k='fast';title=r.espresso?'Extração rápida':'Drenou rápido';body=`Esperado ${rg}. Moa mais fino: ${d} ${d>1?'posições':'posição'} abaixo.${r.espresso?' Confira se a dose está certa.':''}`;g=clamp(b.grinder-d,1,60)}
    else if(b.time>slow){k='slow';title=r.espresso?'Extração lenta':'Drenou devagar';body=`Esperado ${rg}. Moa mais grosso: ${d} ${d>1?'posições':'posição'} acima.`;g=clamp(b.grinder+d,1,60)}
    else if(b.time<lo||b.time>hi){k='near';title=`Um pouco ${b.time<lo?'rápido':'lento'}`;body=`Esperado ${rg}. Ajuste só se o sabor pedir.`}
    const key='t'+g;
    verdict=`<div class="verdict"><span class="vi ${k==='ok'?'ok':''}">${k==='ok'?'✓':k==='fast'?'↓':k==='slow'?'↑':'~'}</span><div><b>${title}</b>${body}
      ${g!=null?`<div><button class="apply ${UI.applied[key]?'done':''}" data-a="apply" data-g="${g}" data-key="${key}">${UI.applied[key]?'✓ Moedor '+g+' na próxima':'Usar moedor '+g+' na próxima'}</button></div>`:''}</div></div>`;
  }
  const tl=TASTE[fam],sel=tl.find(t=>t.k===b.taste);
  let advice='';
  if(sel){
    const g=sel.g!=null?clamp(b.grinder+sel.g,1,60):null,rr=sel.r!=null?r1(clamp(b.ratio+sel.r,1,25)):null,key='s'+sel.k;
    const parts=[g!=null?'moedor '+g:null,rr!=null?'proporção '+fmtR(rr):null].filter(Boolean).join(' e ');
    advice=`<div class="advice"><b>${sel.l}.</b> ${sel.a}${parts?`<div><button class="apply ${UI.applied[key]?'done':''}" data-a="apply" ${g!=null?`data-g="${g}"`:''} ${rr!=null?`data-ratio="${rr}"`:''} data-key="${key}">${UI.applied[key]?'✓ '+cap(parts)+' na próxima':'Usar '+parts+' na próxima'}</button></div>`:''}</div>`;
  }
  return`<div class="wrap">
    <div class="done-k">완성</div>
    <h1 class="h1" style="margin-top:6px">Café pronto</h1>
    <p class="d-sum">${m.name} · ${esc(r.name)}<br><span class="num">${line(r,b.dose,b.water,b.ice)} · moedor ${b.grinder}</span></p>
    ${b.time!=null?`<div class="d-time"><b class="num">${tf(r,b.time)}</b><span>tempo total</span></div>`:''}
    ${verdict}
    <section class="sec"><div class="sec-h"><span class="sec-t">como ficou?</span><span class="sec-t faint">opcional</span></div>
      <div class="rate" role="radiogroup" aria-label="Nota">${[1,2,3,4,5].map(v=>`<button data-a="rate" data-v="${v}" role="radio" aria-checked="${b.rating===v}" aria-label="${RATE_L[v]}"><i class="${b.rating>=v?'on':''}"></i></button>`).join('')}<span>${RATE_L[b.rating]||''}</span></div>
      <div class="chips mt-s">${tl.map(t=>`<button class="chip ${b.taste===t.k?'on':''}" data-a="taste" data-k="${t.k}" aria-pressed="${b.taste===t.k}">${t.l}</button>`).join('')}</div>
      ${advice}
      ${UI.noteOpen||b.note?`<textarea id="note" class="note" data-c="note" placeholder="Observação — ex.: notas de frutas vermelhas, final curto">${esc(b.note)}</textarea>`:`<button class="link" style="display:inline-block;margin-top:8px" data-a="noteOpen">+ Adicionar observação</button>`}
    </section>
  </div>
  <div class="cta-bar"><div class="cta-in"><button class="btn" data-a="finish">Concluir</button></div></div>`;
}
