# 06 — Données réelles & prototype jouable

Tout ce qui suit est **ancré sur les vraies cartes** — aucune invention.

## Les visuels officiels (213 cartes)

`assets/cards/` contient les **213 visuels uniques** du jeu, téléchargés depuis la galerie officielle
[legendarycardgame.com/matrix](https://www.legendarycardgame.com/matrix). Noms de fichiers parlants
(ex. `TrinityTheMatrix_2Common.jpg`, `Act3HeIsTheOneExtra_9.jpg`, `PartOfTheSystem-Soldier.jpg`).
Ils sont **versionnés dans le repo** pour permettre le test en ligne.

## La base de données

- [`data/cards.csv`](../data/cards.csv) — **tableur réutilisable** (Excel/Sheets), une ligne par carte :
  `file, category, name, type, star, claw, cost, enemy_hp, strike_dmg, class, rarity, health, speed, rank, keywords, note`.
- [`data/cards.json`](../data/cards.json) — mêmes données structurées par catégorie (lecture machine).

Extraites par **OCR** (lecture des images) — chaque valeur a été lue sur la carte, pas devinée.

### Faits saillants confirmés
- **Unplug = ★1** (coût 0) · **There Is No Spoon = griffure 1** (coût 0).
- **Hovercrafts** : ★2, coût 3 (×5 classes).
- **Strikes** : dégâts de 0 à 5.
- **Héros** : coûts réels 2→9, ★/griffure de 1 à 5 (les grosses rares montent à 5-6).
- **Ennemis génériques (Part of the System)** : Security Guard **1**, Tactical Police **2**, Soldier **3**.
- **Boss canonique du 1er film** : **Agent Smith = 12 PV** (confirmé par la carte d'Acte 3).
- Icônes ◎ / « + » = effets **textuels** (Undefeatable, Evade, conditionnels) → **ignorés** dans le jeu découverte.

## Le prototype jouable

[`prototype/index.html`](../prototype/index.html) — **ouvre-le dans un navigateur** (double-clic, ou sers le
dossier). Implémente « Matrixé par Shodo » coop (1–4 joueurs en hotseat) avec **les vraies images et les vraies stats** :
- Time Track, PV du boss, marché (4 cartes), main, pile de menace.
- Clique tes cartes pour les jouer (★ / griffure s'additionnent), clique le boss/les agents pour frapper,
  le marché pour acheter, « Fin du tour ».
- Sélecteurs difficulté / joueurs / Time Track.

> Pour un test « en ligne » propre, on pourra publier `prototype/` + `assets/cards/` sur GitHub Pages
> (statique, aucune dépendance).

## Le simulateur d'équilibrage

[`prototype/sim.js`](../prototype/sim.js) — moteur identique, joué par un bot, pour mesurer l'équilibrage :
- `node prototype/sim.js final` → taux de victoire & durée par difficulté et nombre de joueurs.
- `node prototype/sim.js grid [main] [unplug] [spoon] [cap] [grace]` → grille boss × temps pour re-régler.

C'est l'outil qui a transformé une 1re version injouable (~0 % de victoire) en l'équilibrage validé actuel
(voir `05-playtest.md`).

## Reproduire le téléchargement des cartes (si besoin)

Les URLs sont dans la galerie. Pour re-télécharger : extraire les liens
`images.squarespace-cdn.com/.../*.jpg` du HTML de la page et `curl` chaque image en `?format=1000w`.
