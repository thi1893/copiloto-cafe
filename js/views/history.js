import {M, R} from '../data.js';
import {ui} from '../icons.js';
import {dayLabel, dotsTxt, esc, hm, norm, tf} from '../util.js';
import {S} from '../store.js';
import {line} from '../recipe.js';
import {UI} from '../ui.js';

export function histItems(){
  const q=norm(UI.hq).split(/\s+/).filter(Boolean).map(t=>t.length>3?t.replace(/s$/,''):t);
  const list=S.brews.filter(b=>R[b.recipeId]&&(UI.hf==='all'||b.method===UI.hf)).filter(b=>{
    if(!q.length)return true;const r=R[b.recipeId];const hay=norm([M[r.method].name,r.name,b.note,'moedor '+b.grinder].join(' '));
    return q.every(t=>hay.includes(t));
  });
  if(!list.length)return`<div class="card empty mt">${ui('hist')}<h3>Nada encontrado</h3><p>Tente outro método ou receita.</p></div>`;
  let out='',cur='';
  for(const b of list){const d=dayLabel(b.at);if(d!==cur){if(cur)out+='</div>';out+=`<div class="day">${d}</div><div class="list">`;cur=d}
    const r=R[b.recipeId];
    out+=`<div class="row" data-a="brewSheet" data-id="${b.id}" role="button" tabindex="0">
      <div class="row-m"><div class="row-t">${M[r.method].name} · ${esc(r.name)}</div><div class="row-s num">${line(r,b.dose,b.water,b.ice)} · moedor ${b.grinder}${b.rating?` · <span class="dots-s">${dotsTxt(b.rating)}</span>`:''}</div></div>
      <div class="row-r num"><b>${b.time!=null?tf(r,b.time):'—'}</b>${hm(b.at)}</div>
      <button class="ibtn" data-a="repeat" data-id="${b.id}" aria-label="Preparar novamente" style="color:var(--ink-2)">${ui('rep')}</button></div>`}
  return out+'</div>';
}
export function vHistory(){
  if(!S.brews.length)return`<div class="wrap"><div class="top"><h1 class="h1">Histórico</h1></div>
    <div class="card empty">${ui('hist')}<h3>Seus preparos aparecem aqui</h3><p>Cada café fica salvo com dose, moedor e tempo — e vira atalho para repetir com um toque.</p><button class="btn mt" data-a="tab" data-t="home">Preparar um café</button></div></div>`;
  const used=[...new Set(S.brews.map(b=>b.method))].filter(id=>M[id]);
  return`<div class="wrap"><div class="top"><h1 class="h1">Histórico</h1><span class="faint num" style="font-size:13px">${S.brews.length} ${S.brews.length>1?'preparos':'preparo'}</span></div>
    <input id="hq" class="search" type="search" placeholder="Buscar método ou receita" value="${esc(UI.hq)}" aria-label="Buscar no histórico">
    ${used.length>1?`<div class="hscroll"><button class="chip ${UI.hf==='all'?'on':''}" data-a="hf" data-m="all">Todos</button>${used.map(id=>`<button class="chip ${UI.hf===id?'on':''}" data-a="hf" data-m="${id}">${M[id].name}</button>`).join('')}</div>`:''}
    <div id="hlist">${histItems()}</div></div>`;
}
