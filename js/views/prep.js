import {INNER_BURR, M, R} from '../data.js';
import {ui} from '../icons.js';
import {clamp, esc, fmtN, fmtR, fmtT} from '../util.js';
import {S} from '../store.js';
import {baseRatio, calc, gRange} from '../recipe.js';
import {UI} from '../ui.js';
import {scene} from '../scenes.js';

export function gScale(r,g){
  const p=v=>(clamp(v,1,60)-1)/59*100,[lo,hi]=r.grinder;
  return`<div class="gs" aria-hidden="true"><div class="gs-t"><i class="gs-r" style="left:${p(lo).toFixed(1)}%;width:${Math.max(3,p(hi)-p(lo)).toFixed(1)}%"></i><i class="gs-m" style="left:${p(g).toFixed(1)}%"></i></div><div class="gs-l"><span>1 · mais fina</span><span>mais grossa · 60</span></div></div>`;
}
export function vPrep(){
  const ctx=UI.ctx,r=R[ctx.recipeId],m=M[r.method],c=calc(ctx);
  const rDef=baseRatio(r),changed=Math.abs(ctx.ratio-rDef)>.04,count=S.brews.filter(b=>b.recipeId===r.id).length;
  const stepper=(k,val,unit,extra='')=>`<div class="stp"><button data-a="${k}" data-d="-1" aria-label="Diminuir">${ui('minus')}</button>
      <div class="val"><input class="num ${extra}" id="in-${k}" data-c="${k}" value="${fmtN(val)}" inputmode="decimal" aria-label="${k}" enterkeyhint="done"><span class="unit">${unit}</span></div>
      <button data-a="${k}" data-d="1" aria-label="Aumentar">${ui('plus')}</button></div>`;
  const fixedVal=(v,unit,cls='')=>`<div class="stp"><span class="sp"></span><div class="val"><span class="fixed num ${cls}">${v}</span><span class="unit">${unit}</span></div><span class="sp"></span></div>`;
  const waterRow=`<div class="prow"><div class="pl">${r.espresso?'Bebida':'Água'}<small>${r.espresso?'na xícara':r.ice?'quente':'total'}</small></div>
      <div class="stp"><span class="sp"></span><div class="val"><input id="in-water" class="num dyn" data-c="water" value="${c.water}" inputmode="numeric" aria-label="Água em gramas" enterkeyhint="done"><span class="unit">g</span></div><span class="sp"></span></div></div>`;
  const steps=c.steps.filter(s=>!s.end).map(s=>`<li><div class="st-pic">${scene(r,s,'still')}</div><div><div class="st-a">${esc(s.a)}</div>${s.n?`<div class="st-n">${esc(s.n)}</div>`:''}</div><div class="st-r"><span class="st-v num">${s.to!=null?s.to+' g':s.add!=null?'+'+s.add+' g':s.q!=null?s.q+' '+s.unit:''}</span>${s.t!=null?`<span class="st-t num">${fmtT(s.t)}${s.pe!=null?'–'+fmtT(s.pe):''}</span>`:''}</div></li>`).join('');
  const tips=[...(c.steps.some(x=>x.pe!=null)&&['v60','kalita','chemex'].includes(r.method)?['Ritmo do despejo: 4 a 6 g por segundo. Durante o preparo, o app mostra quanto tempo de despejo falta e quanto a balança deveria marcar a cada instante.']:[]),...(r.gMax?[`Esta receita pede moagem mais grossa do que a posição 60 entrega com a mó interna no ${INNER_BURR}. Se drenar devagar ou amargar, suba a mó interna; as posições do espresso mudam junto.`]:[]),...(r.time?[`${r.espresso?'Extração em '+r.exp:'Fim em '+fmtT(r.time[0])+'–'+fmtT(r.time[1])}. Fora disso, o app sugere o ajuste do moedor no final.`]:[]),...(r.tips||[]),'A posição do moedor é ponto de partida: cada café varia de 2 a 4 posições.','Ao trocar de posição, moa e descarte 2–3 g para limpar o pó antigo.'];
  const prep=[`${r.fixed?r.doseNote:fmtN(ctx.dose)+' g de café'} moído na posição ${ctx.grinder}`,
    r.espresso?`Temperatura ${r.temp.toLowerCase()} · pré-infusão ${r.preinf.toLowerCase()}`:`${r.fixed?'Água '+r.waterNote:c.water+' g de água'} · ${r.temp}`,
    ...(c.ice?[`${c.ice} g de gelo no servidor`]:[]),...(c.dil?[`${c.dil} g de água quente para completar`]:[]),...(r.prep||[])];
  return`<div class="wrap">
    <div class="top"><button class="ibtn edge" data-a="back" aria-label="Voltar">${ui('back')}</button><div class="top-t">${m.name}</div><span style="width:44px"></span></div>
    <div class="eyebrow">${esc(r.tag||'')}${r.by?' · '+esc(r.by):''}</div>
    <h1 class="h1" style="margin-top:4px">${esc(r.name)}</h1>
    <p class="desc">${esc(r.desc)}</p>
    <div class="card gcard">
      <div class="prow"><div class="pl">Moedor<small>mó interna no ${INNER_BURR}</small></div>${stepper('grind',ctx.grinder,'')}</div>
      ${gScale(r,ctx.grinder)}
      <p class="g-note">${esc(r.grind)} · ${r.gMax?`use <b class="num">60</b>, o limite com a mó interna no ${INNER_BURR}`:`a receita pede <b class="num">${gRange(r)}</b>${ctx.grinder<r.grinder[0]?' · você está abaixo':ctx.grinder>r.grinder[1]?' · você está acima':''}`}</p>
    </div>
    <div class="card params">
      <div class="prow"><div class="pl">Café${r.espresso?'<small>cesto duplo 15–18 g</small>':''}</div>${r.fixed?fixedVal(r.doseNote,''):stepper('dose',ctx.dose,'g')}</div>
      ${r.fixed?`<div class="prow"><div class="pl">Água</div>${fixedVal(r.waterNote,'')}</div>`:waterRow}
      ${c.ice?`<div class="prow"><div class="pl">Gelo<small>no servidor</small></div>${fixedVal(c.ice,'g','dyn')}</div>`:''}
      ${r.fixed?'':`<button class="rline" data-a="ratioToggle" aria-expanded="${UI.ratioOpen}"><span>Proporção <b class="num">${fmtR(ctx.ratio)}</b>${changed?` <span class="faint">· receita ${fmtR(rDef)}</span>`:''}</span><span class="acc" style="font-weight:600;font-size:13px">${UI.ratioOpen?'Fechar':'Ajustar'}</span></button>
      ${UI.ratioOpen?`<div class="rpanel">${changed?`<button class="link" data-a="ratioReset">Voltar a ${fmtR(rDef)}</button>`:'<span class="faint" style="font-size:13px">Mais curta = mais forte</span>'}<div class="stp"><button data-a="ratio" data-d="-1" aria-label="Proporção mais curta">${ui('minus')}</button><div class="val"><span class="fixed num" style="font-size:18px">${fmtR(ctx.ratio)}</span></div><button data-a="ratio" data-d="1" aria-label="Proporção mais longa">${ui('plus')}</button></div></div>`:''}`}
    </div>
    ${r.drink?`<div class="facts">${[['xícara',r.cup],['complemento',r.extra],['espuma',r.foam]].map(x=>`<div><span>${x[0]}</span><b>${esc(x[1])}</b></div>`).join('')}</div>`:''}
    <div class="facts">${[['temperatura',r.temp],...(r.espresso?[['pré-infusão',r.preinf]]:[]),[r.espresso?'extração':'tempo',r.exp]].map(x=>`<div><span>${x[0]}</span><b>${esc(x[1])}</b></div>`).join('')}</div>
    <section class="sec"><div class="sec-h"><span class="sec-t">etapas</span><span class="sec-t faint">${r.untimed?'sem cronômetro':r.drink?'toque para avançar':r.espresso?'você para pelo peso':'avançam sozinhas'}</span></div><ol class="card steps">${steps}</ol></section>
    <details class="disc" ${count<2?'open':''}><summary>Antes de começar</summary><div class="disc-b"><ul>${prep.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></details>
    <details class="disc"><summary>Como acertar</summary><div class="disc-b"><ul>${tips.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></details>
  </div>
  <div class="cta-bar"><div class="cta-in"><button class="btn" data-a="start">Começar</button></div></div>`;
}
