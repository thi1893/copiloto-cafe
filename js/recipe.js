import {R} from './data.js';
import {fmtN} from './util.js';
import {S} from './store.js';

/* Contas da receita: proporção, escala das etapas, posição do moedor lembrada. */
export const baseRatio=r=>(r.water+(r.ice||0))/r.coffee;
export const doseStep=r=>r.espresso?.5:r.method==='coldbrew'?10:1;
export const ratioStep=r=>r.espresso?.1:.5;
/* Vazão de referência para o ritmo do despejo, em g/s. No coado o guia pede 4–6 g/s;
   nos métodos de imersão a água entra de uma vez. */
const POUR_RATE={v60:5,kalita:5,chemex:5};
export function calc(ctx){
  const r=R[ctx.recipeId],total=ctx.dose*ctx.ratio,base=r.water+(r.ice||0),f=total/base;
  let prev=0;
  const steps=r.steps.map((s,i)=>{
    const o={...s,to:s.shot?Math.round(r.water*f):s.to!=null?Math.round(s.to*f):null,add:s.add?Math.round(r.dil*f):null};
    if(o.to!=null&&!s.shot){
      o.from=prev;
      if(s.t!=null){ // pe = segundo em que o despejo deve terminar; depois disso é só esperar
        const nx=r.steps[i+1],win=nx&&nx.t!=null?nx.t-s.t:null;
        let d=s.pe!=null?s.pe-s.t:Math.max(5,Math.round((o.to-prev)/(POUR_RATE[r.method]||15)));
        if(win!=null)d=Math.min(d,win);
        o.pe=s.t+d;
      }
      prev=o.to;
    }
    return o;
  });
  return{f,water:Math.round(r.water*f),ice:r.ice?Math.round(r.ice*f):0,dil:r.dil?Math.round(r.dil*f):0,steps};
}
export function line(r,dose,water,ice){
  if(r.fixed)return`${r.doseNote} → ${r.waterNote}`;
  return`${fmtN(dose)} g → ${water} g${ice?` + ${ice} g gelo`:''}`;
}
/* Bebidas guardam dose, proporção e moedor na memória do espresso base. */
export const memKey=rid=>R[rid].base||rid;
export function grinderFor(rid){
  const r=R[rid],m=S.mem[memKey(rid)]||{},g=m.g??(m.grind&&m.grind._);
  return g??r.gStart??Math.round((r.grinder[0]+r.grinder[1])/2);
}
export function makeCtx(rid,o={}){
  const r=R[rid],m=S.mem[memKey(rid)]||{};
  const dose=r.fixed?r.coffee:(o.dose??m.dose??r.coffee);
  const ratio=r.fixed?baseRatio(r):(o.ratio??m.ratio??baseRatio(r));
  return{recipeId:rid,dose,ratio,grinder:o.grinder??grinderFor(rid)};
}
export function ctxFromBrew(b){
  if(!R[b.recipeId])return null;
  const latest=S.brews.find(x=>x.recipeId===b.recipeId);
  return latest&&latest.id===b.id?makeCtx(b.recipeId):makeCtx(b.recipeId,{dose:b.dose,ratio:b.ratio,grinder:b.grinder});
}
export const gRange=r=>r.grinder[0]===r.grinder[1]?String(r.grinder[0]):r.grinder[0]+'–'+r.grinder[1];
