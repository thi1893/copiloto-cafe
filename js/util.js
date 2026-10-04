/* Formatação e utilitários sem estado. */
export const $=s=>document.querySelector(s);
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
export const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
export const r1=v=>Math.round(v*10)/10;
export const fmtN=v=>{const n=r1(v);return Number.isInteger(n)?String(n):n.toFixed(1).replace('.',',')};
export const fmtR=v=>'1:'+fmtN(v);
export const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
export const tf=(r,s)=>r.espresso?Math.floor(s)+' s':fmtT(s);
export const fmtT=s=>{s=Math.max(0,Math.floor(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
export const parseNum=v=>parseFloat(String(v).replace(',','.'));
export const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function dayLabel(ts){const d=new Date(ts),t=new Date(),y=new Date();y.setDate(t.getDate()-1);const same=(a,b)=>a.toDateString()===b.toDateString();if(same(d,t))return'Hoje';if(same(d,y))return'Ontem';return d.toLocaleDateString('pt-BR',{weekday:'short',day:'numeric',month:'short'}).replace(/\./g,'')}
export const hm=ts=>new Date(ts).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
export const dotsTxt=n=>'●'.repeat(n)+'○'.repeat(5-n);
