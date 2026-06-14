// Simulateur + TUNER d'équilibrage pour MATRIX 5 (données réelles, mêmes que index.html).
// Trouve une config (rythme d'arrivée, grâce, main, temps) donnant ~60-70% de victoire.
// Usage : node prototype/sim.js            -> balaie des configs candidates
//         node prototype/sim.js final      -> teste la config retenue (table finale)

const STARTERS_BASE=[{star:1,claw:0},{star:0,claw:1}];
// Marché CURÉ + ICÔNES VÉRIFIÉES À LA MAIN (sur les vraies images). Chaque carte vaut son prix aux icônes.
const MARKET_POOL=[
 {star:2,claw:0,cost:2,n:2}, // Dozer
 {star:2,claw:0,cost:3,n:2}, // Operator
 {star:2,claw:0,cost:3,n:2}, // I've Spent My Entire Life (Morpheus)
 {star:2,claw:0,cost:3,n:2}, // Hovercraft Nebuchadnezzar
 {star:0,claw:2,cost:4,n:2}, // Your Men Are Already Dead (Trinity) — corrigé : griffure (pas ★)
 {star:0,claw:2,cost:4,n:2}, // Combat Training (Tank)
 {star:0,claw:3,cost:5,n:2}, // You Think That's Air (Morpheus)
 {star:0,claw:4,cost:6,n:1}, // It's a Trap (Tank)
 {star:0,claw:1,cost:2,n:2}, // NEO — I Know Kung Fu
 {star:0,claw:2,cost:4,n:2}, // NEO — Guns, Lots of Guns
 {star:0,claw:4,cost:5,n:2}, // NEO — You Move Like They Do
 {star:2,claw:2,cost:1,n:1}];// ORACLE — I Can See Why She Likes You (clin d'œil, 1 seul ex.)
// MARCHÉ "AVATARS" livré : 5 héros × 3 cartes (coût >=2). Icônes VÉRIFIÉES À L'ŒIL sur les vraies images.
// Identique à MARKET_POOL de prototype/index.html (même valeurs).
const HERO_MARKET=[
 {h:'neo',     star:0,claw:1,cost:2,n:1}, {h:'neo',     star:0,claw:2,cost:4,n:1}, {h:'neo',     star:0,claw:4,cost:5,n:1}, // I Know Kung Fu / Guns / You Move
 {h:'trinity', star:0,claw:3,cost:3,n:1}, {h:'trinity', star:0,claw:2,cost:4,n:1}, {h:'trinity', star:0,claw:4,cost:6,n:1}, // She Is Going To Die / Your Men / Off The Freeway
 {h:'morpheus',star:2,claw:0,cost:3,n:1}, {h:'morpheus',star:2,claw:0,cost:4,n:1}, {h:'morpheus',star:0,claw:3,cost:5,n:1}, // I've Spent / Towering Leap / You Think That's Air
 {h:'niobe',   star:2,claw:0,cost:2,n:1}, {h:'niobe',   star:0,claw:2,cost:4,n:1}, {h:'niobe',   star:0,claw:4,cost:5,n:1}, // A Hell of a Pilot / Gotcha / Infiltrate
 {h:'crew',    star:2,claw:0,cost:2,n:1}, {h:'crew',    star:1,claw:1,cost:4,n:1}, {h:'crew',    star:0,claw:4,cost:7,n:1}];// Dozer / Mouse / Apoc
const AV_LIST=['neo','trinity','morpheus','niobe','crew'];
const ENEMY_POOL=[{hp:1,n:3},{hp:2,n:3},{hp:3,n:2},{hp:3,n:2},{hp:5,n:1},{hp:6,n:1},{hp:8,n:1}];

const rnd=()=>Math.random();
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=(rnd()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const expand=p=>{const r=[];p.forEach(c=>{for(let i=0;i<c.n;i++)r.push({...c})});return r};

// P = {np, bossHp, time, hand, unplug, spoon, cap, grace, strat, perRound}
// cap   = nb max d'agents présents (on n'en fait débarquer un que s'il y a de la place)
// grace = on ne perd du temps que pour les agents AU-DELÀ de ce seuil (combat zone)
// strat = 'balanced' (achat + cher) | 'nobuy' (jamais d'achat) | 'attack' (achète que la griffure) | 'star' (achète que le ★)
// perRound = true -> le temps recule une fois par TOUR DE TABLE (toutes les N turns) au lieu de chaque turn
function play(P){
  const STRAT=P.strat||'balanced';
  const starter=[];for(let i=0;i<P.unplug;i++)starter.push({star:1,claw:0});for(let i=0;i<P.spoon;i++)starter.push({star:0,claw:1});
  const players=[];for(let i=0;i<P.np;i++)players.push({deck:shuffle(starter.map(c=>({...c}))),discard:[],hand:[],av:P.avList?P.avList[i%P.avList.length]:null});
  let market=[],mdeck=shuffle(expand(P.market||MARKET_POOL));
  for(let i=0;i<4&&mdeck.length;i++)market.push(mdeck.pop());
  let threat=shuffle(expand(ENEMY_POOL)),enemies=[],cur=0,turns=0,boss=P.bossHp,t=P.time,btUses=0;
  const btMax=P.btMax??99;
  const pending=Array(P.np).fill(null); // carte léguée en attente pour le joueur i (mode legueQ)
  const draw=(p,n)=>{while(p.hand.length<n){if(!p.deck.length){if(!p.discard.length)break;p.deck=shuffle(p.discard);p.discard=[]}p.hand.push(p.deck.pop())}};
  while(true){
    if(turns>300)return{win:false,turns,boss};
    turns++;const p=players[cur];draw(p,P.hand);
    // LÉGUE option 1 (transfert) : on lègue NOTRE pire carte piochée au suivant (sacrifice), PUIS on
    // ajoute le cadeau reçu à notre main (il sera joué -> il rejoint NOTRE défausse). Pas de carte "fantôme".
    if(P.legueQ){
      if(p.hand.length>1){let wi=0;for(let i=1;i<p.hand.length;i++)if((p.hand[i].star+p.hand[i].claw)<(p.hand[wi].star+p.hand[wi].claw))wi=i;
        pending[(cur+1)%P.np]=p.hand.splice(wi,1)[0];}
      if(pending[cur]){p.hand.push(pending[cur]);pending[cur]=null;} }
    if(threat.length && enemies.length<P.cap)enemies.push(threat.pop());
    let star=p.hand.reduce((s,c)=>s+c.star,0),claw=p.hand.reduce((s,c)=>s+c.claw,0);
    // AVATAR, mode +dégât : tes cartes héros (icône qui matche ton avatar) valent +1 à l'usage.
    if(P.avMode==='damage'&&p.av)p.hand.forEach(c=>{if(c.h===p.av){if(c.claw>0)claw++;else if(c.star>0)star++;}});
    p.discard.push(...p.hand);p.hand=[];
    // CIBLAGE : 'smart' (def) = tuer les petits agents (stoppe la fuite du temps) puis taper le boss ;
    // 'bossonly' = tout sur le boss (ignore les agents) ; 'random' = pile/face chaque tour.
    const bossOnly = P.targetPol==='bossonly' || (P.targetPol==='random' && rnd()<0.5);
    if(!bossOnly){ enemies.sort((a,b)=>a.hp-b.hp);
      enemies=enemies.filter(e=>{if(claw>=e.hp){claw-=e.hp;return false}return true}); }
    if(claw>0){const d=Math.min(claw,boss);boss-=d;claw-=d}
    if(boss<=0)return{win:true,turns,boss:0};
    const dest=c=>P.buyToTop?p.deck.push(c):p.discard.push(c); // achat : sur le deck (buyToTop) ou en défausse
    const btCost=P.btCost||3;                                   // ★ pour +1 au Time Track (Buy Time)
    // AVATAR, mode réduction : tes cartes héros coûtent 1 de moins (min 1). mine() = bonus pour préférer tes cartes.
    const eco=c=>(P.avMode==='discount'&&c.h===p.av)?Math.max(1,c.cost-1):c.cost;
    const mine=c=>(c.h&&c.h===p.av)?1:0;
    const take=pool=>{if(!pool[0])return;const c=pool[0];star-=eco(c);dest({...c});market.splice(market.indexOf(c),1);if(mdeck.length)market.push(mdeck.pop())};
    if(STRAT==='random'){ // SINGE : achète une carte abordable au hasard (pas de gestion du temps)
      const pool=market.filter(c=>eco(c)<=star); if(pool.length)take([pool[(rnd()*pool.length)|0]]);
    }else if(STRAT==='greedy'){ // ESCALATOR : dépense tout sur la carte la + chère abordable, jamais de temps
      take(market.filter(c=>eco(c)<=star).sort((a,b)=>eco(b)-eco(a)));
    }else if(STRAT==='buytime'){ // voie éco/contrôle : convertir ★ en temps (1x/tour, plafond btMax/partie)
      if(star>=btCost && t<12 && btUses<btMax){ star-=btCost; t++; btUses++; }
      take(market.filter(c=>eco(c)<=star && c.claw>0).sort((a,b)=>mine(b)-mine(a)||eco(b)-eco(a)));
    }else if(STRAT!=='nobuy'){
      // 'balanced' : si le temps est bas, on en achète un peu ; sinon on recrute la meilleure griffure
      if(STRAT==='balanced' && t<=3 && star>=btCost && btUses<btMax){ star-=btCost; t++; btUses++; }
      let pool=market.filter(c=>eco(c)<=star);
      if(P.valueBuy){ pool.sort((a,b)=>mine(b)-mine(a)||(b.star+b.claw)-(a.star+a.claw)||eco(a)-eco(b)); } // achat "meilleur rapport"
      else { if(STRAT==='attack'||STRAT==='balanced')pool=pool.filter(c=>c.claw>0); if(STRAT==='star')pool=pool.filter(c=>c.star>0); pool.sort((a,b)=>mine(b)-mine(a)||eco(b)-eco(a)); }
      take(pool);
    }
    if(!P.perRound || cur===P.np-1) t-=Math.max(0,enemies.length-P.grace);
    if(t<=0)return{win:false,turns,boss};
    cur=(cur+1)%P.np;
  }
}
function rate(P,runs){let w=0,tw=0;for(let i=0;i<runs;i++){const r=play(P);if(r.win){w++;tw+=r.turns}}return{wr:100*w/runs,at:w?tw/w:0}}

const runs=+(process.env.RUNS||4000);
if(process.argv[2]==="final"){
  // RÈGLES v3 (livrées) : main 5, starter 3 Unplug + 2 Spoon, cap 2 agents, Time Track 10,
  // marché 5 héros×3, achat -> DÉFAUSSE, AVATAR (tes cartes héros -1★), ★->temps (3★=+1, max 3/partie).
  const base={time:10,hand:5,unplug:3,spoon:2,cap:2,grace:0,buyToTop:false,btCost:3,btMax:3,market:HERO_MARKET,avMode:'discount',avList:AV_LIST};
  const cfgs=[{label:"🟢 Facile (Agent 10, t10)",bossHp:10,time:10},{label:"🟡 Normal (Smith 12, t10)",bossHp:12,time:10},{label:"🔴 Difficile (Smith 12, t8)",bossHp:12,time:8}];
  console.log("FINAL v3 — marché 5 héros×3, achat->défausse, AVATAR(-1★), ★->temps(3★,max3), cap2.");
  console.log("config                    | J | équilibré | rush | éco/contrôle | tours");
  for(const c of cfgs){for(const np of[1,2,3]){
    const b=rate({...base,np,bossHp:c.bossHp,time:c.time,strat:'balanced'},runs);
    const a=rate({...base,np,bossHp:c.bossHp,time:c.time,strat:'nobuy'},runs);
    const e=rate({...base,np,bossHp:c.bossHp,time:c.time,strat:'buytime'},runs);
    console.log(`${c.label.padEnd(20)}| ${np} |   ${b.wr.toFixed(0).padStart(3)}%   | ${a.wr.toFixed(0).padStart(3)}% |    ${e.wr.toFixed(0).padStart(3)}%     | ${b.at.toFixed(1)}`);
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
}else if(process.argv[2]==="review"){
  // BANC D'ESSAI : l'habileté change-t-elle la donne ? On compare 4 "cerveaux" de joueur,
  // + l'importance du ciblage, + la nature des défaites (de justesse vs sans espoir).
  const base={hand:5,unplug:3,spoon:2,cap:2,grace:0,btCost:3,btMax:3,buyToTop:false,market:HERO_MARKET,avMode:'discount',avList:AV_LIST};
  const diffs=[{l:"🟢 Facile",b:10,t:10},{l:"🟡 Normal",b:12,t:10},{l:"🔴 Difficile",b:12,t:8}];
  const bots=[
    ["🐒 Singe (achat+cible AU HASARD)", {strat:'random',  targetPol:'random'}],
    ["🛗 Escalator (dépense tout, tape tout, jamais de temps)", {strat:'greedy', targetPol:'smart'}],
    ["🎯 Optimal (valeur + gère le temps + cible malin)", {strat:'balanced', valueBuy:true, targetPol:'smart'}],
    ["🧠 Éco-contrôle (★→temps puis griffure)", {strat:'buytime', targetPol:'smart'}],
  ];
  console.log(`REVIEW — runs ${runs}/cellule. Taux de victoire par CERVEAU de joueur.\n`);
  for(const d of diffs){
    console.log(`${d.l} (boss ${d.b}, temps ${d.t})`);
    for(const [name,cfg] of bots){ let line="   "+name.padEnd(52)+"|";
      for(const np of[1,2,3]){const r=rate({...base,...cfg,np,bossHp:d.b,time:d.t},runs);line+=` ${(r.wr.toFixed(0)+'%').padStart(4)} |`;}
      console.log(line);
    } console.log("");
  }
  console.log("CIBLAGE (joueur optimal, solo) — tuer les agents d'abord VS tout sur le boss :");
  for(const d of diffs){
    const sm=rate({...base,strat:'balanced',valueBuy:true,targetPol:'smart',np:1,bossHp:d.b,time:d.t},runs);
    const bo=rate({...base,strat:'balanced',valueBuy:true,targetPol:'bossonly',np:1,bossHp:d.b,time:d.t},runs);
    console.log(`   ${d.l.padEnd(12)}: ciblage MALIN ${sm.wr.toFixed(0)}%  vs  IGNORER LES AGENTS ${bo.wr.toFixed(0)}%`);
  }
  console.log("\nNATURE DES DÉFAITES — optimal, 🔴 Difficile : de justesse (boss <=3 PV) vs sans espoir (boss >7 PV) :");
  for(const np of[1,2,3]){
    let close=0,mid=0,blow=0,losses=0;
    for(let i=0;i<runs;i++){const r=play({...base,strat:'balanced',valueBuy:true,targetPol:'smart',np,bossHp:12,time:8});
      if(!r.win){losses++;if(r.boss<=3)close++;else if(r.boss<=7)mid++;else blow++;}}
    const pc=x=>losses?Math.round(100*x/losses):0;
    console.log(`   ${np}j : ${losses}/${runs} défaites → de justesse ${pc(close)}% · moyennes ${pc(mid)}% · sans espoir ${pc(blow)}%`);
  }
}else if(process.argv[2]==="legue"){
  // QUESTION : le légue actuel (transférer une carte au deck voisin) semble sans intérêt.
  // A) Et s'il donnait un VRAI boost = main à 6 (ou 7) ? -> on lit l'effet d'une main plus grande.
  // B) Le légue 'qualité' (chacun passe sa pire carte au suivant) apporte-t-il qqch au bot ?
  // Config = jeu ACTUEL (starter 3U+2S, marché live avec Oracle, achat sur le dessus, cap2).
  const base={unplug:3,spoon:2,cap:2,grace:0,buyToTop:true,btCost:3,btMax:3};
  const cfgs=[{l:"🟡 Normal (12,t10)",b:12,t:10},{l:"🔴 Difficile (12,t8)",b:12,t:8}];
  console.log(`LÉGUE — runs ${runs} — config actuelle. vict% ÉQUILIBRÉ (rush% / éco%)`);
  console.log("\nA) Effet d'une MAIN PLUS GRANDE (proxy 'le légue fait un vrai boost de débit')");
  for(const c of cfgs){ console.log(`\n${c.l}`); console.log("  J |   main 5 (actuel)    |       main 6        |       main 7");
    for(const np of[1,2,3]){
      const cell=h=>{const eq=rate({...base,np,bossHp:c.b,time:c.t,hand:h,strat:'balanced'},runs);
        const ru=rate({...base,np,bossHp:c.b,time:c.t,hand:h,strat:'nobuy'},runs);
        const ec=rate({...base,np,bossHp:c.b,time:c.t,hand:h,strat:'buytime'},runs);
        return `${eq.wr.toFixed(0).padStart(3)}% (${ru.wr.toFixed(0)}/${ec.wr.toFixed(0)})`;};
      console.log(`  ${np} | ${cell(5).padEnd(19)} | ${cell(6).padEnd(18)} | ${cell(7)}`);
    } }
  console.log("\nB) Légue 'QUALITÉ' (main 5, on passe sa pire carte au suivant) — SANS -> AVEC, équilibré");
  for(const c of cfgs){ let line=c.l.padEnd(20)+"|";
    for(const np of[1,2,3]){
      const wo=rate({...base,np,bossHp:c.b,time:c.t,hand:5,strat:'balanced'},runs);
      const w =rate({...base,np,bossHp:c.b,time:c.t,hand:5,strat:'balanced',legueQ:true},runs);
      line+=` ${np}j ${wo.wr.toFixed(0).padStart(3)}->${w.wr.toFixed(0).padStart(3)}% |`;
    } console.log(line); }
}else if(process.argv[2]==="avatar"){
  // QUESTION : marché en triplets de héros (3/héros, coût>=2), achat -> DÉFAUSSE (accès différé),
  // chaque joueur a un AVATAR. On compare le BONUS : aucun | réduction(-1 coût) | +dégât(+1 icône).
  // On lit aussi la DIVERSITÉ des voies (rush sans achat / éco-contrôle) pour vérifier l'équilibre.
  const base={hand:5,unplug:3,spoon:2,cap:2,grace:0,btCost:3,btMax:3,buyToTop:false,market:HERO_MARKET};
  const avList=AV_LIST;
  const cell=(np,b,t,avMode)=>{
    const eq=rate({...base,np,bossHp:b,time:t,strat:'balanced',avMode,avList},runs);
    const ru=rate({...base,np,bossHp:b,time:t,strat:'nobuy',  avMode,avList},runs);
    const ec=rate({...base,np,bossHp:b,time:t,strat:'buytime',avMode,avList},runs);
    return `${eq.wr.toFixed(0).padStart(3)}% (rush ${ru.wr.toFixed(0)} / éco ${ec.wr.toFixed(0)})`;
  };
  console.log(`AVATAR — runs ${runs} — marché 6 héros×3, achat->défausse. vict% ÉQUILIBRÉ (rush% / éco%)`);
  for(const c of [{l:"🟡 Normal (Smith 12, t10)",b:12,t:10},{l:"🔴 Difficile (Smith 12, t8)",b:12,t:8}]){
    console.log(`\n${c.l}`);
    console.log("  J |        SANS bonus        |   RÉDUCTION (-1 coût)    |     +DÉGÂT (+1 icône)");
    for(const np of[1,2,3])
      console.log(`  ${np} | ${cell(np,c.b,c.t,null).padEnd(24)} | ${cell(np,c.b,c.t,'discount').padEnd(23)} | ${cell(np,c.b,c.t,'damage')}`);
  }
  // Effet seul du changement achat->défausse (sans avatar), pour isoler son impact :
  console.log("\nISOLER achat->défausse (sans avatar, équilibré) : DESSUS du deck -> DÉFAUSSE");
  for(const c of [{l:"🟡 Normal",b:12,t:10},{l:"🔴 Difficile",b:12,t:8}]){
    const top=rate({...base,np:1,bossHp:c.b,time:c.t,strat:'balanced',buyToTop:true},runs);
    const dis=rate({...base,np:1,bossHp:c.b,time:c.t,strat:'balanced',buyToTop:false},runs);
    console.log(`  ${c.l.padEnd(12)} 1j : ${top.wr.toFixed(0)}% -> ${dis.wr.toFixed(0)}%`);
  }
}else if(process.argv[2]==="oracle"){
  // Impact d'ajouter "I Can See Why She Likes You" (Oracle) = ★2+griffure2 pour coût 1.
  // Bot "meilleur rapport" (valueBuy) = il SAISIT la carte cheatée (pire cas réaliste).
  const oracle=[...MARKET_POOL,{star:2,claw:2,cost:1,n:+(process.argv[3]||1)}];
  const base={hand:5,unplug:3,spoon:2,cap:2,grace:0,buyToTop:true,btCost:3,btMax:3,valueBuy:true,strat:'balanced'};
  console.log(`IMPACT ORACLE (×${+(process.argv[3]||1)}) — bot 'meilleur rapport'. vict% SANS -> AVEC`);
  console.log("config            | 1j         | 2j         | 3j");
  for(const c of [{l:"🟡 Normal (12,t10)",b:12,t:10},{l:"🔴 Difficile (12,t8)",b:12,t:8}]){
    let line=c.l.padEnd(18)+"|";
    for(const np of[1,2,3]){
      const wo=rate({...base,np,bossHp:c.b,time:c.t},runs);
      const w =rate({...base,np,bossHp:c.b,time:c.t,market:oracle},runs);
      line+=` ${wo.wr.toFixed(0).padStart(3)}->${w.wr.toFixed(0).padStart(3)}% |`;
    }
    console.log(line);
  }
}else if(process.argv[2]==="tune"){
  // Calibrage des NOUVELLES règles : achat sur le dessus (buyToTop), ★->temps (Buy Time), starter réduit.
  // args : node sim.js tune [unplug] [spoon] [btCost] [time]
  const U=+(process.argv[3]||3), S=+(process.argv[4]||2), BT=+(process.argv[5]||3), TIME=+(process.argv[6]||10), BTMAX=+(process.argv[7]||3);
  const base={time:TIME,hand:5,unplug:U,spoon:S,cap:2,grace:0,buyToTop:true,btCost:BT,btMax:BTMAX};
  console.log(`CALIBRAGE — starter ${U}Unplug+${S}Spoon, achat sur le dessus, ★->temps à ${BT}★ (max ${BTMAX}/partie), Time Track ${TIME}`);
  console.log("boss | équilibré 1j/2j/3j (vict% , tours) | DIVERSITÉ 1j: agressif / griffure / éco(temps)");
  for(const boss of[8,10,12,14]){
    const b1=rate({...base,np:1,bossHp:boss,strat:'balanced'},runs);
    const b2=rate({...base,np:2,bossHp:boss,strat:'balanced'},runs);
    const b3=rate({...base,np:3,bossHp:boss,strat:'balanced'},runs);
    const ag=rate({...base,np:1,bossHp:boss,strat:'nobuy'},runs);
    const at=rate({...base,np:1,bossHp:boss,strat:'attack'},runs);
    const ec=rate({...base,np:1,bossHp:boss,strat:'buytime'},runs);
    console.log(`${String(boss).padStart(3)}  | ${b1.wr.toFixed(0).padStart(3)}%(${b1.at.toFixed(1)}) ${b2.wr.toFixed(0).padStart(3)}%(${b2.at.toFixed(1)}) ${b3.wr.toFixed(0).padStart(3)}%(${b3.at.toFixed(1)}) | agr ${ag.wr.toFixed(0).padStart(3)}% / grif ${at.wr.toFixed(0).padStart(3)}% / éco ${ec.wr.toFixed(0).padStart(3)}%`);
  }
}else if(process.argv[2]==="strats"){
  // Q : y a-t-il plusieurs chemins de victoire ? On compare des stratégies pures.
  console.log("DIVERSITÉ DES STRATÉGIES — solo, runs "+runs+" — base hand5/starter3-3/cap2/grace0/temps10");
  console.log("difficulté | nobuy(agressif) | balanced | attack(achète griffure) | star(achète ★)");
  for(const boss of[8,10,12]){
    const r=s=>rate({np:1,bossHp:boss,time:10,hand:5,unplug:3,spoon:3,cap:2,grace:0,strat:s},runs);
    const a=r('nobuy'),b=r('balanced'),c=r('attack'),d=r('star');
    console.log(`Boss ${String(boss).padStart(2)}    |   ${a.wr.toFixed(0).padStart(3)}% (${a.at.toFixed(1)})   | ${b.wr.toFixed(0).padStart(3)}% (${b.at.toFixed(1)}) |     ${c.wr.toFixed(0).padStart(3)}% (${c.at.toFixed(1)})        |  ${d.wr.toFixed(0).padStart(3)}% (${d.at.toFixed(1)})`);
  }
}else if(process.argv[2]==="npdiag"){
  // Q : pourquoi 1 joueur ≈ 4 joueurs ? On compare horloge PAR TURN vs PAR TOUR DE TABLE.
  console.log("DIAGNOSTIC NOMBRE DE JOUEURS — boss 10, balanced, runs "+runs);
  console.log("                         | 1j  | 2j  | 3j  | 4j");
  const line=(lbl,perRound)=>{let o=lbl.padEnd(25)+"|";for(const np of[1,2,3,4]){const r=rate({np,bossHp:10,time:10,hand:5,unplug:3,spoon:3,cap:2,grace:0,perRound},runs);o+=` ${r.wr.toFixed(0).padStart(2)}% |`}console.log(o)};
  line("temps -1 par TURN (actuel)",false);
  line("temps -1 par TOUR DE TABLE",true);
}else{
  console.log("BALAYAGE (boss 12, np 2, runs "+runs+") — bande 55-78% / 4-8 tours :");
  console.log("hand unplug spoon cap grace time | vict% | tours");
  for(const hand of[4,5])for(const[u,s]of[[3,3],[4,2],[2,4]])for(const cap of[1,2,3])for(const grace of[0,1,2])for(const time of[8,10,12]){
    const r=rate({np:2,bossHp:12,time,hand,unplug:u,spoon:s,cap,grace},1500);
    if(r.wr>=55&&r.wr<=78&&r.at>=4&&r.at<=8)
      console.log(`  ${hand}    ${u}     ${s}    ${cap}   ${grace}    ${time}  | ${r.wr.toFixed(0).padStart(3)}% | ${r.at.toFixed(1)}`);
  }
}
