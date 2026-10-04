import {INNER_BURR, M, PALETTES, METHODS, R, RATE_L, RECIPES, TASTE} from '../data.js';
import {ui} from '../icons.js';
import {dayLabel, dotsTxt, esc, fmtR, hm, tf} from '../util.js';
import {S} from '../store.js';
import {burrK, burrNow, burrShift, gLimit, gRange, grinderFor, line} from '../recipe.js';
import {UI} from '../ui.js';
import {hasAudioSession} from '../feedback.js';

export function sheetHtml(){
  const s=UI.sheet;if(!s)return'';let body='';
  if(s.t==='settings'){
    const sw=(k,l,sub)=>`<div class="srow"><div class="row-m"><div class="row-t">${l}</div>${sub?`<div class="row-s">${sub}</div>`:''}</div><button class="sw" role="switch" aria-checked="${!!S.prefs[k]}" data-a="pref" data-k="${k}" aria-label="${l}"></button></div>`;
    const num=(k,v,l)=>`<div class="stp"><button data-a="${k}" data-d="-1" aria-label="Diminuir ${l}">${ui('minus')}</button><div class="val" style="width:40px"><span class="fixed num" id="v-${k}">${v}</span></div><button data-a="${k}" data-d="1" aria-label="Aumentar ${l}">${ui('plus')}</button></div>`;
    const bn=burrNow(),sh=burrShift(),lims=RECIPES.filter(r=>!r.drink&&gLimit(r)).length;
    const gPrev=['esp-n','moka','aero','v60-1','chemex'].map(id=>`<span>${M[R[id].method].name} <b class="num">${gRange(R[id])}</b></span>`).join(' · ');
    body=`<div class="sh-h"><span class="sh-t">Ajustes</span><button class="ibtn edge-r" data-a="closeSheet" aria-label="Fechar">${ui('close')}</button></div>
      <div class="sec-t" style="margin:8px 2px 8px">métodos na tela inicial</div>
      <div class="chips">${METHODS.filter(m=>m.id!=='drinks').map(m=>`<button class="chip ${S.favs.includes(m.id)?'on':''}" data-a="favSet" data-m="${m.id}" aria-pressed="${S.favs.includes(m.id)}">${m.name}</button>`).join('')}</div>
      <div class="sec-t" style="margin:26px 2px 4px">durante o preparo</div>
      ${sw('sound','Som','Aviso a cada nova etapa')}${hasAudioSession()?sw('silent','Tocar no modo silencioso','Ignora a chave de silencioso do iPhone; pode pausar a música de outros apps'):''}<div class="srow" style="min-height:52px"><div class="row-m"><div class="row-s">O volume segue os botões laterais do iPhone</div></div><button class="rbtn" data-a="testSound">Testar som</button></div>${sw('countdown','Contagem regressiva','Bipe curto nos 3 s antes da próxima etapa')}${sw('wake','Manter tela ligada','Durante o preparo')}${'vibrate'in navigator?sw('vibe','Vibração',''):''}
      <div class="sec-t" style="margin:26px 2px 4px">moedor</div>
      <div class="srow"><div class="row-m"><div class="row-t">Mó interna</div><div class="row-s">Número no triângulo vermelho</div></div>${num('burr',bn,'mó interna')}</div>
      <p class="burr-p" id="burrPrev">${gPrev}${sh?`<br><span class="faint">${sh>0?'+'+sh:'−'+(-sh)} posições em relação à mó interna no ${INNER_BURR}${lims?` · ${lims} ${lims>1?'receitas':'receita'} no limite`:''}</span>`:lims?`<br><span class="faint">${lims} ${lims>1?'receitas':'receita'} no limite do moedor</span>`:''}</p>
      <div class="sec-t" style="margin:22px 2px 0">aparência</div>
      <div class="seg">${[['auto','Automático'],['light','Claro'],['dark','Escuro']].map(x=>`<button class="${S.prefs.theme===x[0]?'on':''}" data-a="theme" data-v="${x[0]}">${x[1]}</button>`).join('')}</div>
      <div class="sec-t" style="margin:18px 2px 0">cores</div>
      <div class="seg">${Object.entries(PALETTES).map(([k,p])=>`<button class="${(S.prefs.palette||'cinza')===k?'on':''}" data-a="palette" data-v="${k}" aria-pressed="${(S.prefs.palette||'cinza')===k}"><i class="pal" style="background:${p.dot}"></i>${p.name}</button>`).join('')}</div>
      <details class="disc" style="margin-top:22px"><summary>Moedor: posição por receita</summary><div class="disc-b"><table class="tbl"><tr><th>Receita</th><th>Faixa</th><th>Sua</th></tr>${RECIPES.filter(r=>!r.drink).map(r=>`<tr><td>${M[r.method].name} · ${esc(r.name)}</td><td class="num">${gRange(r)}${gLimit(r)?' · limite':''}</td><td class="num acc">${grinderFor(r.id)}</td></tr>`).join('')}</table>
        <div class="srow" style="margin-top:8px;border-top:1px solid var(--line)"><div class="row-m"><div class="row-t" style="color:var(--ink)">Posições por passo</div><div class="row-s">Quanto cada passo da mó interna desloca</div></div>${num('burrK',burrK(),'posições por passo')}</div>
        <p style="margin-top:8px">Referência: mó interna no ${INNER_BURR}, com espresso em 1–3 e V60 a partir de 54. Número maior na mó interna deixa tudo mais grosso, então as posições descem ${burrK()} por passo; número menor, sobem. Esse ${burrK()} é uma estimativa: se, depois de mexer na mó interna, as posições ficarem finas ou grossas demais, ajuste o valor acima. “Limite” indica receita fora do alcance do moedor nessa configuração.</p></div></details>
      ${S.brews.length?`<button class="btn txt mt" style="color:var(--danger)" data-a="clearHist">Apagar histórico</button>`:''}`;
  }else if(s.t==='brew'){
    const b=S.brews.find(x=>x.id===s.id);if(!b){UI.sheet=null;return''}
    const r=R[b.recipeId],tl=TASTE[r.espresso?'espresso':'filter'].find(t=>t.k===b.taste);
    body=`<div class="sh-h"><span class="sh-t">${M[r.method].name} · ${esc(r.name)}</span><button class="ibtn edge-r" data-a="closeSheet" aria-label="Fechar">${ui('close')}</button></div>
      <p class="muted" style="font-size:14px">${dayLabel(b.at)}, ${hm(b.at)}</p>
      <div class="list mt" style="padding:4px 16px"><dl class="disc-b" style="padding:12px 0;color:var(--ink-2)"><dl style="display:grid;grid-template-columns:auto 1fr;gap:10px 18px;font-size:14px">
        ${[['Dose',line(r,b.dose,b.water,b.ice)],['Proporção',r.fixed?'—':fmtR(b.ratio)],['Moedor',b.grinder+((b.burr??INNER_BURR)!==burrNow()?` · mó interna ${b.burr??INNER_BURR}`:'')],['Tempo',b.time!=null?tf(r,b.time):'—'],['Nota',b.rating?`${dotsTxt(b.rating)} ${RATE_L[b.rating]}`:'—'],['Sabor',tl?tl.l:'—']].map(x=>`<dt class="muted">${x[0]}</dt><dd class="num" style="text-align:right">${esc(x[1])}</dd>`).join('')}
      </dl></dl></div>
      ${b.note?`<p class="muted mt-s" style="font-size:14px;padding:0 4px">“${esc(b.note)}”</p>`:''}
      <button class="btn mt" data-a="repeat" data-id="${b.id}">Preparar novamente</button>
      <button class="btn txt mt-s" style="color:var(--danger)" data-a="delBrew" data-id="${b.id}">Excluir do histórico</button>`;
  }
  return`<div class="scrim" data-a="closeSheet"></div><div class="sheet" data-k="${s.t}${s.id||''}" role="dialog" aria-modal="true"><div class="grab"></div>${body}</div>`;
}
