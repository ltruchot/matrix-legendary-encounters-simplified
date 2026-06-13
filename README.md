# Matrix Legendary Encounters — édition « Découverte 5 minutes »

Une **version ultra-simplifiée** de *Legendary Encounters: The Matrix* (Upper Deck, 2023),
conçue pour un **stand de découverte** :

- une partie **≤ 5–6 minutes, explication comprise** ;
- jouable par **tout le monde** : enfants, mamie, joueurs occasionnels, geeks aguerris ;
- **sans lire aucun texte de carte** (le texte est en anglais → on le rend décoratif) ;
- en **réutilisant les vraies cartes de la boîte** — rien à fabriquer, rien à imprimer pour jouer ;
- en gardant **l'essence et les meilleurs twists** de Legendary (jeu très bien noté sur BGG).

> 🟢 **La règle d'or affichée au stand : « Le texte ne compte pas. Seuls les chiffres et les icônes parlent. »**

## L'idée en une phrase

Le moteur de Legendary tient **entièrement aux icônes** déjà imprimées sur les cartes :
l'**étoile ★** sert à acheter des héros, la **griffure** sert à frapper, le **chiffre en bas à droite**
est un prix. On joue donc le jeu *aux symboles*, en ignorant tout le reste.

## Comment lire ce repo

| Fichier | Contenu |
|---|---|
| [`docs/00-essence-legendary.md`](docs/00-essence-legendary.md) | Pourquoi Legendary est génial, ce qu'on garde / ce qu'on jette, et pourquoi. |
| [`docs/01-iconographie.md`](docs/01-iconographie.md) | Le vocabulaire visuel exact des cartes (★, griffure, coût, PV…). À connaître avant tout. |
| [`docs/02-regles-coop-express.md`](docs/02-regles-coop-express.md) | **Le jeu cœur** : règle complète tenant sur une page, prête pour le stand. |
| [`docs/03-variantes.md`](docs/03-variantes.md) | Scan tension, duel 1v1, multi free-for-all + 3 moteurs économiques. |
| [`docs/04-selection-cartes.md`](docs/04-selection-cartes.md) | La liste **exacte** des vraies cartes à sortir de la boîte (recette validée). |
| [`docs/05-playtest.md`](docs/05-playtest.md) | Équilibrage **validé par simulation** (5000 parties/config) + protocole de test. |
| [`docs/06-donnees-et-prototype.md`](docs/06-donnees-et-prototype.md) | Les données réelles (213 cartes OCR), le **prototype jouable** et le simulateur. |

## 🎮 Tester tout de suite

- **Jouer** : ouvre [`prototype/index.html`](prototype/index.html) dans un navigateur (vraies cartes, vraies stats).
- **Préparer la boîte** : [`prototype/cartes-a-sortir.html`](prototype/cartes-a-sortir.html) — guide visuel des cartes exactes à sortir (images + quantités + icônes vérifiées).
- **Équilibrer** : `node prototype/sim.js final` (taux de victoire mesurés).
- **Données** : [`data/cards.csv`](data/cards.csv) — les 213 cartes avec leurs stats.

## Sources de référence

Conception fondée sur les **règlements officiels Upper Deck** (lus intégralement) :
- `assets/rulebooks/Matrix_Rulebook.pdf` — règles complètes de l'édition Matrix.
- `assets/rulebooks/Legendary_Encounters_Rules-Alien.pdf` — même moteur, utile pour comparer.

Recoupé avec les **aides de jeu communautaires (BGG)**, dans `bgg-files/` — ce sont des références
*fidèles* (résumé de règles + aide solo FR), **pas** des variantes simplifiées : elles confirment notre
compréhension du moteur et la composition exacte des 3 films (héros / avatars / actes).

## Statut

✅ **Jouable & équilibré.** Règles fixées, 213 cartes réelles extraites (`data/`, `assets/cards/`),
prototype web fonctionnel, équilibrage validé sur 5000 parties/config (`docs/05`). Reste : **playtest
physique** (test « mamie » chronométré) pour confirmer la sensation à la table, et choix de publication
(GitHub Pages pour le test en ligne).
