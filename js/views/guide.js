import {MILK} from '../drinks.js';
import {ui} from '../icons.js';
import {UI} from '../ui.js';

/* Guias ilustrados: vaporizar o leite e latte art.
   As ilustrações são SVG animados por CSS (classes g-*, h-*, t-*, r-* em css/app.css);
   sem animação (movimento reduzido), cada desenho fica no quadro final. */

let seq=0;
const svg=(vb,inner)=>`<svg class="gsvg" viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
const T=(x,y,t,anchor='start',cls='')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" class="gt ${cls}">${t}</text>`;
const PV='36 0 176 138'; // quadro das vistas de lado da jarra
const view=(cap,art)=>`<figure class="g-view"><figcaption>${cap}</figcaption>${art}</figure>`;

/* ---------- jarra vista de lado (quadro 200×150) ---------- */
const PIT=`<path d="M70 36L72 124a6 6 0 0 0 6 6h44a6 6 0 0 0 6-6L130 46l12-13"/><path d="M70 36L142 33"/><path d="M130 46L122 80"/><path d="M70 52h-8a12 12 0 0 0-12 12v32a12 12 0 0 0 12 12h9"/>`;
function pitcher({level=80,lvl='',inside='',over=''}){
  const id='pc'+(++seq);
  return`<clipPath id="${id}"><path d="M71 37L73 124a5 5 0 0 0 5 5h44a5 5 0 0 0 5-5L129 46 141 34z"/></clipPath>
  <g clip-path="url(#${id})"><g class="${lvl}"><rect class="milk" x="56" y="${level}" width="96" height="80"/><path d="M56 ${level}h96"/>${inside}</g></g>${PIT}${over}`;
}
const wand=(x,y,cls='')=>`<g class="${cls}"><path class="wand" d="M${x+29} 12L${x} ${y}"/><circle class="acc-f" cx="${x}" cy="${y}" r="2.4"/></g>`;
const bubbles=(x,y)=>[[-12,0],[10,.25],[-6,.5],[14,.75]].map(([dx,d])=>`<circle class="g-bub acc-f" cx="${x}" cy="${y+3}" r="1.5" style="--bx:${dx}px;animation-delay:${d}s"/>`).join('');

/* ---------- jarra vista de cima (quadro 150×150) ---------- */
const TOP=`<circle class="milk" cx="75" cy="78" r="47"/><circle cx="75" cy="78" r="50"/><path d="M64 29.5L75 16l11 13.5"/><path d="M67 127v9a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-9"/>`;
const topView=(extra)=>svg('0 0 150 150',TOP+T(75,11,'bico da jarra','middle','b')+T(75,149,'alça','middle','b')+extra);

const RISE={flat:['Flat white, cortado','10–20%',7],latte:['Latte','20–30%',12],capp:['Cappuccino','40–50%',21]};

function steamSteps(){
  const d=RISE[UI.gDrink]?UI.gDrink:'latte',rise=RISE[d][2];
  return[
   {t:'Quanto leite',art:svg(PV,pitcher({lvl:'g-fill'})+`<path class="lead" d="M124 80h30"/>`+T(158,83,'base do bico')),
    p:'Leite gelado (cerca de 4 °C) em jarra fria, até a base do bico da jarra. O espaço acima é para o leite crescer. Na sua máquina, use a jarra de 350 ml e faça uma bebida por vez.'},
   {t:'Onde fica a ponta',two:1,
    art:view('de lado',svg(PV,pitcher({inside:bubbles(104,82)})+wand(104,84,'g-bob')+`<path class="lead" d="M110 84h44"/>`+T(158,82,'logo abaixo')+T(158,92,'da superfície')))
       +view('de cima',topView(`<path class="lead" d="M75 78h18M75 78v-14"/><circle class="g-vort acc-s" cx="75" cy="78" r="33"/><path class="acc-s" d="M108 76l-3.5 7M108 76l5.5 5"/><circle class="acc-f" cx="95" cy="64" r="4.2"/>`+T(95,54,'ponta','middle','b'))),
    p:'Antes, abra o vapor por um segundo para tirar a água condensada. A ponta entra logo abaixo da superfície, um pouco fora do centro, com a jarra levemente inclinada. Fora do centro é o que faz o leite girar.'},
   {t:'Aeração',chips:1,
    art:`<div style="--rise:${rise}">`+svg(PV,pitcher({lvl:'g-rise',inside:bubbles(104,80)})+wand(104,81,'g-rise')+`<path class="lead" d="M124 80h30"/><path class="lead g-rise" d="M124 80h30"/>`+T(158,91,'começo')+`<g class="g-rise">${T(158,77,'+'+RISE[d][1])}</g>`)+`</div>`,
    p:'Abra o vapor todo com a ponta na superfície: o leite ganha ar, com um chiado curto de papel rasgando. Vá baixando a jarra conforme o leite sobe. Pare quando a jarra chegar à temperatura da mão (30–37 °C).'},
   {t:'Texturização',two:1,
    art:view('de lado',`<div style="--rise:${rise}">`+svg(PV,pitcher({level:80-rise,inside:`<ellipse class="g-vort acc-s" cx="100" cy="${102-rise/2}" rx="22" ry="6"/>`})+wand(104,88-rise)+`<path class="lead" d="M110 ${88-rise}h44"/>`+T(158,86-rise,'alguns mm')+T(158,96-rise,'mais fundo'))+`</div>`)
       +view('de cima',topView(`<g class="g-spin acc-s"><path d="M75 70a8 8 0 1 1-8 8a16 16 0 1 0 16-16a24 24 0 1 1-24 24a32 32 0 1 0 32-32"/></g><circle class="acc-f" cx="95" cy="64" r="4.2"/>`)),
    p:'Afunde a ponta alguns milímetros e mantenha o redemoinho até 55–65 °C. Não entra mais ar: o giro desfaz as bolhas e deixa a espuma fina.'},
   {t:'Finalize',art:svg(PV,`<g class="g-tap">${pitcher({level:80-rise,over:`<path class="acc-s" d="M84 ${86-rise}q16-5 32 0"/>`})}</g><path class="lead" d="M58 136h84"/>`),
    p:'Feche o vapor, limpe a haste com pano úmido e purgue de novo. Bata a jarra na bancada, gire até o leite brilhar como tinta fresca e sirva sem demora.'}
  ];
}

/* ---------- latte art ---------- */
const CUP_SIDE=`<path d="M64 88h76"/><path d="M64 88a38 34 0 0 0 76 0"/><path d="M140 94h5a9 9 0 0 1 0 18h-9"/>`;
const JUG=`<path d="M10 14L22 2l14 14-12 12z"/><path d="M13.5 9.500c-5-5-10.5 0-6.5 5.5"/>`;
const CUP_TOP=`<circle cx="75" cy="75" r="56"/><circle class="crema" cx="75" cy="75" r="50"/><path d="M131 65h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6h-8"/>`;
const cupTop=inner=>svg('0 0 160 150',CUP_TOP+inner);
const HEART='M75 108C54 93 45 80 45 66a15 15 0 0 1 30-3 15 15 0 0 1 30 3c0 14-9 27-30 42z';
function leaf(){ // balanço que estreita enquanto recua
  let d='M75 106';
  for(let k=0;k<10;k++){const y=106-6*k,a=(24-2*k)*(k%2?-1:1);d+=`Q${75+a} ${y-3} 75 ${y-6}`}
  return d;
}

function artPhases(){
  return[
   {t:'Base',art:svg('0 0 200 150',`<g transform="rotate(-16 102 104)">${CUP_SIDE}</g><g class="acc-s" transform="translate(18 2) scale(1.7)">${JUG}</g><path class="flow acc-s" d="M79 29c8 2 14 8 15 22V88"/><path class="acc-s" d="M94 92c1 9 7 13 16 13"/><path class="acc-s" d="M110 105l-5-3.500M110 105l-4.5 4"/><path class="lead" d="M124 30v56M120 30h8M120 86h8"/>`+T(132,61,'5–10 cm')),
    p:'Comece com crema íntegra e leite recém-texturizado. Incline a xícara e despeje do alto, em fio fino: o leite afunda sob a crema. Vá assim até a metade da xícara.'},
   {t:'Aproxime',art:svg('0 0 200 150',`<g transform="rotate(-8 102 104)">${CUP_SIDE}</g><g class="acc-s" transform="translate(46 40) scale(1.7)">${JUG}</g><path class="flow acc-s thick" d="M107 67c3 3 4 7 4 12v6"/><ellipse class="art g-grow" cx="112" cy="87" rx="17" ry="3.4"/>`),
    p:'Aproxime o bico da jarra da superfície e aumente a vazão. É aí que o branco aparece.'},
   {t:'Endireite e corte',art:svg('0 0 200 150',`${CUP_SIDE}<path d="M70 132h64"/><ellipse class="art" cx="102" cy="92" rx="22" ry="3.6"/><g class="g-lift acc-s"><g transform="translate(40 30) scale(1.7)">${JUG}</g><path class="flow" d="M101 57c3 3 4 8 4 14v19"/></g><path class="acc-s" d="M150 62l10-7M160 55l-7-.500M160 55l-1.5 6.5"/>`),
    p:'Endireite a xícara aos poucos enquanto ela enche. Para finalizar, levante a jarra e corte o desenho com um fio fino, atravessando de um lado ao outro.'}
  ];
}
function artPatterns(){
  const L=leaf();
  return[
   {t:'Coração',tag:'1º a aprender',art:cupTop(`<circle class="art h-blob" cx="75" cy="78" r="27"/><path class="art h-heart" d="${HEART}"/><path class="acc-s h-cut" pathLength="100" d="M75 40V114"/><g transform="translate(75 78)"><circle class="acc-f h-dot" r="4"/></g>`),
    p:'Despejo fixo no centro até formar o círculo branco; depois levante a jarra e faça o corte.'},
   {t:'Tulipa',tag:'2º',art:cupTop(`<ellipse class="art t-e1" cx="75" cy="68" rx="25" ry="15"/><ellipse class="art t-e2" cx="75" cy="80" rx="23" ry="14"/><circle class="art t-e3" cx="75" cy="94" r="14"/><path class="acc-s t-cut" pathLength="100" d="M75 36V114"/>`),
    p:'Camadas empilhadas: despeje, pare, recue um pouco e despeje de novo. Cada camada empurra a anterior. Termine com o corte.'},
   {t:'Rosetta',tag:'3º',art:cupTop(`<path class="r-leaf" pathLength="100" d="${L}"/><path class="acc-s r-cut" pathLength="100" d="M75 38V112"/><circle class="acc-f r-dot" r="4" style="offset-path:path('${L}')"/>`),
    p:'Balance a jarra de um lado para o outro enquanto recua em direção à borda; as folhas se abrem sozinhas. Termine com o corte de volta.'},
   {t:'Cisne',tag:'4º',p:'Rosetta deslocada para um lado, depois o pescoço em um fio curvo e a cabeça em um pequeno coração. Vale tentar quando a rosetta já sai firme.'}
  ];
}

const card=(s,i)=>`<section class="card gcard2">${s.art?`<div class="g-art ${s.two?'two':''}">${s.art}</div>`:''}
  <div class="g-h"><span class="g-n num">${i}</span><h2 class="g-t">${s.t}</h2>${s.tag?`<span class="g-tag">${s.tag}</span>`:''}</div>
  ${s.chips?`<div class="chips g-chips">${Object.entries(RISE).map(([k,v])=>`<button class="chip ${((RISE[UI.gDrink]?UI.gDrink:'latte')===k)?'on':''}" data-a="gDrink" data-v="${k}" aria-pressed="${UI.gDrink===k}">${v[0]} · +${v[1]}</button>`).join('')}</div>`:''}
  <p class="g-p">${s.p}</p></section>`;

export function vGuide(g){
  seq=0;
  const top=`<div class="top"><button class="ibtn edge" data-a="back" aria-label="Voltar">${ui('back')}</button><div class="top-t">Técnica</div><span style="width:44px"></span></div>`;
  if(g==='art')return`<div class="wrap">${top}<h1 class="h1">Latte art</h1><p class="desc">O despejo tem três fases, iguais para qualquer desenho. O ponto colorido nas xícaras é o bico da jarra.</p>
    <div class="g-list">${artPhases().map((s,i)=>card(s,i+1)).join('')}</div>
    <section class="sec"><div class="sec-h"><span class="sec-t">desenhos, na ordem de aprendizado</span></div><div class="g-list" style="margin-top:0">${artPatterns().map((s,i)=>card(s,i+1)).join('')}</div></section></div>`;
  return`<div class="wrap">${top}<h1 class="h1">Vaporizar o leite</h1><p class="desc">Duas fases: primeiro entra ar, depois o redemoinho deixa a espuma fina. Alvo: brilho de tinta fresca, sem bolhas, entre 55 e 65 °C.</p>
    <div class="g-list">${steamSteps().map((s,i)=>card(s,i+1)).join('')}</div>
    <details class="disc" style="margin-top:14px"><summary>Na sua máquina</summary><div class="disc-b"><ul>${MILK.machine.map(x=>`<li>${x}</li>`).join('')}</ul></div></details>
    <details class="disc"><summary>Cuidados com o leite</summary><div class="disc-b"><ul>${MILK.care.map(x=>`<li>${x}</li>`).join('')}</ul></div></details>
    <button class="btn soft mt" data-a="guide" data-g="art">Seguir para latte art</button></div>`;
}

/* Linhas de entrada para os guias (Início e página Bebidas). */
export function guideRows(){
  const row=(g,icon,t,s)=>`<div class="row" data-a="guide" data-g="${g}" role="button" tabindex="0"><svg class="mi" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg>
    <div class="row-m"><div class="row-t">${t}</div><div class="row-s" style="white-space:normal">${s}</div></div>${ui('chev','chev')}</div>`;
  return row('steam','<path d="M13 15h18l3.5-3v25.500a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3z"/><path d="M13 20h-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h3"/><path d="M41 3L27 27"/><path d="M13 27h21.5"/>','Vaporizar o leite','Quanto leite, onde fica a ponta, aeração e textura')
        +row('art','<circle cx="22" cy="24" r="15"/><path d="M37 20h3a4 4 0 0 1 0 8h-3"/><path d="M22 31.500c-6-4.5-8.5-7.5-8.5-11a4.2 4.2 0 0 1 8.5-1.5 4.2 4.2 0 0 1 8.5 1.500c0 3.5-2.5 6.5-8.5 11z"/>','Latte art','As três fases do despejo e os desenhos: coração, tulipa, rosetta');
}
