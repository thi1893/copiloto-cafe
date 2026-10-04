/* Estado persistente. Tudo fica no aparelho (localStorage); não há conta nem servidor. */
export const KEY='cafe.app.v1';
export function fresh(){return{v:1,onboarded:false,favs:['v60','espresso'],brews:[],mem:{},methodLast:{},prefs:{sound:true,countdown:true,wake:true,vibe:true,theme:'auto',palette:'cinza'},active:null}}
export function load(){
  try{const s=Object.assign(fresh(),JSON.parse(localStorage.getItem(KEY)||'null')||{});s.prefs=Object.assign(fresh().prefs,s.prefs||{});
    if(s.gcal!==2){for(const k in s.mem){delete s.mem[k].g;delete s.mem[k].grind}s.gcal=2} // moedor recalibrado
    if(s.drinksAdded!==2){if(s.drinksAdded===1)s.favs=s.favs.filter(f=>f!=='drinks');s.drinksAdded=2} // bebidas têm seção própria no Início; sai o cartão automático
    return s}
  catch(e){return fresh()}
}
export const S=load();
export function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
