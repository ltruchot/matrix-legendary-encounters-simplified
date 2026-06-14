# PLAN — reste à faire

> Reconstitué depuis la mémoire et l'historique des sessions de conception (dossier parent).
> Mis à jour le 2026-06-14.

## Statut

✅ **Jouable & équilibré.** Règles v2 fixées, 213 cartes réelles extraites (`data/`, `assets/cards/`),
prototype web fonctionnel + testé e2e (Playwright, 0 erreur JS, gagnable à toutes difficultés),
équilibrage validé par simulation (5000 parties/config). v1, v2 et l'élargissement du marché
(+ Neo iconiques, Oracle « I Can See Why She Likes You ») sont commités/poussés sur `main`.

Diversité des voies prouvée (Normal/Difficile) : foncer 97/4 %, équilibré 100/63 %,
éco-contrôle 100/88 % → l'économie devient **indispensable** en difficile (c'était le défaut de v1, corrigé).

## Reste à faire

- [ ] **Playtest physique** — le test décisif : partie « mamie » à la vraie table, chronométrée,
      pour confirmer la sensation et la cible des ≤ 5-6 min explication comprise. Rien ne remplace ça ;
      la simulation valide les chiffres, pas l'expérience.
- [ ] **Publication en ligne (optionnel)** — GitHub Pages pour permettre un test à distance.
      Repo : `ltruchot/matrix-legendary-encounters-simplified`. Le prototype est statique (aucun build).
- [ ] **Re-vérification OCR de héros supplémentaires (seulement si besoin)** — uniquement si on veut
      varier/élargir encore le marché. Les ~190 cartes non utilisées sont de l'OCR brut **non re-vérifié**
      (risque de confusion ★ ↔ griffure). Toute carte ajoutée au marché doit d'abord être vérifiée à l'œil
      sur son image dans `assets/cards/`, puis répliquée dans **`index.html` ET `sim.js`** (constantes dupliquées).

## Notes pour reprendre

- Après tout changement d'équilibrage : re-rouler `node prototype/sim.js final` et `node tests/e2e.js`
  (serveur sur `:8137`), et vérifier que `index.html` et `sim.js` restent synchronisés.
- Mémoire de conception détaillée (intentions, historique des décisions) :
  `~/.claude/projects/-home-cellolow-workspace-github-ltruchot/memory/matrix-legendary-simplified.md`.
