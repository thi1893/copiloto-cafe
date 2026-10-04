/* Cronômetro baseado no relógio: o tempo decorrido é sempre calculado a partir de
   startedAt, então continua certo depois de bloquear a tela ou reabrir o app. */
export const elapsedMs=a=>(a.pausedAt??Date.now())-a.startedAt-a.pausedTotal;
export function stepIdx(a,el){
  const st=a.calc.steps;let i=a.floor||0;
  while(i+1<st.length){const c=st[i],n=st[i+1];if(c.manual||c.drain||c.shot)break;if(n.t!=null&&n.t*1000<=el)i++;else break}
  return i;
}
/* Ritmo do despejo numa etapa com janela (s.pe): quanto falta e quanto a balança deveria marcar agora. */
export function pourState(s,el){
  if(s.pe==null||s.to==null)return null;
  const since=el/1000-s.t,d=Math.max(1,s.pe-s.t),k=Math.min(1,Math.max(0,since/d));
  return{pouring:since<d,left:Math.max(0,Math.ceil(d-since)),now:Math.round((s.from||0)+(s.to-(s.from||0))*k),k};
}
