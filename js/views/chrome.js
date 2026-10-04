import {ui} from '../icons.js';
import {esc} from '../util.js';
import {UI} from '../ui.js';

export function confirmHtml(){const c=UI.confirm;if(!c)return'';return`<div class="modal" role="alertdialog" aria-modal="true"><div class="modal-in"><h3>${c.title}</h3>${c.body?`<p>${c.body}</p>`:''}<button class="btn ${c.danger?'danger':''}" data-a="cOk">${c.ok}</button><button class="btn soft" data-a="cNo">${c.no}</button></div></div>`}
export function toastHtml(){const t=UI.toast;if(!t)return'';return`<div class="toast" role="status"><span>${esc(t.msg)}</span>${t.undo?'<button data-a="undo">Desfazer</button>':''}</div>`}
export function tabbar(cur){const t=(v,l,i)=>`<button class="tab ${cur===v?'on':''}" data-a="tab" data-t="${v}" aria-current="${cur===v?'page':'false'}">${ui(i)}${l}</button>`;
  return`<nav class="tabbar"><div class="tabbar-in">${t('home','Início','home')}${t('history','Histórico','hist')}</div></nav>`}
