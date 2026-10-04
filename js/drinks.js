/* Bebidas com espresso (cardápio do Guia do Barista) e técnica de leite.
   Cada bebida usa a regulagem do espresso base (normale ou ristretto): mesma dose,
   mesma posição do moedor e mesma memória. As quantidades são o meio da faixa do guia;
   a faixa completa aparece em "Antes de começar". */

const STEAM={
  curta:'Aeração curta: +10–20% de volume. Texturize até 55–65 °C',
  media:'Aeração média: +20–30% de volume. Texturize até 55–65 °C',
  longa:'Aeração longa: +40–50% de volume. Texturize até 55–65 °C'
};
const SHINE='Antes, bata a jarra na bancada e gire até o leite brilhar';

export function drinks(PREP_ESP){
  const shot=(a='Extraia',n='Primeiras gotas em 8–10 s')=>({t:0,shot:1,a,n});
  const steam=(q,k)=>({manual:1,q,unit:'g',a:'Vaporize o leite',n:STEAM[k]});
  const pour=n=>({manual:1,a:'Despeje sobre o espresso',n});
  const d=(id,name,o)=>({id:'dr-'+id,method:'drinks',drink:1,espresso:1,base:'esp-n',name,level:'Médio',
    coffee:17,water:34,temp:'Padrão',preinf:'Automática',grind:'Fina',grinder:[1,3],gStart:2,exp:'25–35 s',time:[25,35],act:{d:1},
    ...o,tag:o.cup,prep:[...PREP_ESP,...(o.prep||[])]});
  return[
    d('macchiato','Macchiato',{desc:'Espresso marcado com uma mancha de microespuma.',profile:'Intenso',level:'Fácil',
      cup:'60–90 ml',extra:'uma mancha de espuma',foam:'só uma mancha',prep:['Um dedo de leite gelado na jarra'],
      steps:[shot(),{manual:1,a:'Vaporize um pouco de leite',n:'Aeração curta; você só vai usar a espuma'},{manual:1,a:'Uma a duas colheres de microespuma',n:'No centro da crema'}]}),
    d('cortado','Cortado',{desc:'Espresso e leite em partes iguais, quase sem espuma.',profile:'Forte e redondo',
      cup:'110–130 ml',extra:'50 g de leite',foam:'mínima',prep:['50 g de leite gelado na jarra (faixa 40–60 g)'],
      steps:[shot(),steam(50,'curta'),pour('Cerca de 1:1, quase sem espuma')]}),
    d('piccolo','Piccolo',{desc:'Ristretto com pouco leite, em copo pequeno.',profile:'Doce e concentrado',
      base:'esp-r',water:21,grind:'Fina, um ponto mais fina',grinder:[1,2],gStart:1,exp:'20–30 s',time:[20,30],
      cup:'90–100 ml',extra:'55 g de leite',foam:'fina',prep:['55 g de leite gelado na jarra (faixa 50–60 g)'],
      steps:[shot('Extraia o ristretto'),steam(55,'curta'),pour('Espuma fina')],
      tips:['A receita clássica usa um ristretto simples. Com o cesto duplo, use só uma das saídas do bico, ou tudo para um piccolo mais forte.']}),
    d('flat-white','Flat white',{desc:'Espresso duplo com leite de textura fina e líquida.',profile:'Sedoso, café em evidência',
      cup:'150–180 ml',extra:'120 g de leite',foam:'fina, ~0,5 cm',prep:['120 g de leite gelado na jarra (faixa 110–130 g)'],
      steps:[shot(),steam(120,'curta'),pour(SHINE)],tips:['Também funciona com ristretto duplo.']}),
    d('cappuccino','Cappuccino',{desc:'Espresso com espuma espessa e aveludada.',profile:'Cremoso, espuma alta',
      cup:'150–180 ml',extra:'115 g de leite',foam:'1–1,5 cm',prep:['115 g de leite gelado na jarra (faixa 100–130 g)'],
      steps:[shot(),steam(115,'longa'),pour(SHINE)]}),
    d('latte','Latte',{desc:'Mais leite, textura cremosa, espuma de um centímetro.',profile:'Suave e cremoso',
      cup:'240–350 ml',extra:'240 g de leite',foam:'~1 cm',prep:['240 g de leite gelado na jarra (faixa 200–280 g)'],
      steps:[shot(),steam(240,'media'),pour(SHINE)],tips:['240 g de leite quase enchem a jarra de 350 ml depois da aeração: areje com calma.']}),
    d('mocha','Mocha',{desc:'Latte com chocolate derretido.',profile:'Doce, chocolate',
      cup:'240–300 ml',extra:'200 g de leite + chocolate',foam:'~1 cm',prep:['15–20 g de chocolate derretido na xícara','200 g de leite gelado na jarra (faixa 180–220 g)'],
      steps:[shot('Extraia sobre o chocolate'),{manual:1,a:'Misture o chocolate ao espresso'},steam(200,'media'),pour(SHINE)]}),
    d('americano','Americano',{desc:'Espresso duplo alongado com água quente por cima.',profile:'Longo e leve',level:'Fácil',
      cup:'180–240 ml',extra:'125 g de água quente',foam:'nenhuma',
      steps:[shot(),{manual:1,q:125,unit:'g',a:'Complete com água quente',n:'Por cima do espresso; a saída de água da máquina serve (faixa 100–150 g)'}],
      tips:['No Brasil, o carioca é o espresso diluído com só um pouco de água quente.']}),
    d('long-black','Long black',{desc:'Espresso extraído sobre a água quente, para preservar a crema.',profile:'Longo, com crema',level:'Fácil',
      cup:'150–180 ml',extra:'105 g de água quente',foam:'preserva a crema',prep:['105 g de água quente na xícara (faixa 90–120 g)'],
      steps:[shot('Extraia sobre a água','A crema fica por cima')]}),
    d('tonica','Espresso tônica',{desc:'Espresso sobre tônica com gelo.',profile:'Refrescante, amargo-cítrico',level:'Fácil',
      cup:'300 ml',extra:'135 g de tônica',foam:'nenhuma',prep:['Copo com gelo e 135 g de tônica (faixa 120–150 g)','Extraia numa xícara à parte'],
      steps:[shot(),{manual:1,a:'Despeje o espresso sobre a tônica',n:'Devagar, para não espumar'}]}),
    d('latte-gelado','Latte gelado',{desc:'Espresso sobre leite frio e gelo.',profile:'Refrescante e suave',level:'Fácil',
      cup:'350 ml',extra:'165 g de leite frio',foam:'nenhuma',prep:['Copo com gelo e 165 g de leite frio (faixa 150–180 g)','Extraia numa xícara à parte'],
      steps:[shot(),{manual:1,a:'Despeje o espresso sobre o leite'}]}),
    d('affogato','Affogato',{desc:'Espresso sobre uma bola de sorvete de creme.',profile:'Sobremesa',level:'Fácil',
      cup:'taça',extra:'uma bola de sorvete',foam:'nenhuma',prep:['Uma bola de sorvete de creme na taça','Extraia numa xícara à parte'],
      steps:[shot(),{manual:1,a:'Despeje sobre o sorvete',n:'Sirva na hora'}]})
  ];
}

export const MILK={
  steam:['Leite gelado (cerca de 4 °C) em jarra fria, até a base do bico da jarra.','Abra o vapor por um segundo para tirar a água condensada.','Ponta logo abaixo da superfície, um pouco fora do centro, com a jarra levemente inclinada.','Aeração: vapor todo aberto, chiado curto de papel rasgando. Pare quando a jarra chegar à temperatura da mão (30–37 °C).','Texturização: afunde a ponta alguns milímetros e mantenha um redemoinho até 55–65 °C.','Feche o vapor, limpe a haste com pano úmido e purgue de novo.','Bata a jarra na bancada, gire até o leite brilhar e sirva sem demora.'],
  texture:[['Flat white, cortado','10–20%','Fina e líquida'],['Latte','20–30%','Cremosa'],['Cappuccino','40–50%','Espessa e aveludada']],
  machine:['Extraia o café primeiro e vaporize o leite depois: a máquina tem termobloco único.','O vapor de termobloco é menos potente e a aeração demora mais. Use jarra de 350 ml e faça uma bebida por vez.','A saída de água quente serve para americano e long black e para aquecer as xícaras.'],
  care:['Acima de 70 °C o leite perde doçura e ganha gosto de cozido.','Leite integral (3–3,5% de gordura) é o mais fácil de trabalhar.','Bebidas vegetais em versão barista aquecem só até 55–60 °C; aveia é a mais estável.','Leite vegetal pode talhar em café muito ácido: use café menos ácido ou leite mais morno.','Nunca reaqueça leite já vaporizado.'],
  art:['Comece com crema íntegra e leite recém-texturizado.','Incline a xícara e despeje de 5–10 cm de altura, em fio fino, até a metade.','Aproxime o bico da jarra da superfície e aumente a vazão: o branco aparece.','Endireite a xícara aos poucos enquanto ela enche.','Para finalizar, levante a jarra e corte o desenho com um fio fino.'],
  artOrder:'Ordem de aprendizado: coração, tulipa, rosetta, cisne.'
};
