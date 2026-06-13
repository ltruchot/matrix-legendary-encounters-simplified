# 04 — Sélection des cartes : la recette de tri

> Objectif : sortir de la boîte **un petit paquet trié** prêt à jouer, qui ne contient que des cartes
> **lisibles aux icônes**. On range tout le reste.

## Rappel du contenu de la boîte (≈ 500 cartes, guide de tri officiel)

- **35 Unplug** → cartes **★** de base (Recruit)
- **25 There Is No Spoon** → cartes **griffure** de base (Attack)
- **5 Free Your Mind** → cartes à effet (texte) → **NON utilisées**
- **13 Avatars**, **5 Hovercrafts**, **40 Strikes**, **19 Part of the System**, **12 cartes Act**, **9 cartes Traitor Mode**
- **Groupes de héros (14 cartes chacun)** : Morpheus (Matrix), Trinity (Matrix), **Tank**,
  **The Nebuchadnezzar Crew**, Neo (Reloaded), Morpheus (Reloaded/Rev), Trinity (Reloaded/Rev),
  Ship Captains, Neo (Revolutions), Niobe, Link, Defenders of Zion
- **Groupes « Extra »** : Neo (The Matrix), The Keymaker, Seraph
- **Agent Smith** : présent en cartes **« Extra »** d'Act (une version par Acte → notre boss à 3 difficultés)

## Ce qu'on SORT pour le jeu découverte

> ✅ **Toutes les stats réelles sont dans [`../data/cards.csv`](../data/cards.csv)** (et `cards.json`), extraites
> par OCR des **213 visuels officiels** (`assets/cards/`, source : legendarycardgame.com/matrix). Plus d'hypothèses.

### 1. Monnaie de départ (decks joueurs)
Chaque joueur : **3 Unplug (★1)** + **2 There Is No Spoon (griffure 1)** = deck de 5, pioche 5.
→ Pour 3 joueurs (max) : **9 Unplug + 6 Spoon**. (La boîte en contient 35 + 25 → large.)
Règles v2 : achat **sur le dessus du deck**, **★→temps** (3★=+1, max 3/partie), **léguer 1 carte**, **1–3 joueurs**.

### 2. Le marché (Dock) — **un seul** groupe de héros
Choisir **1 groupe de 14 cartes** = la pioche du marché. Recommandés (à confirmer en regardant les cartes) :

- 👍 **The Nebuchadnezzar Crew** ou **Tank** — héros « génériques », icônes claires, peu de texte parasite.
  *(Ce sont justement les héros conseillés par le jeu pour le film « The Matrix ».)*
- Alternative thématique forte : **Trinity (The Matrix)** ou **Morpheus (The Matrix)**.

> Critère de choix : un groupe avec des **coûts variés** (≈ 2 à 6) et un bon mix **★ / griffure**, pour
> que l'achat ait du sens. À trancher en feuilletant le groupe (voir « à vérifier » plus bas).

#### 🎬 Univers cohérents par film (source : aide officielle, `bgg-files/`)
Pour rester thématique, on peut puiser héros **et** boss dans un même film :

| Film | Héros (groupes) | Avatars dispo | Climax (Acte 3) |
|---|---|---|---|
| **The Matrix** *(conseillé pour débuter)* | Morpheus, Trinity, Tank, Nebuchadnezzar Crew | Neo, Morpheus, Trinity, Switch, Mouse, Apoc | *He is the One* |
| **Reloaded** | Neo (Reloaded), Morpheus, Trinity, Ship Captains | Neo (Reloaded), Morpheus, Trinity, Niobe, Roland, Soren | *The Source* |
| **Revolutions** | Neo (Revolutions), Niobe, Link, Defenders of Zion | Neo (Rev.), Morpheus, Trinity, Niobe, Roland, Soren | *Everything That Has a Beginning* |

→ Pour le jeu cœur, on n'a besoin que **d'un seul groupe** comme marché ; le reste sert si on veut un
marché plus riche (2 groupes) ou pour rejouer un autre univers.

### 3. Le boss — Agent Smith (3 difficultés)
Sortir les **3 cartes Agent Smith** (Extra des Actes 1, 2, 3) = nos 3 niveaux. On **ignore leur texte** ;
on leur attribue les PV du tableau de `02` via un marqueur (leur chiffre imprimé sert juste de repère).

> Alternative : utiliser comme boss l'**ennemi final de l'Acte 3** d'un film (le « Final Enemy » du climax
> ci-dessus) plutôt qu'Agent Smith — au choix selon les chiffres qu'on trouve sur les cartes.

### 4. La pile de menace — **ennemis uniquement**
Parcourir les **mini-decks d'Acte** et ne garder que les cartes de type **« Enemy »** (liseré rouge,
descripteur *Enemy – Machine / Human / Program*, avec un **chiffre de griffure** = ses PV).

⚠️ **Écarter impérativement** (cassent le « zéro texte ») :
- les **Challenges** (liseré orange) et les **Events**,
- les **Part of the System**, **Inevitable**, **Act**, **Traitor Mode**,
- tout ennemi marqué d'un **◎** (« ne peut pas être combattu »).

Constituer une pile face cachée de **6 / 8 / 10** ennemis selon la difficulté (cf. `02`),
en mettant idéalement les **petits chiffres au-dessus** et les plus gros en dessous (escalade douce).

### 5. Le plateau & marqueurs
- Utiliser **le Time Track** du plateau + son curseur (l'horloge partagée).
- Un **marqueur de PV** pour le boss : jeton, pièces, ou un dé posé sur la carte.

## Ce qu'on RANGE (non utilisé par le jeu cœur)

Avatars, Hovercrafts, Free Your Mind, Strikes, Part of the System, Acts, Traitor Mode, Challenges, Events,
et tous les groupes de héros non choisis. *(Certains resservent dans les variantes — ex. Strikes pour la
version fidèle, un 2ᵉ groupe de héros pour un marché plus riche.)*

## Recette validée (chiffres réels)

Composition exacte utilisée par le prototype (et recommandée à la table) — toutes les valeurs viennent des
vraies cartes :

**Marché (≈10 héros à valeurs FIXES, sans texte conditionnel) :**

| Carte (vraie) | ★ | griffure | coût |
|---|---|---|---|
| Dozer | 2 | – | 2 |
| Operator / Welcome to Real World | 2 | – | 3 |
| We Think You're Bugged | 1 | – | 3 |
| Hovercraft (×5 classes) | 2 | – | 3 |
| Combat Training | – | 2 | 4 |
| Your Men Are Already Dead | 2 | – | 4 |
| Mouse | 1 | 1 | 4 |
| You Think That's Air | – | 3 | 5 |
| Knife Throw | – | 3 | 6 |
| It's a Trap! | – | 4 | 6 |
| Apoc | – | 4 | 7 |
| Breakfast of Champions | 2 | 2 | 7 |

> On écarte les cartes à « + » ou « choisir » (Switch, Brawl…) pour rester 100 % icône-pur. Mettre ~2 copies
> de chaque commune, 1 des chères → pioche de marché de ~20 cartes, 4 face visibles.

**Pile de menace (ennemis génériques + Matrix, PV réels) :** Security Guard **1**, Tactical Police **2**,
Soldier **3**, Police Officer **3**, Cypher **5**, Military Guard **6**, Agent Jones **8** (escalade ; plusieurs
copies des petits). On **écarte** Bug (poubelle) et tout ennemi marqué ◎ ou à effet purement textuel.

**Boss :** Agent **8** (facile) / Agent **10** (normal) / **Agent Smith 12** (difficile, `Act3HeIsTheOneExtra_9`).
