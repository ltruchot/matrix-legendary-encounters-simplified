# 04 — Sélection des cartes : la recette exacte

> 🃏 **Guide visuel = [`../prototype/cartes-a-sortir.html`](../prototype/cartes-a-sortir.html)** : ouvre-le pour
> voir chaque carte (vraie image + quantité + icônes). Ce fichier en est la version texte.
>
> ✅ **Toutes les cartes ci-dessous ont été vérifiées à l'œil** sur les vrais visuels (`assets/cards/`).
> Stats brutes : [`../data/cards.csv`](../data/cards.csv). Les cartes *non utilisées* restent en OCR non revérifié.

Tout se joue **aux icônes** : ★ doré = recruter, **griffure rouge** = attaquer (et PV des ennemis),
chiffre bas-droit = prix. Le texte est ignoré.

## 1. Deck de départ — par joueur (1 à 3 joueurs)
- **3× Unplug** (★1) + **2× There Is No Spoon** (griffure 1) = 5 cartes, on pioche 5.
- Pour 3 joueurs : 9 Unplug + 6 There Is No Spoon (la boîte en a 35 / 25).

## 2. Marché commun (21 cartes — mélanger, 4 face visible)
Que des cartes **rentables aux icônes** (les cartes dont la valeur est dans le texte sont écartées).

| Carte (vraie) | ★ | griffure | coût | ×copies |
|---|---|---|---|---|
| Dozer (Nebuchadnezzar Crew) | 2 | – | 2 | 2 |
| Operator (Tank) | 2 | – | 3 | 2 |
| I've Spent My Entire Life (Morpheus) | 2 | – | 3 | 2 |
| The Nebuchadnezzar (Hovercraft) | 2 | – | 3 | 2 |
| Your Men Are Already Dead (Trinity) | – | 2 | 4 | 2 |
| Combat Training (Tank) | – | 2 | 4 | 2 |
| You Think That's Air (Morpheus) | – | 3 | 5 | 2 |
| It's a Trap, Get Out! (Tank) | – | 4 | 6 | 1 |
| **I Know Kung Fu (Neo)** | – | 1 | 2 | 2 |
| **Guns, Lots of Guns (Neo)** | – | 2 | 4 | 2 |
| **You Move Like They Do (Neo)** | – | 4 | 5 | 2 |

> 4 cartes donnent **★** (le moteur d'achat, coût 2-3), 7 donnent de la **griffure** (les dégâts, coût 2-6).
> Les 3 **Neo** sont les cartes « Extra » Neo (The Matrix) — iconiques et bien équilibrées.

## 3. Pile de menace — les agents (face cachée)
Ennemis à PV fixes, escalade douce (petits au-dessus). Si la boîte n'a pas autant de copies des
« Part of the System », mets ce qu'il y a.

| Agent | PV (griffure) | ×copies |
|---|---|---|
| Security Guard *(Part of the System)* | 1 | 3 |
| Tactical Police *(Part of the System)* | 2 | 3 |
| Soldier *(Part of the System)* | 3 | 2 |
| Police Officer | 3 | 1 |
| Cypher | 5 | 1 |
| Military Guard | 6 | 1 |
| Agent Jones | 8 | 1 |

⚠️ On **écarte** : Bug, les Challenges/Events, et tout ennemi marqué **◎** (texte « ne peut pas être combattu »).

## 4. Boss — selon la difficulté (1 seul par partie)
| Difficulté | Boss (vraie carte) | PV | Time Track |
|---|---|---|---|
| 🟢 Facile | **Agent** (`Act3 – The Source`) | 10 | curseur sur 10 |
| 🟡 Normal | **Agent Smith** (`He is the One – Extra`) | 12 | curseur sur 10 |
| 🔴 Difficile | **Agent Smith** (même carte) | 12 | curseur sur **8** |

Pose un marqueur de PV sur le boss (jeton/pièces/dé). On ignore son texte (Double Strike, Undefeatable…).

## 5. Plateau & marqueurs
- Le **Time Track** du plateau d'origine + son curseur (sur 10, ou 8 en difficile).
- Un **marqueur de PV** pour le boss.

## Ce qu'on RANGE
Tout le reste : Avatars, Free Your Mind, Strikes, Part of the System non-ennemis, Acts, Traitor Mode,
Challenges, Events, et tous les groupes de héros/cartes non listés ci-dessus.
