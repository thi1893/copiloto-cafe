import {S} from './store.js';

/* Som, vibração e tela ligada durante o preparo. */
let AC=null,WL=null;

/* iPhone: o som de uma página respeita a chave de silencioso, então o aviso some com o
   aparelho no silencioso. Com a sessão de áudio em 'playback' (iOS 17+) ele toca mesmo
   assim, ao custo de poder pausar a música de outros apps. Controlado em Ajustes. */
export const hasAudioSession=()=>{try{return!!navigator.audioSession}catch(e){return false}};
export function audioSession(){try{if(navigator.audioSession)navigator.audioSession.type=S.prefs.silent===false?'auto':'playback'}catch(e){}}

export function audio(){
  try{
    if(!AC){audioSession();AC=new(window.AudioContext||window.webkitAudioContext)()}
    if(AC.state!=='running')AC.resume(); // 'suspended' ou 'interrupted' (iOS, depois de bloquear a tela)
  }catch(e){}
  return AC;
}
export const audioStarted=()=>!!AC;
/* Solta o áudio depois do preparo, para não segurar a sessão de som do iPhone à toa. */
export function quiet(){setTimeout(()=>{try{if(AC&&!S.active&&AC.state==='running')AC.suspend()}catch(e){}},2500)}

export function tone(f,d,v,delay=0){
  const a=audio();if(!a)return;
  const t=a.currentTime+delay,o=a.createOscillator(),g=a.createGain();
  o.type='triangle';o.frequency.value=f;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d+.05);
}
export const chime=()=>{tone(880,.6,.5);tone(1318.5,.8,.35,.12)};
export const snd={
  step(){if(S.prefs.sound)chime();buzz(30)},
  tick(){if(S.prefs.sound)tone(1567,.1,.22)},
  done(){if(S.prefs.sound){tone(659,.5,.42);tone(880,.5,.42,.14);tone(1318.5,.9,.4,.28)}buzz(60)},
  start(){if(S.prefs.sound)tone(1046.5,.3,.3)},
  halt(){if(S.prefs.sound)tone(587.3,.28,.32)} // fim da janela de despejo: pare de despejar
};
export function buzz(ms){if(S.prefs.vibe&&navigator.vibrate)try{navigator.vibrate(ms)}catch(e){}}
export async function keepAwake(on){try{if(on&&S.prefs.wake&&'wakeLock'in navigator){if(!WL){WL=await navigator.wakeLock.request('screen');WL.addEventListener('release',()=>{WL=null})}}else if(!on&&WL){await WL.release();WL=null}}catch(e){}}
