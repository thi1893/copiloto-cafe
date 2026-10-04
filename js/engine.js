/* Cronômetro baseado no relógio: o tempo decorrido é sempre calculado a partir de
   startedAt, então continua certo depois de bloquear a tela ou reabrir o app. */
export const elapsedMs=a=>(a.pausedAt??Date.now())-a.startedAt-a.pausedTotal;
export function stepIdx(a,el){
  const st=a.calc.steps;let i=a.floor||0;
  while(i+1<st.length){const c=st[i],n=st[i+1];if(c.manual||c.drain||c.shot)break;if(n.t!=null&&n.t*1000<=el)i++;else break}
  return i;
}
