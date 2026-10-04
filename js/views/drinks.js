import {RECIPES} from '../data.js';
import {ic, ui} from '../icons.js';
import {esc} from '../util.js';

/* Lista de bebidas: cada linha abre o preparo direto. Usada no Início e na página Bebidas. */
export const drinkBase=r=>r.base==='esp-r'?'Ristretto':'Espresso duplo';
export function drinkRows(){
  return RECIPES.filter(r=>r.drink).map(r=>`<div class="row" data-a="prep" data-r="${r.id}" role="button" tabindex="0">${ic(r.id,'mi')}
      <div class="row-m"><div class="row-t">${esc(r.name)}</div><div class="row-s">${drinkBase(r)} + ${esc(r.extra)}</div></div>${ui('chev','chev')}</div>`).join('');
}
