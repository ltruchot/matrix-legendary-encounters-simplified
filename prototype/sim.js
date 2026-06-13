// Simulateur + TUNER d'équilibrage pour MATRIX 5 (données réelles, mêmes que index.html).
// Trouve une config (rythme d'arrivée, grâce, main, temps) donnant ~60-70% de victoire.
// Usage : node prototype/sim.js            -> balaie des configs candidates
//         node prototype/sim.js final      -> teste la config retenue (table finale)

const STARTERS_BASE=[{star:1,claw:0},{star:0,claw:1}];
const MARKET_POOL=[
 {star:2,claw:0,cost:2,n:2},{star:2,claw:0,cost:3,n:2},{star:2,claw:0,cost:3,n:2},
 {star:1,claw:0,cost:3,n:2},{star:0,claw:2,cost:4,n:2},{star:2,claw:0,cost:4,n:2},
 {star:1,claw:1,cost:4,n:2},{star:0,claw:3,cost:5,n:2},{star:0,claw:3,cost:6,n:1},
 {star:0,claw:4,cost:6,n:1},{star:0,claw:4,cost:7,n:1},{star:2,claw:2,cost:7,n:1},
 {star:2,claw:0,cost:3,n:3}];
const ENEMY_POOL=[{hp:1,n:3},{hp:2,n:3},{hp:3,n:2},{hp:3,n:2},{hp:5,n:1},{hp:6,n:1},{hp:8,n:1}];

const rnd=()=>Math.random();
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=(rnd()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const expand=p=>{const r=[];p.forEach(c=>{for(let i=0;i<c.n;i++)r.push({...c})});return r};

// P = {np, bossHp, time, hand, unplug, spoon, cap, grace}
// cap   = nb max d'agents présents (on n'en fait débarquer un que s'il y a de la place)
// grace = on ne perd du temps que pour les agents AU-DELÀ de ce seuil (combat zone)
function play(P){
  const starter=[];for(let i=0;i<P.unplug;i++)starter.push({star:1,claw:0});for(let i=0;i<P.spoon;i++)starter.push({star:0,claw:1});
  const players=[];for(let i=0;i<P.np;i++)players.push({deck:shuffle(starter.map(c=>({...c}))),discard:[],hand:[]});
  let market=[],mdeck=shuffle(expand(MARKET_POOL));
  for(let i=0;i<4&&mdeck.length;i++)market.push(mdeck.pop());
  let threat=shuffle(expand(ENEMY_POOL)),enemies=[],cur=0,turns=0,boss=P.bossHp,t=P.time;
  const draw=(p,n)=>{while(p.hand.length<n){if(!p.deck.length){if(!p.discard.length)break;p.deck=shuffle(p.discard);p.discard=[]}p.hand.push(p.deck.pop())}};
  while(true){
    if(turns>300)return{win:false,turns};
    turns++;const p=players[cur];draw(p,P.hand);
    if(threat.length && enemies.length<P.cap)enemies.push(threat.pop());
    let star=p.hand.reduce((s,c)=>s+c.star,0),claw=p.hand.reduce((s,c)=>s+c.claw,0);
    p.discard.push(...p.hand);p.hand=[];
    enemies.sort((a,b)=>a.hp-b.hp);
    enemies=enemies.filter(e=>{if(claw>=e.hp){claw-=e.hp;return false}return true});
    if(claw>0){const d=Math.min(claw,boss);boss-=d;claw-=d}
    if(boss<=0)return{win:true,turns};
    let buyable=market.filter(c=>c.cost<=star).sort((a,b)=>b.cost-a.cost);
    if(buyable[0]){const c=buyable[0];star-=c.cost;p.discard.push({...c});market.splice(market.indexOf(c),1);if(mdeck.length)market.push(mdeck.pop())}
    t-=Math.max(0,enemies.length-P.grace);
    if(t<=0)return{win:false,turns};
    cur=(cur+1)%P.np;
  }
}
function rate(P,runs){let w=0,tw=0;for(let i=0;i<runs;i++){const r=play(P);if(r.win){w++;tw+=r.turns}}return{wr:100*w/runs,at:w?tw/w:0}}

const runs=4000;
if(process.argv[2]==="final"){
  // RÈGLES FIXES retenues : main 5, starter 3 Unplug + 3 Spoon, cap 2 agents, grace 0, Time Track 10.
  // Difficulté = PV du boss uniquement (8 / 10 / 12, ancrés sur Agent 8/10 et Smith 12).
  const cfgs=[{label:"🟢 Facile",bossHp:8},{label:"🟡 Normal",bossHp:10},{label:"🔴 Difficile (Smith 12)",bossHp:12}];
  console.log("FINAL — main5, starter 3 Unplug+3 Spoon, cap2 agents, grace0, Time Track 10");
  console.log("config                  | J | vict% | tours-joueur moy (parties gagnées)");
  for(const c of cfgs){for(const np of[1,2,3,4]){
    const r=rate({np,bossHp:c.bossHp,time:10,hand:5,unplug:3,spoon:3,cap:2,grace:0},runs);
    console.log(`${c.label.padEnd(23)}| ${np} | ${r.wr.toFixed(0).padStart(3)}%  |  ${r.at.toFixed(1)}`);
  }console.log("");}
}else if(process.argv[2]==="grid"){
  // Règles fixes : hand5, starter 3 Unplug + 3 Spoon, cap2, grace1. On lit boss x time (np2).
  const HAND=+(process.argv[3]||5), U=+(process.argv[4]||3), S=+(process.argv[5]||3), CAP=+(process.argv[6]||2), GR=+(process.argv[7]||0);
  console.log(`GRILLE np2 — hand${HAND}/starter ${U}Unplug-${S}Spoon/cap${CAP}/grace${GR} — cellule = vict% (tours)`);
  const times=[8,9,10,11,12];
  process.stdout.write("boss\\time ");times.forEach(t=>process.stdout.write(("t"+t).padStart(11)));console.log();
  for(const boss of[6,8,10,12,14,16,18]){
    process.stdout.write((""+boss).padStart(6)+"   ");
    for(const time of times){const r=rate({np:2,bossHp:boss,time,hand:HAND,unplug:U,spoon:S,cap:CAP,grace:GR},2500);
      process.stdout.write(`${r.wr.toFixed(0).padStart(4)}%(${r.at.toFixed(1)})`.padStart(11));}
    console.log();
  }
}else{
  console.log("BALAYAGE (boss 12, np 2, runs "+runs+") — bande 55-78% / 4-8 tours :");
  console.log("hand unplug spoon cap grace time | vict% | tours");
  for(const hand of[4,5])for(const[u,s]of[[3,3],[4,2],[2,4]])for(const cap of[1,2,3])for(const grace of[0,1,2])for(const time of[8,10,12]){
    const r=rate({np:2,bossHp:12,time,hand,unplug:u,spoon:s,cap,grace},1500);
    if(r.wr>=55&&r.wr<=78&&r.at>=4&&r.at<=8)
      console.log(`  ${hand}    ${u}     ${s}    ${cap}   ${grace}    ${time}  | ${r.wr.toFixed(0).padStart(3)}% | ${r.at.toFixed(1)}`);
  }
}
