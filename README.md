# Copiloto de Café

PWA de preparo guiado de café, feita para iPhone. Sem servidor, sem conta, sem etapa de build:
são arquivos estáticos.

## Rodar no computador

    cd copiloto-cafe
    python3 -m http.server 8080

Abra http://localhost:8080. (Abrir o index.html direto do disco não funciona: módulos e
service worker exigem http/https.)

## Instalar no iPhone

1. Hospede a pasta em qualquer serviço de arquivos estáticos com HTTPS
   (GitHub Pages, Netlify, Cloudflare Pages).
2. Abra o endereço no Safari.
3. Compartilhar → Adicionar à Tela de Início.

Depois da primeira abertura o app funciona sem internet. Os dados ficam só no aparelho,
no armazenamento do app instalado (separado do Safari).

## Estrutura

    index.html              página única e metadados de PWA
    manifest.webmanifest    nome, cores e ícones do app instalado
    sw.js                   service worker: cache para uso offline
    css/app.css             tema claro/escuro e todos os estilos
    icons/                  ícones do app
    js/app.js               ponto de entrada: preparo, navegação, render, ações
    js/data.js              métodos, receitas, diagnóstico, dados da máquina
    js/drinks.js            bebidas com espresso e técnica de leite
    js/recipe.js            proporção, escala das etapas, moedor lembrado
    js/engine.js            cronômetro baseado no relógio
    js/store.js             estado salvo em localStorage
    js/ui.js                estado de interface (não salvo)
    js/feedback.js          som, vibração, tela ligada
    js/icons.js             ícones em SVG
    js/util.js              formatação
    js/views/               uma tela por arquivo

## Como mudar

- Nova receita: adicione um item em RECIPES (js/data.js). Cada etapa tem `t` (segundos),
  `to` (peso acumulado em g) e `a` (ação). `grinder` é a faixa de posições do moedor.
- Novo método: adicione em METHODS (js/data.js) e um ícone em MI (js/icons.js).
- Nova tela: crie um arquivo em js/views/ e chame-o em render() (js/app.js).
- Nova bebida: adicione um item em drinks() (js/drinks.js).
- A cada publicação: mude o nome em CACHE (sw.js). Arquivo novo ou removido: atualize FILES.

O app instalado busca a versão nova em segundo plano quando há internet;
ela aparece na abertura seguinte.
