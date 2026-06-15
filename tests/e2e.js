// Test e2e Playwright : joue de vraies parties en cliquant dans le DOM rendu.
// Stratégie bot = celle du simulateur (tuer petits agents, taper le boss, acheter le + cher).
// Usage : node tests/e2e.js  (le serveur doit tourner sur http://localhost:8137)
const { chromium } = require('playwright');
const URL = 'http://localhost:8137/prototype/';
const SHOT = __dirname + '/shots/';
require('fs').mkdirSync(SHOT, { recursive: true });

async function playOneTurn(page){
  // 1) jouer toute la main (carte non encore jouée = ni "taken" ni "committed")
  for(let i=0;i<12;i++){ const c=page.locator('#hand .card:not(.taken):not(.committed)').first();
    if(await c.count()===0) break; await c.click({timeout:2000}); }
  // 2) tuer les agents abordables (du moins cher)
  for(let i=0;i<8;i++){ const e=page.locator('#enemies .card.enemy:not(.dis)').first();
    if(await e.count()===0) break; await e.click({timeout:2000}); }
  // 3) taper le boss tant qu'il reste de la griffure
  for(let i=0;i<20;i++){ const b=page.locator('#bossAttack:not(.dis)');
    if(await b.count()===0) break; await b.click({timeout:2000}); if(await isOver(page)) return; }
  // 3b) si le temps est bas, acheter du temps (voie contrôle)
  for(let i=0;i<3;i++){ const time=+(await page.locator('#timeVal').textContent()); const bt=page.locator('#buyTime:not([disabled])');
    if(time>3 || await bt.count()===0) break; await bt.click({timeout:2000}); }
  // 4) acheter la carte la plus chère qu'on peut payer
  const buy = await page.evaluate(()=>{
    const cards=[...document.querySelectorAll('#market .card.market:not(.dis)')];
    if(!cards.length) return -1;
    let best=-1,bc=-1; cards.forEach(c=>{const cost=+c.querySelector('.b-cost')?.textContent||0; if(cost>bc){bc=cost;best=[...document.querySelectorAll('#market .card.market')].indexOf(c)}});
    return best;
  });
  if(buy>=0) await page.locator('#market .card.market').nth(buy).click({timeout:2000});
  // 5) fin du tour (+ popup éventuelle "tu n'as pas uploadé" → finir quand même)
  await page.locator('#endTurn').click({timeout:2000});
  const confirm=page.locator('#confirmOv.show');
  if(await confirm.count()>0){ await page.locator('#confirmEnd').click({timeout:2000}); }
}
const isOver = async page => (await page.locator('#overlay.show').count())>0;

async function playGame(page, diff, np){
  await page.evaluate(()=>{document.getElementById('overlay').classList.remove('show');document.getElementById('howtoOv').classList.remove('show');}); // purge overlays
  await page.selectOption('#diff', diff);
  await page.selectOption('#np', String(np));
  await page.click('#newgame');
  await page.waitForTimeout(120);
  let turns=0;
  while(!(await isOver(page)) && turns<80){ await playOneTurn(page); turns++; }
  const title = (await page.locator('#ovTitle').textContent().catch(()=>'')) || '';
  const win = title.includes('VICTOIRE');
  return { win, turns, title };
}

(async()=>{
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport:{width:1280,height:900} });
  const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{ if(m.type()==='error') errors.push('console:'+m.text()); });
  await page.goto(URL, { waitUntil:'networkidle' });

  // Screenshot état initial
  await page.waitForTimeout(300);
  await page.screenshot({ path: SHOT+'01-depart.png', fullPage:true });

  const diffs=[['facile','🟢 Facile'],['normal','🟡 Normal (Smith)'],['difficile','🔴 Difficile']];
  const N=8;
  console.log('e2e Playwright — '+N+' parties solo par difficulté (clics DOM réels)');
  console.log('difficulté   | victoires | tours moy');
  for(const [d,label] of diffs){
    let wins=0,tsum=0,shot=false;
    for(let i=0;i<N;i++){
      const r = await playGame(page, d, 1);
      if(r.win) wins++; tsum+=r.turns;
      if(!shot){ // capture la 1re fin de partie de chaque difficulté
        await page.screenshot({ path: SHOT+`fin-${d}-${r.win?'WIN':'LOSE'}.png`, fullPage:true });
        shot=true;
      }
    }
    console.log(`${label.padEnd(12)} |   ${String(wins).padStart(2)}/${N}    | ${(tsum/N).toFixed(1)}`);
  }
  // Screenshot mi-partie (pour voir la lisibilité en cours de jeu)
  await page.evaluate(()=>{document.getElementById('overlay').classList.remove('show');document.getElementById('howtoOv').classList.remove('show');});
  await page.selectOption('#diff','normal'); await page.click('#newgame'); await page.waitForTimeout(120);
  await playOneTurn(page); await playOneTurn(page);
  await page.screenshot({ path: SHOT+'02-mi-partie.png', fullPage:true });

  console.log('\nErreurs JS détectées : '+(errors.length? errors.slice(0,5).join(' | ') : 'aucune ✅'));
  await browser.close();
})();
