import {INNER_BURR, R} from './data.js';
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
  return gc((g??r.gStart??Math.round((r.grinder[0]+r.grinder[1])/2))+burrShift());
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
  return latest&&latest.id===b.id?makeCtx(b.recipeId):makeCtx(b.recipeId,{dose:b.dose,ratio:b.ratio,grinder:gNow(b)});
}

/* Mó interna. As receitas estão calibradas com ela no INNER_BURR. Um número maior afasta as
   mós (mais grosso), então a mesma moagem pede posições externas menores, e vice-versa.
   burrK = quantas posições externas equivalem a um passo interno (estimativa, ajustável). */
export const burrNow=()=>S.burr??INNER_BURR;
export const burrK=()=>S.burrK??6;
export const burrShift=()=>-(burrNow()-INNER_BURR)*burrK();
const gc=v=>Math.min(60,Math.max(1,Math.round(v)));
const gNeed=r=>[r.grinder[0]+burrShift(),r.grinder[1]+burrShift()]; // o que a receita pede, sem limitar
export const gSpan=r=>gNeed(r).map(gc);
export const gRange=r=>{const[a,b]=gSpan(r);return a===b?String(a):a+'–'+b};
/* 'max' = pede mais grosso que 60; 'min' = pede mais fino que 1; '' = dentro do alcance. */
export const gLimit=r=>{const[a,b]=gNeed(r);return a>60?'max':b<1?'min':''};
/* Posição da mó interna que traria a receita para dentro do alcance. */
export function burrFix(r){
  const[a,b]=gNeed(r),k=burrK();
  const n=a>60?burrNow()+Math.ceil((a-60)/k):b<1?burrNow()-Math.ceil((1-b)/k):burrNow();
  return Math.min(10,Math.max(1,n));
}
/* Posição real do moedor → valor guardado na escala de referência. Parado no limite numa receita
   fora do alcance não é preferência: fica sem valor, para a posição voltar a seguir a receita. */
export const gStore=(g,r)=>{const l=r?gLimit(r):'';return(l==='max'&&g>=60)||(l==='min'&&g<=1)?undefined:g-burrShift()};
/* Um preparo antigo pode ter sido feito com a mó interna em outra posição: equivalente de hoje. */
export const gNow=b=>gc(b.grinder-(burrNow()-(b.burr??INNER_BURR))*burrK());
