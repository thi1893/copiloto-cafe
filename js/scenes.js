import {MI} from './icons.js';
import {norm} from './util.js';

/* Ilustrações das etapas. Cada cena junta um recipiente (o ícone do método ou da bebida)
   com a ação da etapa desenhada por cima: despejar, girar, mexer, drenar, extrair…
   A ação vem de `p` na etapa, quando definida; senão é deduzida do tipo e do texto. */

const CUP='<path d="M12 21h22v7a8 8 0 0 1-8 8h-6a8 8 0 0 1-8-8z"/><path d="M34 23h2.5a3.5 3.5 0 0 1 0 7H33"/><path d="M9 41h28v4H9z"/>';
const PITCHER='<path d="M15 14h18l3.5-3v25.5a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3z"/><path d="M15 19h-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h3"/>';

/* Altura da boca de cada recipiente (no quadro 48×48 do ícone): onde o fio de líquido termina. */
const MOUTH={v60:15,kalita:16,chemex:9,aeropress:9,clever:14,french:17,moka:9,coldbrew:14,cup:23,pitcher:16,
  'dr-macchiato':21,'dr-cortado':14,'dr-piccolo':16,'dr-flat-white':21,'dr-cappuccino':15,'dr-latte':10,'dr-mocha':14,
  'dr-americano':20,'dr-long-black':19,'dr-tonica':9,'dr-latte-gelado':13,'dr-affogato':15,'dr-caramel-macchiato':11,
  'dr-caramel-gelado':13,'dr-vanilla-latte':19,'dr-white-mocha':14,'dr-doce-de-leite':24,'dr-bombon':15};

export function stepKind(r,s){
  if(s.p)return s.p;
  if(s.shot)return'shot';
  if(s.drain)return r.method==='chemex'?'wait':'drain';
  const a=norm(s.a);
  if(/vaporize/.test(a))return'steam';
  if(/caramelo/.test(a))return'drizzle';
  if(/colher/.test(a))return'spoon';
  if(/despeje o espresso|sobre o sorvete/.test(a))return'pourShot';
  if(/bloom/.test(a))return'bloom';
  if(s.to!=null||s.add!=null||s.q!=null&&/agua/.test(a))return'pour';
  if(/despeje/.test(a))return'pourMilk';
  if(/mexa|misture|quebre/.test(a))return'stir';
  if(/gir[eo]/.test(a))return'swirl';
  if(/pressione|embolo/.test(a))return'press';
  if(/tire do fogo/.test(a))return'lift';
  if(/fogo|acompanhe/.test(a))return'heat';
  if(/geladeira/.test(a))return'cool';
  if(/valvula/.test(a))return'drain';
  return'wait';
}

function vesselFor(r,s,kind){
  if(kind==='shot')return'cup';
  if(kind==='steam')return'pitcher';
  if(s.add!=null)return'cup';
  return MI[r.id]?r.id:r.method;
}

const KETTLE='<path d="M8 8h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z"/><path d="M6 11H4.5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2H6"/><path d="M23 19c11 0 11-9 23-9"/>';
const flame=cx=>`<path class="flick" d="M${cx} 77c-5-3-3-8 0-12 3 4 5 9 0 12z"/>`;

const ACT={
  pour:m=>`${KETTLE}<path class="flow" d="M46 10c2 .2 2 1.6 2 4V${m+2}"/>`,
  bloom:m=>`${ACT.pour(m)}<circle class="dot" cx="43.5" cy="${m+7}" r="1.2"/><circle class="dot" cx="50.5" cy="${m+10}" r="1.2"/><circle class="dot" cx="53" cy="${m+5.5}" r="1.2"/>`,
  pourMilk:m=>`<path d="M10 14L22 2l14 14-12 12z"/><path d="M13.5 9.5c-5-5-10.5 0-6.5 5.5"/><path class="flow" d="M36 16c6 1 12 3 12 9V${m+2}"/>`,
  pourShot:m=>`<path d="M14 6L32 20A11.4 11.4 0 0 1 14 6z"/><path d="M11.8 16.4a4.4 4.4 0 1 0 6.6 6.8"/><path class="flow" d="M32 20c8 1.5 16 2 16 8V${m+2}"/>`,
  shot:m=>`<path d="M30 5h36"/><path d="M34 5v9a3 3 0 0 0 3 3h22a3 3 0 0 0 3-3V5"/><path d="M62 10h23"/><path class="flow" d="M44 17V${m+1}"/><path class="flow" d="M50 17V${m+1}"/>`,
  steam:m=>`<path d="M72 3L54 ${m+26}"/><path class="rise" d="M31 ${m-14}c-1.6 2 1.6 3.5 0 5.5"/><path class="rise r2" d="M37 ${m-16}c-1.6 2 1.6 3.5 0 5.5"/><path class="flow" d="M41 ${m+19}a8 3 0 1 0 13 -1.5"/>`,
  stir:m=>`<path class="wig" d="M67 4L52 ${m+10}"/><ellipse class="wig" cx="51" cy="${m+13}" rx="3" ry="4.5" transform="rotate(22 51 ${m+13})"/><path d="M27 16a9 5 0 1 1 7 4.3"/><path d="M34 20.300l1.2-4.700M34 20.300l4.8 1"/>`,
  swirl:()=>`<path d="M26 25a22 9 0 0 1 44 0"/><path d="M70 25l-6.5-1M70 25l-1.5-6.5"/>`,
  press:()=>`<g class="bob"><path d="M48 4v18"/><path d="M41 15l7 7 7-7"/></g>`,
  lift:()=>`<g class="bob up"><path d="M48 24V6"/><path d="M41 13l7-7 7 7"/></g>`,
  heat:()=>flame(38)+flame(48)+flame(58),
  cool:()=>`<path d="M48 5v22M38.5 10.500l19 11M38.5 21.500l19-11"/><path d="M45 7.500l3 3 3-3M45 24.500l3-3 3 3"/>`,
  wait:()=>`<circle cx="48" cy="16" r="10.5"/><path d="M48 16V9.5"/><path class="hand" d="M48 16V10"/>`,
  drain:()=>`<circle class="drop" cx="48" cy="47" r="1.4"/><circle class="drop d2" cx="48" cy="47" r="1.4"/><path d="M34 60h28v8a6 6 0 0 1-6 6H40a6 6 0 0 1-6-6z"/>`,
  spoon:m=>`<path d="M22 ${m-12}h23"/><ellipse cx="53" cy="${m-12}" rx="8" ry="4.5"/><path d="M47.5 ${m-15}c2-4 9-4 11 0"/><circle class="drop" cx="53" cy="${m-6}" r="1.4"/>`,
  drizzle:m=>`<path d="M9 7l10 8-5.5 7-10-8z"/><path d="M19 15l5 4"/><path class="flow" d="M24 19c6 2 9 4 9 ${m-3-19}"/><path d="M33 ${m+4}l4.6-5 4.6 5 4.6-5 4.6 5 4.6-5"/>`
};
const LIFTED={drain:2,heat:20};

export function scene(r,s,cls=''){
  const kind=stepKind(r,s),ves=vesselFor(r,s,kind),oy=LIFTED[kind]??30;
  const body=ves==='cup'?CUP:ves==='pitcher'?PITCHER:MI[ves]||CUP;
  const m=oy+(MOUTH[ves]??16);
  return`<svg class="scene ${cls}" viewBox="0 0 96 80" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><g transform="translate(24 ${oy})"><g class="ves${kind==='swirl'?' sway':''}">${body}</g></g><g class="act">${(ACT[kind]||ACT.wait)(m)}</g></svg>`;
}
