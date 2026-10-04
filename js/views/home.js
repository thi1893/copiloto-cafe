import {M, METHODS, R, recipesOf} from '../data.js';
import {ic, ui} from '../icons.js';
import {dayLabel, dotsTxt, esc, fmtN, hm, tf} from '../util.js';
import {S} from '../store.js';
import {calc, grinderFor, line, makeCtx} from '../recipe.js';

export function greeting(){const h=new Date().getHours();return h<5?'Boa noite':h<12?'Bom dia':h<18?'Boa tarde':'Boa noite'}
export function vHome(){
  const last=S.brews.find(b=>R[b.recipeId]);
  let hero;
  if(last){
    const r=R[last.recipeId],m=M[r.method];
    hero=`<section class="card" aria-label="Último preparo">
      <div class="eyebrow">último preparo · ${dayLabel(last.at).toLowerCase()} ${hm(last.at)}</div>
      <div class="hero-t">${m.name} <span>— ${esc(r.name)}</span></div>
      <div class="meta num"><b>${line(r,last.dose,last.water,last.ice)}</b>${last.grinder?` · moedor ${last.grinder}`:''}${last.time!=null?` · ${tf(r,last.time)}`:''}${last.rating?` · <span class="dots-s">${dotsTxt(last.rating)}</span>`:''}</div>
      <button class="btn mt" data-a="repeat" data-id="${last.id}">Preparar novamente</button>
    </section>`;
  }else{
    const mid=S.favs.find(id=>M[id])||'v60',r=recipesOf(mid)[0];
    hero=`<section class="card"><div class="eyebrow">primeiro preparo</div>
      <div class="hero-t">${M[mid].name} <span>— ${esc(r.name)}</span></div>
      <div class="meta num"><b>${line(r,r.coffee,r.water,r.ice)}</b> · moedor ${grinderFor(r.id)} · ${r.temp}</div>
      <p class="muted mt-s" style="font-size:14px">O app guia cada etapa e lembra tudo para a próxima vez.</p>
      <button class="btn mt" data-a="prep" data-r="${r.id}">Preparar</button></section>`;
  }
  const favs=S.favs.filter(id=>M[id]).map(id=>{
    const m=M[id],rid=S.methodLast[id]||recipesOf(id)[0].id,ctx=makeCtx(rid),r=R[rid],c=calc(ctx);
    return`<div class="mcard" data-a="method" data-m="${id}" data-lp="${id}" role="button" tabindex="0" aria-label="${m.name}">
      ${ic(id)}<div class="mcard-n">${m.name}</div><div class="mcard-r">${esc(r.name)}</div>
      <div class="mcard-d num">${r.drink?esc(r.extra):r.fixed?r.doseNote:`${fmtN(ctx.dose)} → ${c.water}${c.ice?'+'+c.ice:''} g`}</div>
      <div class="mcard-c num">moedor ${ctx.grinder}</div>
      <button class="mini" data-a="prep" data-r="${rid}" aria-label="Preparar ${m.name}">Preparar</button></div>`;
  }).join('');
  const seen=new Set(last?[last.recipeId]:[]),rec=[];
  for(const b of S.brews){if(b===last||!R[b.recipeId])continue;const k=b.recipeId;if(seen.has(k))continue;seen.add(k);rec.push(b);if(rec.length===3)break}
  const recent=rec.map(b=>{const r=R[b.recipeId];
    return`<div class="row" data-a="brewSheet" data-id="${b.id}" role="button" tabindex="0">${ic(r.method,'mi')}
      <div class="row-m"><div class="row-t">${M[r.method].name} · ${esc(r.name)}</div><div class="row-s">${dayLabel(b.at)} · <span class="num">moedor ${b.grinder}</span></div></div>
      <button class="rbtn" data-a="repeat" data-id="${b.id}" aria-label="Repetir">${ui('rep')}Repetir</button></div>`}).join('');
  const others=METHODS.filter(m=>!S.favs.includes(m.id)).map(m=>`<div class="row" data-a="method" data-m="${m.id}" data-lp="${m.id}" role="button" tabindex="0">${ic(m.id,'mi')}
      <div class="row-m"><div class="row-t">${m.name}</div><div class="row-s">${recipesOf(m.id).length} ${recipesOf(m.id).length>1?'receitas':'receita'} · ${m.sub}</div></div>${ui('chev','chev')}</div>`).join('');
  return`<div class="wrap">
    <div class="top"><div class="brand">café<span>커피</span></div><button class="ibtn edge-r" data-a="settings" aria-label="Ajustes">${ui('set')}</button></div>
    <h1 class="greet"><small>${new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'})}</small>${greeting()}</h1>
    ${hero}
    ${favs?`<section class="sec"><div class="sec-h"><span class="sec-t">seus métodos</span><button class="link" data-a="settings">editar</button></div><div class="grid2">${favs}</div></section>`:''}
    ${recent?`<section class="sec"><div class="sec-h"><span class="sec-t">recentes</span><button class="link" data-a="tab" data-t="history">histórico</button></div><div class="list">${recent}</div></section>`:''}
    ${others?`<section class="sec"><div class="sec-h"><span class="sec-t">explorar métodos</span></div><div class="list">${others}</div></section>`:''}
  </div>`;
}
