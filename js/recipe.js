import {R} from './data.js';
import {fmtN} from './util.js';
import {S} from './store.js';

/* Contas da receita: proporção, escala das etapas, posição do moedor lembrada. */
export const baseRatio=r=>(r.water+(r.ice||0))/r.coffee;
export const doseStep=r=>r.espresso?.5:r.method==='coldbrew'?10:1;
export const ratioStep=r=>r.espresso?.1:.5;
export function calc(ctx){
  const r=R[ctx.recipeId],total=ctx.dose*ctx.ratio,base=r.water+(r.ice||0),f=total/base;
  return{f,water:Math.round(r.water*f),ice:r.ice?Math.round(r.ice*f):0,dil:r.dil?Math.round(r.dil*f):0,
    steps:r.steps.map(s=>({...s,to:s.shot?Math.round(r.water*f):s.to!=null?Math.round(s.to*f):null,add:s.add?Math.round(r.dil*f):null}))};
}
export function line(r,dose,water,ice){
  if(r.fixed)return`${r.doseNote} → ${r.waterNote}`;
  return`${fmtN(dose)} g → ${water} g${ice?` + ${ice} g gelo`:''}`;
}
export function grinderFor(rid){
  const r=R[rid],m=S.mem[rid]||{},g=m.g??(m.grind&&m.grind._);
  return g??r.gStart??Math.round((r.grinder[0]+r.grinder[1])/2);
}
export function makeCtx(rid,o={}){
  const r=R[rid],m=S.mem[rid]||{};
  const dose=r.fixed?r.coffee:(o.dose??m.dose??r.coffee);
  const ratio=r.fixed?baseRatio(r):(o.ratio??m.ratio??baseRatio(r));
  return{recipeId:rid,dose,ratio,grinder:o.grinder??grinderFor(rid)};
}
export function ctxFromBrew(b){
  if(!R[b.recipeId])return null;
  const latest=S.brews.find(x=>x.recipeId===b.recipeId);
  return latest&&latest.id===b.id?makeCtx(b.recipeId):makeCtx(b.recipeId,{dose:b.dose,ratio:b.ratio,grinder:b.grinder});
}
