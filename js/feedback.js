import {S} from './store.js';

/* Som, vibração e tela ligada durante o preparo. */
let AC=null,WL=null;
export function audio(){try{if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume()}catch(e){}return AC}
export function tone(f,d,v,delay=0){const a=audio();if(!a)return;const t=a.currentTime+delay,o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d+.05)}
export const snd={step(){if(S.prefs.sound){tone(880,.7,.16);tone(1318.5,.9,.09,.11)}buzz(30)},tick(){if(S.prefs.sound)tone(1567,.09,.05)},done(){if(S.prefs.sound){tone(659,.6,.13);tone(880,.6,.12,.14);tone(1318.5,1,.1,.28)}buzz(60)},start(){if(S.prefs.sound)tone(1046.5,.35,.08)}};
export function buzz(ms){if(S.prefs.vibe&&navigator.vibrate)try{navigator.vibrate(ms)}catch(e){}}
export async function keepAwake(on){try{if(on&&S.prefs.wake&&'wakeLock'in navigator){if(!WL){WL=await navigator.wakeLock.request('screen');WL.addEventListener('release',()=>{WL=null})}}else if(!on&&WL){await WL.release();WL=null}}catch(e){}}
