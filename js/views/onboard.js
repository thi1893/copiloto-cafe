import {METHODS} from '../data.js';
import {ic} from '../icons.js';
import {S} from '../store.js';
import {UI} from '../ui.js';

export function vOnboard(){
  if(!UI.obFavs)UI.obFavs=new Set(S.favs);
  return`<div class="ob"><div class="top"><div class="brand">café<span>커피</span></div></div>
    <h1 class="h1">Quais métodos você usa?</h1><p class="lead">Eles ficam na tela inicial, prontos para preparar. Dá para mudar depois.</p>
    <div class="ob-grid">${METHODS.map(m=>`<button class="ob-m ${UI.obFavs.has(m.id)?'on':''}" data-a="obToggle" data-m="${m.id}" aria-pressed="${UI.obFavs.has(m.id)}">${ic(m.id)}${m.name}</button>`).join('')}</div>
    <div class="ob-f"><button class="btn" data-a="obNext">Começar</button></div></div>`;
}
