import {M, MACHINE, R, recipesOf} from '../data.js';
import {MILK} from '../drinks.js';
import {drinkRows} from './drinks.js';
import {ic, ui} from '../icons.js';
import {dayLabel, esc, tf} from '../util.js';
import {S} from '../store.js';
import {gRange, line} from '../recipe.js';

export function vMethod(mid){
  const m=M[mid],rs=recipesOf(mid),fav=S.favs.includes(mid),lastB=S.brews.find(b=>b.method===mid&&R[b.recipeId]);
  const cards=rs.map(r=>`<button class="rcard" data-a="prep" data-r="${r.id}">
      <div class="rc-h"><span class="rc-n">${esc(r.name)}</span><span class="rc-tag">${esc(r.tag||'')}</span></div>
      <div class="rc-m num"><b>${line(r,r.coffee,r.water,r.ice)}</b> · moedor ${gRange(r)} · ${r.exp}</div>
      <div class="rc-p">${esc(r.profile)} · ${r.level}${r.by?' · '+esc(r.by):''}</div></button>`).join('');
  let lastCard='';
  if(lastB){const r=R[lastB.recipeId];
    lastCard=`<section class="card mt"><div class="eyebrow">último · ${dayLabel(lastB.at).toLowerCase()}</div>
      <div class="hero-t" style="font-size:20px">${esc(r.name)}</div>
      <div class="meta num"><b>${line(r,lastB.dose,lastB.water,lastB.ice)}</b>${lastB.grinder?` · moedor ${lastB.grinder}`:''}${lastB.time!=null?` · ${tf(r,lastB.time)}`:''}</div>
      <button class="btn mt" data-a="repeat" data-id="${lastB.id}">Preparar novamente</button></section>`}
  const machine=mid==='espresso'?`<section class="sec"><div class="sec-h"><span class="sec-t">sua máquina</span></div>
    <details class="disc"><summary>Calibrar um café novo</summary><div class="disc-b"><ol>${MACHINE.calib.map(x=>`<li>${x}</li>`).join('')}</ol></div></details>
    <details class="disc"><summary>Ajuste por torra</summary><div class="disc-b"><table class="tbl"><tr><th>Torra</th><th>Temp.</th><th>Pré-inf.</th><th>Moedor</th></tr>${MACHINE.roast.map(x=>`<tr><td>${x[0]}</td><td>${x[1]}</td><td>${x[2]}</td><td>${x[4]}</td></tr>`).join('')}</table><p style="margin-top:10px">Ácido pede +1 °C; gosto de cinza pede −1 °C.</p></div></details>
    <details class="disc"><summary>Comandos</summary><div class="disc-b">${MACHINE.cmds.map(x=>`<h4>${x[0]}</h4><p>${x[1]}</p>`).join('')}</div></details>
    <details class="disc"><summary>Cuidados</summary><div class="disc-b"><ul>${MACHINE.care.map(x=>`<li>${x}</li>`).join('')}</ul></div></details></section>`:'';
  const milk=mid==='drinks'?`<section class="sec"><div class="sec-h"><span class="sec-t">leite</span></div>
    <details class="disc"><summary>Vaporizar o leite</summary><div class="disc-b"><ol>${MILK.steam.map(x=>`<li>${x}</li>`).join('')}</ol></div></details>
    <details class="disc"><summary>Textura por bebida</summary><div class="disc-b"><table class="tbl"><tr><th>Bebida</th><th>Aeração</th><th>Textura</th></tr>${MILK.texture.map(x=>`<tr><td>${x[0]}</td><td>+${x[1]}</td><td>${x[2]}</td></tr>`).join('')}</table></div></details>
    <details class="disc"><summary>Na sua máquina</summary><div class="disc-b"><ul>${MILK.machine.map(x=>`<li>${x}</li>`).join('')}</ul></div></details>
    <details class="disc"><summary>Cuidados com o leite</summary><div class="disc-b"><ul>${MILK.care.map(x=>`<li>${x}</li>`).join('')}</ul></div></details>
    <details class="disc"><summary>Latte art</summary><div class="disc-b"><ol>${MILK.art.map(x=>`<li>${x}</li>`).join('')}</ol><p style="margin-top:10px">${MILK.artOrder}</p></div></details></section>`:'';
  return`<div class="wrap">
    <div class="top"><button class="ibtn edge" data-a="back" aria-label="Voltar">${ui('back')}</button>
      <button class="ibtn edge-r star ${fav?'on':''}" data-a="fav" data-m="${mid}" aria-pressed="${fav}" aria-label="${fav?'Remover dos favoritos':'Favoritar'}">${ui('star')}</button></div>
    <div class="m-hero">${ic(mid)}<h1 class="h1">${m.name}</h1><p class="desc">${m.sub}</p></div>
    ${lastCard}
    <section class="sec"><div class="sec-h"><span class="sec-t">${mid==='drinks'?'bebidas':'receitas'}</span></div>${mid==='drinks'?`<div class="list">${drinkRows()}</div>`:cards}</section>
    ${mid==='drinks'?`<section class="sec"><div class="sec-h"><span class="sec-t">bebidas doces</span></div><div class="list">${drinkRows(true)}</div></section>`:''}
    ${machine}${milk}
  </div>`;
}
