import {M, R} from '../data.js';
import {ui} from '../icons.js';
import {esc, fmtT, tf} from '../util.js';
import {S} from '../store.js';
import {UI} from '../ui.js';
import {elapsedMs, stepIdx} from '../engine.js';

export function vBrew(){
  const a=S.active,r=R[a.ctx.recipeId],m=M[r.method],st=a.calc.steps,el=elapsedMs(a),i=stepIdx(a,el),s=st[i],n=st[i+1],paused=!!a.pausedAt;
  const vis=st.filter(x=>!x.end),pos=Math.min(i+1,vis.length);
  let prevTo=0;for(let j=i-1;j>=0;j--){if(st[j].to!=null){prevTo=st[j].to;break}}
  let main;
  if(s.shot)main=`<div class="b-label">pare em</div><div class="b-big num">${s.to}<small>g</small></div><div class="b-sub">${esc(s.n||'')} · pare entre <b>${r.exp}</b></div>`;
  else if(s.to!=null)main=`<div class="b-label">${esc(s.a)} · despeje até</div><div class="b-big num">${s.to}<small>g</small></div><div class="b-sub"><b class="num">+${s.to-prevTo} g</b>${s.n?' · '+esc(s.n):''}</div>`;
  else if(s.add!=null)main=`<div class="b-label">${esc(s.a)}</div><div class="b-big num">+${s.add}<small>g</small></div><div class="b-sub">Toque em Feito ao terminar</div>`;
  else if(s.drain)main=`<div class="b-label">drenagem</div><div class="b-act">Aguarde a água passar</div><div class="b-sub">${r.time?`Esperado: fim em <b>${fmtT(r.time[0])}–${fmtT(r.time[1])}</b>`:esc(s.n||'')}</div>`;
  else main=`<div class="b-label">agora</div><div class="b-act">${esc(s.a)}</div><div class="b-sub">${esc(s.n||'')}</div>`;
  let next='';
  if(n&&!s.shot){
    const nv=n.end?esc(n.a):n.to!=null?`${n.to} g`:n.add!=null?`+${n.add} g`:esc(n.a);
    const timed=n.t!=null&&!(s.manual||s.drain);
    next=`<div class="b-next"><span class="l">depois</span><span class="v">${nv}${timed?` <span id="bIn" class="in">em ${fmtT((n.t*1000-el)/1000+.999)}</span>`:''}</span></div>`;
  }else if(!n&&(s.drain||s.manual||s.shot)&&!r.untimed){next=''}
  const timer=r.untimed?'':`<div id="bTime" class="b-time num ${paused?'paused':''}">${tf(r,el/1000)}</div><div class="b-tl">${paused?'pausado':'tempo total'}</div>`;
  const dots=vis.length>1?`<div class="b-dots" aria-label="Etapa ${pos} de ${vis.length}">${vis.map((_,j)=>`<i class="${j<i?'on':j===i?'cur':''}"></i>`).join('')}</div>`:'';
  let actions;
  if(paused)actions=`<div class="b-row"><button class="btn ghost sq" data-a="restart" aria-label="Reiniciar">${ui('reset')}</button><button class="btn" data-a="pause">${ui('play')}Continuar</button></div>`;
  else if(s.drain)actions=`<div class="b-row"><button class="btn ghost sq" data-a="pause" aria-label="Pausar">${ui('pause')}</button><button class="btn" data-a="next">Drenou</button></div>`;
  else if(s.shot)actions=`<div class="b-row"><button class="btn ghost sq" data-a="pause" aria-label="Pausar">${ui('pause')}</button><button class="btn" data-a="next">Parar</button></div>`;
  else if(s.manual)actions=r.untimed?`<button class="btn" data-a="next">${i===st.length-1?'Concluir':'Feito'}</button>`:`<div class="b-row"><button class="btn ghost sq" data-a="pause" aria-label="Pausar">${ui('pause')}</button><button class="btn" data-a="next">${i===st.length-1?'Concluir':'Feito'}</button></div>`;
  else actions=`<button class="btn ghost" data-a="pause">${ui('pause')}Pausar</button>`;
  const fl=UI.flash;UI.flash=false;
  return`<div class="brew" role="main">
    <div class="b-top"><button class="ibtn edge" data-a="cancel" aria-label="Cancelar preparo">${ui('close')}</button><div class="b-title">${m.name} · ${esc(r.name)}</div><div class="b-step num">${pos}/${vis.length}</div></div>
    <div class="b-main ${fl?'flash':''}" aria-live="polite">${main}${timer}${dots}${next}</div>
    ${r.untimed?'':'<div class="b-bar"><i id="bBar"></i></div>'}
    <div class="b-actions">${actions}</div>
  </div>`;
}
