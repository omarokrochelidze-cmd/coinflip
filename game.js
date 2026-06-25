/* ── AUDIO ── */
const AC = new (window.AudioContext || window.webkitAudioContext)();
function resumeAC() { if (AC.state==='suspended') AC.resume(); }
function playTone(f,type,dur,vol,delay) {
  resumeAC();
  const t=AC.currentTime+(delay||0),o=AC.createOscillator(),g=AC.createGain();
  o.connect(g); g.connect(AC.destination);
  o.type=type; o.frequency.value=f;
  g.gain.setValueAtTime(vol,t);
  g.gain.exponentialRampToValueAtTime(0.001,t+dur);
  o.start(t); o.stop(t+dur);
}
let soundEnabled = true;
function _click()  { playTone(440,'square',0.07,0.1); }
function _spin()   { for(let i=0;i<20;i++) playTone(600+Math.sin(i)*350+i*28,'triangle',0.1,0.07,i*0.115); }
function _win()    { [523,659,784,1047].forEach((f,i)=>playTone(f,'sine',0.45,0.22,i*0.11)); }
function _lose()   { [380,320,260].forEach((f,i)=>playTone(f,'sawtooth',0.28,0.18,i*0.14)); }
function playClick() { if(soundEnabled) _click(); }
function playSpin()  { if(soundEnabled) _spin();  }
function playWin()   { if(soundEnabled) _win();   }
function playLose()  { if(soundEnabled) _lose();  }

function toggleSound() {
  soundEnabled=!soundEnabled;
  const btn=document.getElementById('soundBtn');
  const icon=document.getElementById('soundIcon');
  if(btn)  btn.classList.toggle('muted',!soundEnabled);
  if(icon) icon.textContent=soundEnabled?'🔊':'🔇';
}

/* ── I18N ── */
const LANGS={
  ka:{ win:'🏆 გაიმარჯვე! +', lose:'💸 წააგე -', resultA:'▲ მხარე A', resultB:'▲ მხარე B',
       needPick:'⚠️ აირჩიე მხარე', needBet:'⚠️ შეიყვანე ფსონი', noBalance:'⚠️ არ გყოფნის ბალანსი' },
  en:{ win:'🏆 Won! +', lose:'💸 Lost -', resultA:'▲ Side A', resultB:'▲ Side B',
       needPick:'⚠️ Pick a side', needBet:'⚠️ Enter bet', noBalance:'⚠️ Insufficient balance' },
  ru:{ win:'🏆 Выигрыш! +', lose:'💸 Проигрыш -', resultA:'▲ Сторона A', resultB:'▲ Сторона B',
       needPick:'⚠️ Выберите сторону', needBet:'⚠️ Введите ставку', noBalance:'⚠️ Недостаточно' }
};
let lang='ka';
function t(k){ return (LANGS[lang]&&LANGS[lang][k])||k; }

function setLang(l) {
  playClick(); lang=l;
  ['ka','en','ru'].forEach(code=>{
    const b=document.getElementById('l'+code);
    if(b) b.classList.toggle('active', code===l);
  });
  updatePrompt();
  renderHistory();
}

/* ── STATE ── */
let balance=1000, chosen=null, spinning=false;
let history=[], roundNum=0, coinAngle=0;

/* ── PICK SIDE ── */
function pickSide(s) {
  if(spinning) return;
  playClick(); chosen=s;
  document.getElementById('btnA').classList.toggle('chosen',s==='A');
  document.getElementById('btnB').classList.toggle('chosen',s==='B');
  hideResult();
}

/* ── BET ── */
function setHalf(){ if(spinning)return; playClick(); const el=document.getElementById('betInput'); let v=parseInt(el.value)||1; el.value=Math.max(1,Math.floor(v/2)); }
function setAll() { if(spinning)return; playClick(); document.getElementById('betInput').value=Math.max(1,balance); }

/* ── RESULT ── */
function showResult(msg,type){
  const b=document.getElementById('resultBox');
  b.textContent=msg; b.className='result-box show '+type;
}
function hideResult(){ document.getElementById('resultBox').className='result-box'; }

/* ── HISTORY ── */
function renderHistory(){
  const el=document.getElementById('histList');
  if(!history.length){ el.innerHTML='<div class="hist-empty">—</div>'; return; }
  el.innerHTML=[...history].reverse().map(h=>
    `<div class="hist-item">
      <span>#${h.r} <span class="hist-side">${h.side==='A'?'A':'B'}</span></span>
      <span>${h.won?'<span class="hw">+'+h.bet+'₾</span>':'<span class="hl">-'+h.bet+'₾</span>'}</span>
    </div>`
  ).join('');
}

/* ── EASING ── */
function easeOutCubic(x){ return 1-Math.pow(1-x,3); }
function coinEase(x){
  if(x<0.15){ const u=x/0.15; return 0.08*u*u; }
  if(x<0.80){ return 0.08+0.80*((x-0.15)/0.65); }
  return 0.88+0.12*easeOutCubic((x-0.80)/0.20);
}
function yOff(x){ return -52*Math.sin(x*Math.PI); }
function sc(x)  { return 1+0.12*Math.sin(x*Math.PI); }

/* ── MAIN FLIP ── */
function doFlip(){
  if(spinning) return;
  resumeAC();

  if(!chosen)         { showResult(t('needPick'),'lose'); return; }
  const bet=parseInt(document.getElementById('betInput').value)||0;
  if(bet<1)           { showResult(t('needBet'),'lose'); return; }
  if(bet>balance)     { showResult(t('noBalance'),'lose'); return; }

  spinning=true; hideResult();
  document.getElementById('flipBtn').disabled=true;
  document.getElementById('btnA').disabled=true;
  document.getElementById('btnB').disabled=true;
  document.getElementById('betInput').disabled=true;
  document.querySelectorAll('.bq').forEach(b=>b.disabled=true);

  /* result */
  const landed  = Math.random()<0.5?'A':'B';
  const won     = landed===chosen;

  /* target angle — face-A=0mod360, face-B=180mod360 */
  const halfTurns = 8+Math.floor(Math.random()*4);   /* 8–11 half-turns */
  const totalSpin = halfTurns*180;
  const rawEnd    = coinAngle+totalSpin;
  const rawMod    = ((rawEnd%360)+360)%360;
  const targetMod = landed==='A'?0:180;
  const toAngle   = rawEnd+(rawMod===targetMod?0:180);
  const fromAngle = coinAngle;
  const totalDeg  = toAngle-fromAngle;
  const DURATION  = 2300+Math.random()*500;

  const coin = document.getElementById('coin');
  playSpin();
  let startTs=null;

  function frame(ts){
    if(!startTs) startTs=ts;
    const p=Math.min((ts-startTs)/DURATION,1);
    coin.style.transform=
      `rotateY(${fromAngle+totalDeg*coinEase(p)}deg) translateY(${yOff(p)}px) scale(${sc(p)})`;

    if(p<1){
      requestAnimationFrame(frame);
    } else {
      coin.style.transform=`rotateY(${toAngle}deg) translateY(0) scale(1)`;
      coinAngle=toAngle;

      balance+=won?bet:-bet;
      document.getElementById('balDisplay').textContent=balance;
      clampBet(); won?playWin():playLose();
      showResult(won?(t('win')+bet+'₾'):(t('lose')+bet+'₾'+'  '+t(landed==='A'?'resultA':'resultB')), won?'win':'lose');

      roundNum++;
      history.push({r:roundNum,side:landed,won,bet});
      if(history.length>5) history.shift();
      renderHistory();

      if(balance<=0){
        setTimeout(()=>{
          balance=1000; document.getElementById('betInput').value=1;
          document.getElementById('balDisplay').textContent=balance;
          showResult('🔄 1000 ₾','win');
        },1600);
      }

      spinning=false;
      document.getElementById('flipBtn').disabled=false;
      document.getElementById('btnA').disabled=false;
      document.getElementById('btnB').disabled=false;
      document.getElementById('betInput').disabled=false;
      document.querySelectorAll('.bq').forEach(b=>b.disabled=false);
    }
  }
  requestAnimationFrame(frame);
}

/* bet helpers + i18n prompt */
function clampBet(){ const el=document.getElementById('betInput'); const max=Math.max(1,balance); let v=parseInt(el.value)||1; if(v<1)v=1; if(v>max)v=max; el.value=v; }
function updatePrompt(){ const p=document.getElementById('prompt'); if(p) p.textContent=t('needPick').replace(/^[^\s]+\s/,''); }
updatePrompt();
