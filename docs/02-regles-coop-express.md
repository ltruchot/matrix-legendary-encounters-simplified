# 02 — Règle cœur : « MATRIX 5 » (Coop Express)

> **But du stand :** 1 à 4 joueurs, **ensemble**, abattre **Agent Smith** avant que le temps ne tombe à 0.
> Tout se joue aux icônes. Durée cible : **explication ≤ 90 s, partie ≤ 4 min.**

> ✅ **Chiffres validés** : équilibrage mesuré sur **5000 parties/config** par le simulateur
> (`prototype/sim.js`) avec les **vraies stats des cartes** (`data/cards.csv`). Plus de valeurs « au pif ».
> Un **prototype jouable** existe : ouvre `prototype/index.html` dans un navigateur.

---

## Matériel (que des vraies cartes + le plateau)

- **1 Boss** : une carte *Agent Smith* au centre. On lui pose un marqueur de **PV**
  (jeton, pièces, ou un dé) sur sa valeur de départ.
- **Le Time Track** du plateau, avec son curseur → c'est **l'horloge partagée** (la « vie » de l'équipe).
- **Pile de menace** : un paquet d'**ennemis face cachée** (set trié, *ennemis uniquement*).
- **Marché** : **3 cartes héros** face visible (d'un seul groupe de héros simple) + une pioche pour les remplacer.
- **Deck de départ par joueur** : 6 cartes = **3 « Unplug » (★1)** + **3 « There Is No Spoon » (griffure 1)**.

*(La recette exacte des cartes à sortir est dans `04-selection-cartes.md`.)*

## Réglages selon la difficulté choisie

**Le Time Track démarre toujours à 10** (la vraie valeur du jeu). Seul le **PV du boss** change :

| | Boss (PV) | Carte boss réelle | Victoire mesurée | Durée |
|---|---|---|---|---|
| 🟢 Facile | **8** | un Agent (8 PV) | ~97 % | ~6 tours-joueur |
| 🟡 Normal | **10** | un Agent (10 PV) | ~83 % | ~7 tours-joueur |
| 🔴 Difficile | **12** | **Agent Smith** (le vrai, 12 PV) | ~55 % | ~8 tours-joueur |

> 3 niveaux = **3 parties différentes** à rejouer. On ne joue **qu'un seul boss** par partie de 5 min.
> (Taux de victoire = bot optimal ; un humain débutant sera un peu en dessous → marge « partir content ».)

## Mise en place (~45 s)

1. Boss au centre, marqueur de PV sur la valeur du tableau (8 / 10 / 12).
2. Curseur du Time Track sur **10**.
3. La pile de menace, face cachée, à côté du boss.
4. **4 héros** du marché, face visible.
5. Chaque joueur mélange son deck de 6 et **pioche 5 cartes**.

## Le tour d'un joueur (toujours le même, très court)

> Énoncé au stand : **« Un agent débarque. Tu joues ta main. Tu tapes, tu achètes. Ce qui reste te coûte du temps. »**

1. **Un agent débarque** — *seulement s'il y a moins de **2 agents** déjà sur la table.* Retourne la carte
   du dessus de la pile de menace face visible. *(Son chiffre de griffure = ses PV.)*
   👉 Cette limite « **2 agents max** » remplace les 5 salles du vrai jeu (qui retardent les ennemis) :
   c'est le réglage-clé qui rend la partie tendue mais gagnable (validé en simulation).
2. **Joue toute ta main.** Additionne tes **★** et tes **griffures**.
3. **Dépense, dans l'ordre que tu veux :**
   - **griffure → frapper.** Retire des PV au **boss** et/ou **tue des agents** présents
     (dépense exactement leur chiffre → la carte part dans la défausse des ennemis).
   - **★ → acheter.** Prends **1 carte du marché** en payant son **coût** (chiffre bas-droit) ;
     elle va dans **ta défausse**. Remplace-la aussitôt par la pioche du marché.
4. **Le temps file.** Pour **chaque agent encore vivant** sur la table (boss exclu),
   recule le curseur du **Time Track de 1**.
5. **Fin du tour.** Défausse ce que tu as joué + le reste de ta main, puis **repioche 5 cartes**
   (deck vide → mélange ta défausse pour refaire un deck).

Le joueur suivant (sens horaire) enchaîne.

## Victoire / Défaite

- 🏆 **Victoire** dès que les **PV du boss tombent à 0**. (« Vous avez libéré la Matrice. »)
- 💀 **Défaite** si le **Time Track atteint 0**. (« Les machines ont gagné. »)

> Personne n'est éliminé en cours de route : tout le monde joue jusqu'au bout. Idéal pour un stand.

## Pourquoi ça marche

- **Une seule règle de tour**, énonçable en ~3 phrases → apprise en moins de 90 s, sans lecture.
- **Le dilemme de Legendary intact** : ta griffure, tu la mets sur le **boss** (gagner vite) ou sur les
  **agents** (protéger le temps) ? Tension à chaque tour.
- **Le deckbuilding** est là : tu achètes des héros plus forts pour finir le boss avant la fin du temps.
- **Horloge visible** (le curseur descend) = tension lisible par tous, et **durée garantie**.
- **Climax** : le boss à zéro = moment fort, on repart content.

## La fiche d'aide du stand (à plastifier)

```
        ███ MATRIX 5 ███
  Battez l'agent avant la fin du temps.

  À TON TOUR :
   1. Si < 2 agents : retourne 1 agent (pile de menace).
   2. Joue toute ta main.
   3. ╱╱╱ griffure = frapper le boss / tuer les agents
      ★    étoile   = acheter 1 carte (prix = chiffre en bas à droite)
   4. Chaque agent encore vivant → le TEMPS recule de 1.
   5. Défausse, repioche 5.

  GAGNÉ : boss à 0 PV.   PERDU : le temps à 0.
  ⛔ Le texte ne compte pas — regarde les symboles.
```
