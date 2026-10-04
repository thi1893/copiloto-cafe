import {INNER_BURR, M, PALETTES, METHODS, R, RATE_L, RECIPES, TASTE} from '../data.js';
import {ui} from '../icons.js';
import {dayLabel, dotsTxt, esc, fmtR, hm, tf} from '../util.js';
import {S} from '../store.js';
import {gRange, grinderFor, line} from '../recipe.js';
import {UI} from '../ui.js';

export function sheetHtml(){
  const s=UI.sheet;if(!s)return'';let body='';
  if(s.t==='settings'){
    const sw=(k,l,sub)=>`<div class="srow"><div class="row-m"><div class="row-t">${l}</div>${sub?`<div class="row-s">${sub}</div>`:''}</div><button class="sw" role="switch" aria-checked="${!!S.prefs[k]}" data-a="pref" data-k="${k}" aria-label="${l}"></button></div>`;
    body=`<div class="sh-h"><span class="sh-t">Ajustes</span><button class="ibtn edge-r" data-a="closeSheet" aria-label="Fechar">${ui('close')}</button></div>
      <div class="sec-t" style="margin:8px 2px 8px">métodos na tela inicial</div>
      <div class="chips">${METHODS.filter(m=>m.id!=='drinks').map(m=>`<button class="chip ${S.favs.includes(m.id)?'on':''}" data-a="favSet" data-m="${m.id}" aria-pressed="${S.favs.includes(m.id)}">${m.name}</button>`).join('')}</div>
      <div class="sec-t" style="margin:26px 2px 4px">durante o preparo</div>
      ${sw('sound','Som','Aviso suave a cada nova etapa')}${sw('countdown','Contagem regressiva','Bipe curto nos 3 s antes da próxima etapa')}${sw('wake','Manter tela ligada','Durante o preparo')}${'vibrate'in navigator?sw('vibe','Vibração',''):''}
      <div class="sec-t" style="margin:22px 2px 0">aparência</div>
      <div class="seg">${[['auto','Automático'],['light','Claro'],['dark','Escuro']].map(x=>`<button class="${S.prefs.theme===x[0]?'on':''}" data-a="theme" data-v="${x[0]}">${x[1]}</button>`).join('')}</div>
      <div class="sec-t" style="margin:18px 2px 0">cores</div>
      <div class="seg">${Object.entries(PALETTES).map(([k,p])=>`<button class="${(S.prefs.palette||'cinza')===k?'on':''}" data-a="palette" data-v="${k}" aria-pressed="${(S.prefs.palette||'cinza')===k}"><i class="pal" style="background:${p.dot}"></i>${p.name}</button>`).join('')}</div>
      <details class="disc" style="margin-top:22px"><summary>Moedor: posição por receita</summary><div class="disc-b"><table class="tbl"><tr><th>Receita</th><th>Faixa</th><th>Sua</th></tr>${RECIPES.filter(r=>!r.drink).map(r=>`<tr><td>${M[r.method].name} · ${esc(r.name)}</td><td class="num">${gRange(r)}${r.gMax?' · limite':''}</td><td class="num acc">${grinderFor(r.id)}</td></tr>`).join('')}</table>
        <p style="margin-top:12px">Calibrado para a mó interna (triângulo vermelho) no ${INNER_BURR}: espresso em 1–3 e V60 a partir de 54. As outras posições são estimativas entre essas duas referências; ajuste pelo tempo e pelo gosto. “Limite” indica receita que pede moagem mais grossa que a posição 60.</p></div></details>
      ${S.brews.length?`<button class="btn txt mt" style="color:var(--danger)" data-a="clearHist">Apagar histórico</button>`:''}`;
  }else if(s.t==='brew'){
    const b=S.brews.find(x=>x.id===s.id);if(!b){UI.sheet=null;return''}
    const r=R[b.recipeId],tl=TASTE[r.espresso?'espresso':'filter'].find(t=>t.k===b.taste);
    body=`<div class="sh-h"><span class="sh-t">${M[r.method].name} · ${esc(r.name)}</span><button class="ibtn edge-r" data-a="closeSheet" aria-label="Fechar">${ui('close')}</button></div>
      <p class="muted" style="font-size:14px">${dayLabel(b.at)}, ${hm(b.at)}</p>
      <div class="list mt" style="padding:4px 16px"><dl class="disc-b" style="padding:12px 0;color:var(--ink-2)"><dl style="display:grid;grid-template-columns:auto 1fr;gap:10px 18px;font-size:14px">
        ${[['Dose',line(r,b.dose,b.water,b.ice)],['Proporção',r.fixed?'—':fmtR(b.ratio)],['Moedor',b.grinder],['Tempo',b.time!=null?tf(r,b.time):'—'],['Nota',b.rating?`${dotsTxt(b.rating)} ${RATE_L[b.rating]}`:'—'],['Sabor',tl?tl.l:'—']].map(x=>`<dt class="muted">${x[0]}</dt><dd class="num" style="text-align:right">${esc(x[1])}</dd>`).join('')}
      </dl></dl></div>
      ${b.note?`<p class="muted mt-s" style="font-size:14px;padding:0 4px">“${esc(b.note)}”</p>`:''}
      <button class="btn mt" data-a="repeat" data-id="${b.id}">Preparar novamente</button>
      <button class="btn txt mt-s" style="color:var(--danger)" data-a="delBrew" data-id="${b.id}">Excluir do histórico</button>`;
  }
  return`<div class="scrim" data-a="closeSheet"></div><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${body}</div>`;
}
