# PLAN — reste à faire

> Reconstitué depuis la mémoire et l'historique des sessions de conception (dossier parent).
> Mis à jour le 2026-06-14.

## Statut

✅ **Jouable & équilibré — v3.** Règles fixées, 213 cartes réelles extraites (`data/`, `assets/cards/`),
prototype web fonctionnel + testé e2e (Playwright, 0 erreur JS, gagnable à toutes difficultés),
équilibrage validé par simulation (5000 parties/config).

**v3-v4 (1-3 joueurs)** ajoute, en gardant l'équilibre :
- **Avatars** : chaque joueur incarne un héros ; ses 3 cartes au marché coûtent −1★. Marché refondu
  en **5 héros × 3 cartes** (15), toutes coût ≥2, **icônes vérifiées à l'œil** sur les images.
- **Achat → défausse** ; **légue** utile (carte en main jouable chez le destinataire) ; cartes qui restent en place.
- **v4 — Agents qui drainent leur griffure** (plafond 3, cartes blanches + warm-up) : « qui frapper quand »
  devient une vraie décision situationnelle, **zéro malchance** (aucune partie « sans espoir »).

Équilibrage v4 (`node prototype/sim.js final`, 8000 parties) :
Facile hasard 99-100 % ; Normal hasard 68-86 % / malin 93-98 % ; Difficile hasard 27-61 % /
malin 75-88 % / ignore-agents 27-66 % ; **sans-espoir 0-3 %**. Bien jouer ≫ jouer au hasard.

## Reste à faire

- [ ] **Playtest physique** — le test décisif : partie « mamie » à la vraie table, chronométrée,
      pour confirmer la sensation et la cible des ≤ 5-6 min explication comprise. Rien ne remplace ça ;
      la simulation valide les chiffres, pas l'expérience.
- [ ] **Publication en ligne (optionnel)** — GitHub Pages pour permettre un test à distance.
      Repo : `ltruchot/matrix-legendary-encounters-simplified`. Le prototype est statique (aucun build).
- [ ] **Playtest "à 2-3 joueurs"** spécifiquement : valider le ressenti du légue (carte jouable reçue)
      et des avatars (réduction sur tes cartes) en hotseat — la simu ne mesure pas la valeur coop/tactique.
- [ ] **Re-vérification OCR de héros supplémentaires (seulement si besoin)** — uniquement si on veut
      élargir encore le marché. Les ~190 cartes non utilisées sont de l'OCR brut **non re-vérifié**
      (risque de confusion ★ ↔ griffure). Toute carte ajoutée doit d'abord être vérifiée à l'œil sur
      son image dans `assets/cards/`, puis répliquée dans **`index.html` ET `sim.js`**.

> Les 5 héros du marché v3 (Neo, Trinity, Morpheus, Niobe, Équipage) sont **vérifiés à l'œil**.

## Notes pour reprendre

- Après tout changement d'équilibrage : re-rouler `node prototype/sim.js final` et `node tests/e2e.js`
  (serveur sur `:8137`), et vérifier que `index.html` et `sim.js` restent synchronisés.
- Mémoire de conception détaillée (intentions, historique des décisions) :
  `~/.claude/projects/-home-cellolow-workspace-github-ltruchot/memory/matrix-legendary-simplified.md`.
