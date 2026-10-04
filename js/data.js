import {drinks} from './drinks.js';

/* Métodos, receitas e conhecimento do Guia do Barista.
   Para adicionar uma receita, inclua um item em RECIPES. */
export const METHODS=[
  {id:'v60',name:'V60',sub:'Hario · coado'},
  {id:'espresso',name:'Espresso',sub:'Tramontina by Breville Express'},
  {id:'drinks',name:'Bebidas',sub:'Clássicos com espresso'},
  {id:'kalita',name:'Kalita Wave',sub:'Coado · fundo plano'},
  {id:'chemex',name:'Chemex',sub:'Coado · papel grosso'},
  {id:'aeropress',name:'AeroPress',sub:'Imersão e pressão'},
  {id:'clever',name:'Clever / Switch',sub:'Imersão com papel'},
  {id:'french',name:'Prensa francesa',sub:'Imersão'},
  {id:'moka',name:'Moka',sub:'Fogão'},
  {id:'coldbrew',name:'Cold brew',sub:'Infusão a frio'}
];
export const PREP_POUR=['Filtro enxaguado com água quente (tira o gosto de papel)','Pó nivelado e balança tarada'];
export const PREP_ESP=['Máquina aquecida 20–30 min, porta-filtro encaixado','Cesto duplo de parede simples','Desfaça grumos, nivele e compacte rente à borda','Xícara aquecida sobre a balança'];
export const DRAIN={drain:1,a:'Drenagem',n:'Toque em Drenou quando a água terminar de passar'};
export const RECIPES=[
 {id:'v60-1',method:'v60',name:'1 xícara',tag:'5 despejos',by:'James Hoffmann',desc:'Muito consistente em doses pequenas. Bom ponto de partida para qualquer café.',level:'Fácil',profile:'Equilibrado e limpo',
  coffee:15,water:250,temp:'92–98 °C',grind:'Média-fina',grinder:[54,60],gStart:56,exp:'~3:00',time:[165,195],act:{fast:150,slow:210,d:2},prep:PREP_POUR,
  steps:[{t:0,to:50,a:'Bloom',n:'Gire o suporte até não sobrar pó seco'},{t:45,to:100,a:'2º despejo',n:'Espiral do centro para fora'},{t:70,to:150,a:'3º despejo'},{t:90,to:200,a:'4º despejo'},{t:110,to:250,a:'5º despejo',n:'Termine com um giro suave'},{t:130,...DRAIN}],
  tips:['Despeje a 4–6 g/s, sem bater direto no papel.','Mós cônicas geram mais finos: despeje baixo e gire com suavidade para não travar a drenagem.','Café muito fresco pede bloom de até 60 s.','Leito em cratera ou pó alto nas paredes indica extração desigual.']},
 {id:'v60-2',method:'v60',name:'2 xícaras',tag:'despejo longo',by:'James Hoffmann',desc:'Para dividir. Poucos despejos grandes, mexida no final para soltar o pó das paredes.',level:'Médio',profile:'Doce, corpo médio',
  coffee:30,water:500,temp:'95–100 °C',grind:'Média-fina',grinder:[58,63],gStart:60,exp:'~3:30',time:[195,225],act:{fast:180,slow:240,d:2},prep:[...PREP_POUR,'Abra um pequeno poço no centro do pó'],
  steps:[{t:0,to:60,a:'Bloom',n:'Gire até não sobrar pó seco'},{t:45,to:300,pe:75,a:'Despejo principal',n:'Chegue a 300 g em 1:15'},{t:75,to:500,pe:105,a:'Despejo final',n:'Mais devagar — 500 g em 1:45'},{t:105,act:1,a:'Mexa uma vez em cada sentido',n:'Com a colher; depois um giro suave'},{t:120,...DRAIN}],
  tips:['Use água recém-fervida.','A mexida final solta o pó das paredes e deixa o leito plano.']},
 {id:'v60-46',method:'v60',name:'Método 4:6',tag:'5 × 60 g',by:'Tetsu Kasuya',desc:'Campeão mundial de Brewers Cup 2016. Os 40% iniciais definem doçura e acidez; os 60% finais, a força.',level:'Médio',profile:'Doce, mais corpo',
  coffee:20,water:300,temp:'92–93 °C',grind:'Grossa',grinder:[66,72],gStart:69,exp:'3:30',prep:PREP_POUR,
  steps:[{t:0,to:60,a:'1º despejo',n:'Molhe todo o pó'},{t:45,to:120,a:'2º despejo'},{t:90,to:180,a:'3º despejo'},{t:135,to:240,a:'4º despejo'},{t:180,to:300,a:'5º despejo'},{t:210,end:1,a:'Retire o suporte'}],
  tips:['Mais doçura: 50 g e depois 70 g nos dois primeiros despejos. Mais acidez: 70 g e depois 50 g.','Cada despejo deve drenar quase todo em 45 s. Sobrou água no leito: a moagem está fina demais.','Mais despejos nos 60% finais concentram; menos deixam mais leve.']},
 {id:'v60-cont',method:'v60',name:'Despejo contínuo',tag:'pouca agitação',desc:'Um despejo único em espiral lenta. Alta repetibilidade.',level:'Fácil',profile:'Limpo, leve',
  coffee:15,water:250,temp:'92–98 °C',grind:'Média-fina',grinder:[56,61],gStart:58,exp:'2:30–3:00',time:[150,180],act:{fast:135,slow:195,d:2},prep:PREP_POUR,
  steps:[{t:0,to:45,a:'Bloom',n:'Gire o suporte'},{t:45,to:250,pe:105,a:'Despejo contínuo',n:'Espiral lenta — termine por volta de 1:45'},{t:105,act:1,a:'Giro suave',n:'Assenta o leito plano'},{t:115,...DRAIN}],
  tips:['Mantenha a vazão constante; o leito não deve secar nem transbordar.']},
 {id:'v60-ice',method:'v60',name:'Gelado',tag:'método japonês',desc:'O gelo substitui ~40% da água e resfria na hora, preservando os aromas.',level:'Fácil',profile:'Aromático, refrescante',
  coffee:16,water:150,ice:100,temp:'95–98 °C',grind:'Média-fina, um ponto mais fina',grinder:[52,58],gStart:55,exp:'2:15–2:45',time:[135,165],act:{fast:120,slow:180,d:2},prep:PREP_POUR,
  steps:[{t:0,to:45,a:'Bloom',n:'45 s de espera'},{t:45,to:100,a:'2º despejo'},{t:70,to:150,pe:90,a:'3º despejo',n:'Termine perto de 1:30'},{t:95,drain:1,a:'Drenagem',n:'Toque em Drenou; depois gire o servidor até o gelo derreter'}],
  tips:['Aguado: desça 2 posições no moedor.','Sirva sobre gelo novo.']},
 {id:'kalita',method:'kalita',name:'Padrão',tag:'5 despejos',desc:'Fundo plano com três furos: mais tolerante a falhas de despejo.',level:'Fácil',profile:'Doce e redondo',
  coffee:16,water:256,temp:'92–95 °C',grind:'Média',grinder:[60,65],gStart:62,exp:'3:00–3:30',time:[180,210],act:{fast:165,slow:225,d:2},prep:PREP_POUR,
  steps:[{t:0,to:45,a:'Bloom',n:'40 s de espera'},{t:40,to:100,a:'2º despejo',n:'Sempre no centro, sem molhar as ondas'},{t:68,to:150,a:'3º despejo'},{t:96,to:200,a:'4º despejo'},{t:124,to:256,a:'5º despejo'},{t:145,...DRAIN}],
  tips:['Despejos de ~50 g a cada 25–30 s, sempre no centro.']},
 {id:'chemex',method:'chemex',name:'Padrão',tag:'2–3 xícaras',desc:'Papel grosso: xícara muito limpa e de corpo leve.',level:'Médio',profile:'Limpo, leve',
  coffee:30,water:500,temp:'94–96 °C',grind:'Média-grossa',grinder:[64,70],gStart:67,exp:'4:00–4:30',time:[240,270],act:{fast:225,slow:300,d:3},prep:['Lado de três dobras sobre o bico','Filtro bem enxaguado com água quente','Pó nivelado e balança tarada'],
  steps:[{t:0,to:75,a:'Bloom',n:'Gire para molhar tudo'},{t:45,to:300,pe:90,a:'Despejo',n:'Chegue a 300 g em 1:30'},{t:90,to:500,pe:150,a:'Despejo final',n:'Chegue a 500 g em 2:30'},{t:150,...DRAIN}],
  tips:['Passou de 5:00: a moagem está fina demais.']},
 {id:'aero',method:'aeropress',name:'Clássica',tag:'sem inverter',by:'James Hoffmann',desc:'Toda a água de uma vez, vácuo com o êmbolo, prensagem lenta.',level:'Fácil',profile:'Limpo e doce',
  coffee:11,water:200,temp:'90–95 °C',grind:'Média-fina',grinder:[42,48],gStart:45,exp:'3:00',prep:['Filtro de papel encaixado sobre a caneca','Pó no aparelho e balança tarada'],
  steps:[{t:0,to:200,a:'Toda a água',n:'Despeje de uma vez'},{t:10,act:1,a:'Encaixe o êmbolo ~1 cm',n:'Cria vácuo e para o gotejamento'},{t:120,act:1,a:'Gire suavemente o conjunto'},{t:150,act:1,a:'Pressione devagar',n:'Por 30 s, até o fim'},{t:180,end:1,a:'Pronto'}],
  tips:['Torra clara: água fervente. Torra escura: 85–90 °C.','A prensagem deve ter resistência leve. Prensa dura: suba 2 posições.']},
 {id:'aero-c',method:'aeropress',name:'Concentrada',tag:'diluída depois',desc:'Pouca água na extração, completa com água quente no final.',level:'Fácil',profile:'Mais corpo',
  coffee:18,water:100,dil:110,temp:'85–90 °C',grind:'Média-fina',grinder:[42,48],gStart:45,exp:'~1:45',prep:['Filtro de papel encaixado sobre a caneca','Pó no aparelho e balança tarada'],
  steps:[{t:0,to:100,a:'Despeje e mexa'},{t:60,act:1,a:'Pressione',n:'Em 30 s'},{t:90,add:1,manual:1,a:'Complete com água quente'}],
  tips:['A diluição final ajusta a força ao seu gosto: de 100 a 120 g.']},
 {id:'clever',method:'clever',name:'Imersão',tag:'válvula fechada',desc:'Corpo de prensa, limpeza de coado.',level:'Fácil',profile:'Corpo e doçura',
  coffee:15,water:250,temp:'94–96 °C',grind:'Média',grinder:[60,66],gStart:63,exp:'3:00–3:30',time:[180,210],act:{fast:0,slow:225,d:2},prep:['Válvula fechada','Filtro enxaguado'],
  steps:[{t:0,to:250,a:'Água primeiro',n:'Depois adicione o café — evita entupir o papel'},{t:15,act:1,a:'Mexa',n:'Molhe todo o pó'},{t:120,act:1,a:'Quebre a crosta',n:'Uma mexida leve'},{t:135,act:1,a:'Abra a válvula'},{t:145,...DRAIN}],
  tips:['A drenagem leva ~1 min. Lenta: a moagem está fina demais.','No Switch, há a opção híbrida: bloom e 1º despejo com válvula aberta, segunda metade em imersão por 1 min.']},
 {id:'french',method:'french',name:'Longa',tag:'sem borra',by:'James Hoffmann',desc:'Espera longa para os finos decantarem: xícara limpa, sem borra.',level:'Fácil',profile:'Corpo, xícara limpa',
  coffee:30,water:500,temp:'Recém-fervida',grind:'Média',grinder:[63,70],gStart:66,exp:'9–12 min',prep:['Pó na prensa e balança tarada'],
  steps:[{t:0,to:500,a:'Toda a água',n:'Sobre todo o pó'},{t:240,act:1,a:'Mexa a crosta',n:'Retire com colheres a espuma e o pó que boiarem'},{t:270,act:1,a:'Aguarde decantar',n:'Os finos descem em 5–8 min'},{t:540,act:1,a:'Desça o êmbolo até a superfície',n:'Sem prensar. Sirva devagar'},{t:570,end:1,a:'Pronto'}],
  tips:['Amargo: a moagem está fina demais; encurte a espera final.']},
 {id:'moka',method:'moka',name:'Clássica',tag:'fogo baixo',desc:'Cesto cheio, sem compactar. Tire do fogo quando o fluxo clarear.',level:'Médio',profile:'Intenso',fixed:1,doseNote:'cesto cheio',waterNote:'até abaixo da válvula',
  coffee:15,water:135,temp:'Água já quente',grind:'Fina, mais grossa que espresso',grinder:[36,42],gStart:39,exp:'2–4 min',prep:['Base com água já quente até abaixo da válvula','Cesto cheio, nivelado, sem compactar'],
  steps:[{manual:1,a:'Fogo baixo a médio',n:'Tampa aberta. Toque quando o café começar a sair'},{manual:1,a:'Acompanhe o fluxo',n:'Toque quando clarear e começar a borbulhar'},{manual:1,a:'Tire do fogo',n:'Resfrie a base em água corrente'}],
  tips:['Engasga ou amarga: suba 2 posições.']},
 {id:'cold',method:'coldbrew',name:'Concentrado',tag:'12–18 h',desc:'Concentrado na geladeira. Dilua 1:1 com água ou leite para servir.',level:'Fácil',profile:'Doce, sem amargor',untimed:1,
  coffee:100,water:800,temp:'Geladeira',grind:'Grossa',grinder:[76,78],gStart:77,exp:'12–18 h',prep:['Pote com tampa','Filtro de papel para depois'],
  steps:[{manual:1,a:'Misture café e água',n:'Molhe todo o pó'},{manual:1,a:'Tampe e leve à geladeira',n:'12–18 h. Depois filtre em papel'}],
  tips:['Ralo: alongue a infusão.','Guarde filtrado e fechado na geladeira por até 7 dias.','Pronto para beber, sem diluir: proporção 1:15 por 16–20 h.']},
 {id:'esp-n',method:'espresso',name:'Normale',tag:'1:2',espresso:1,desc:'O ponto de partida. Equilíbrio entre corpo, doçura e acidez.',level:'Médio',profile:'Equilibrado',
  coffee:17,water:34,temp:'Padrão',preinf:'Automática',grind:'Fina',grinder:[1,3],gStart:2,exp:'25–35 s',time:[25,35],act:{d:1},prep:PREP_ESP,
  steps:[{t:0,shot:1,a:'Extraia',n:'Primeiras gotas em 8–10 s'}],
  tips:['O tempo conta desde o toque no botão e inclui a pré-infusão.','Para ajuste fino entre duas posições, varie a dose em 0,5 g.']},
 {id:'esp-r',method:'espresso',name:'Ristretto',tag:'1:1,25',espresso:1,desc:'Denso e xaroposo. Bom para torra escura e bebidas com leite.',level:'Médio',profile:'Denso, doce',
  coffee:17,water:21,temp:'Padrão (−1 °C em torra escura)',preinf:'Automática',grind:'Fina, um ponto mais fina',grinder:[1,2],gStart:1,exp:'20–30 s',time:[20,30],act:{d:1},prep:PREP_ESP,
  steps:[{t:0,shot:1,a:'Extraia',n:'Pare manualmente pelo peso'}],
  tips:['Uma posição abaixo do seu normale. Se já estiver no 1, aumente a dose em 0,5 g.']},
 {id:'esp-l',method:'espresso',name:'Lungo',tag:'1:2,75',espresso:1,desc:'Mais extração e clareza, menos corpo. Bom para torra clara.',level:'Médio',profile:'Claro, aromático',
  coffee:17,water:47,temp:'+1 ou +2 °C',preinf:'Manual, 8–10 s',grind:'Fina, um ponto mais grossa',grinder:[3,5],gStart:4,exp:'25–35 s',time:[25,35],act:{d:1},prep:PREP_ESP,
  steps:[{t:0,shot:1,a:'Extraia',n:'Segure o botão 8–10 s, solte e pare pelo peso'}],
  tips:['1–2 posições acima do seu normale.']},
 {id:'esp-t',method:'espresso',name:'Turbo',tag:'1:2,7 · rápido',espresso:1,desc:'Moagem bem mais grossa: extração alta e uniforme, textura leve.',level:'Avançado',profile:'Leve, doce',
  coffee:15,water:41,temp:'Padrão',preinf:'Automática',grind:'Bem mais grossa que espresso',grinder:[6,12],gStart:9,exp:'12–18 s',time:[12,18],act:{d:1},prep:PREP_ESP,
  steps:[{t:0,shot:1,a:'Extraia',n:'Pare entre 12 e 18 s'}],
  tips:['Manômetro fica abaixo da zona ideal de propósito. Sem ajuste de pressão, é uma aproximação: julgue pelo gosto.']},
 {id:'esp-a',method:'espresso',name:'Allongé',tag:'1:4,6',espresso:1,desc:'Lembra um filtrado concentrado.',level:'Avançado',profile:'Limpo, longo',
  coffee:17,water:78,temp:'+2 °C',preinf:'Automática',grind:'Mais grossa',grinder:[8,14],gStart:11,exp:'30–40 s',time:[30,40],act:{d:1},prep:PREP_ESP,
  steps:[{t:0,shot:1,a:'Extraia',n:'Pare manualmente pelo peso'}],
  tips:['Bebida entre 70 e 85 g.']}
];
RECIPES.push(...drinks(PREP_ESP));

export const TASTE={
 filter:[
  {k:'eq',l:'Equilibrado',a:'Doce, limpo, final longo. Mantenha tudo como está.'},
  {k:'azedo',l:'Azedo',a:'Subextraído. Moa mais fino; água mais quente também ajuda.',g:-2},
  {k:'amargo',l:'Amargo',a:'Superextraído. Moa mais grosso e agite menos.',g:2},
  {k:'ambos',l:'Azedo e amargo',a:'Extração desigual. Despejo mais regular, giro no bloom e leito plano; moa um ponto mais grosso.',g:1},
  {k:'ralo',l:'Ralo',a:'Força baixa. Use uma proporção mais curta.',r:-1},
  {k:'forte',l:'Pesado',a:'Força alta. Use uma proporção mais longa.',r:1}],
 espresso:[
  {k:'eq',l:'Equilibrado',a:'Acertou. Vale programar o botão de 2 xícaras com esse volume.'},
  {k:'azedo',l:'Azedo',a:'Pouca extração. Alongue a bebida; se persistir, +1 °C na máquina.',r:.3},
  {k:'amargo',l:'Amargo',a:'Extração em excesso. Encurte a bebida; se persistir, −1 °C.',r:-.3},
  {k:'ambos',l:'Azedo e amargo',a:'Canalização. Desfaça grumos com agulhas, compacte nivelado e moa um ponto mais grosso.',g:1},
  {k:'ralo',l:'Ralo',a:'Pouco corpo. Encurte a bebida.',r:-.2},
  {k:'forte',l:'Forte demais',a:'Alongue a bebida e moa um ponto mais grosso para manter o tempo.',r:.3,g:1}]
};
export const MACHINE={
 calib:['Ligue a máquina e passe uma dose de água pelo porta-filtro vazio; seque o cesto.','Moedor na posição {esp}, cesto duplo de parede simples.','Moa, pese e acerte o tempo do moedor até dar 17 g.','Desfaça os grumos, nivele e compacte rente à borda do cesto.','Extraia sobre a balança e pare em 34 g.','Menos de 25 s: desça uma posição (no 1, aumente a dose em 0,5 g). Mais de 35 s: suba uma. Refaça o tempo de moagem para manter 17 g.','Prove e ajuste pelo gosto.','Quando acertar, programe o botão de 2 xícaras com esse volume.'],
 cmds:[['Temperatura','Máquina desligada: segure 1 xícara e pressione ligar. Após o bipe, 2 xícaras alterna padrão, +1, +2, −1 e −2 °C; dois bipes confirmam.'],['Pré-infusão manual','Segure 1 ou 2 xícaras pelo tempo desejado, solte para pressão total e toque de novo para parar.'],['Programar volume','Toque PROGRAM, inicie com 2 xícaras e toque de novo quando a balança marcar o peso alvo.'],['Padrão de fábrica','Segure PROGRAM até três bipes.'],['Limpeza','Com CLEAN ME aceso: disco e pastilha no cesto, máquina desligada, segure 1 xícara, 2 xícaras e ligar por 3 s. Leva ~5 min.']],
 roast:[['Clara','+2 °C','Manual, 8–12 s','1:2,5–1:3','1 mais fina ou +0,5 g'],['Média','Padrão','Automática','1:2–1:2,5','Partida {esp}'],['Escura','−1 a −2 °C','Automática','1:1,5–1:2','2–3 mais grossa']],
 care:['Extraia o café primeiro e vaporize o leite depois (termobloco único).','Manômetro na zona central = pressão ideal. Abaixo: moa mais fino. Acima: mais grosso.','Água filtrada de baixa dureza; troque o filtro interno a cada 2 meses. Nunca destilada pura.','Descalcifique a cada 2–3 meses.','Mó interna no {burr}. Se o espresso correr rápido mesmo na posição 1, desça a mó interna um passo e atualize o número em Ajustes.']
};
export const RATE_L=['','Ruim','Fraco','Bom','Muito bom','Excelente'];
export const M=Object.fromEntries(METHODS.map(m=>[m.id,m]));
export const R=Object.fromEntries(RECIPES.map(r=>[r.id,r]));
export const recipesOf=mid=>RECIPES.filter(r=>r.method===mid);

/* Moedor Tramontina by Breville: 60 posições externas (1 a mais fina) e mó interna regulável.
   As faixas `grinder` das receitas valem com a mó interna no INNER_BURR e podem passar de 60:
   é a posição que a receita pediria; o app limita a 1–60 e avisa quando fica fora do alcance.
   Referências do dono com a mó interna no 3: espresso em 1–3 e V60 a partir de 54. As demais
   receitas de filtro são a faixa do guia (mó de fábrica, 6) deslocada em 6 posições por passo. */
export const INNER_BURR=3;

/* Paletas de cor: fundo claro e escuro (barra de status) e amostra para o seletor. */
export const PALETTES={cinza:{name:'Cinza',light:'#ECECE9',dark:'#131312',dot:'#9C9C96'},cobalto:{name:'Cobalto',light:'#DDE8F0',dark:'#0B2253',dot:'#1F4BA5'}};
