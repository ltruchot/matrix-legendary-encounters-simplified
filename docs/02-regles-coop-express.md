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
- **Deck de départ par joueur** : 5 cartes = **3 « Unplug » (★1)** + **2 « There Is No Spoon » (griffure 1)**.

*(La recette exacte des cartes à sortir est dans `04-selection-cartes.md`.)*

## Réglages selon la difficulté choisie

**1 à 3 joueurs** (durée stable quel que soit le nombre). La difficulté = **quelle vraie carte boss** +
**où on place le curseur du Time Track** — et elle détermine *quelle stratégie* est viable :

| | Boss (vraie carte) | Time Track | Foncer | Équilibré | Éco/contrôle | Durée |
|---|---|---|---|---|---|---|
| 🟢 Facile | **Agent** (10 PV) | 10 | 98 % | 100 % | 100 % | ~6 tours |
| 🟡 Normal | **Agent Smith** (12 PV) | 10 | **63 %** | 97 % | 100 % | ~7 tours |
| 🔴 Difficile | **Agent Smith** (12 PV) | **8** | **4 %** | 64 % | 89 % | ~7 tours |

> 🎯 En **facile**, foncer suffit. En **normal**, foncer devient un pari (62 %) — investir paie. En **difficile**,
> **l'économie est indispensable** (foncer = 4 %). 3 vraies stratégies, validées sur 5000 parties/config
> (`prototype/sim.js final`). On joue **un seul boss** par partie de 5 min.

## Mise en place (~45 s)

1. Boss au centre (Agent **10** ou Agent Smith **12** selon la difficulté), marqueur de PV sur sa valeur.
2. Curseur du Time Track sur **10** (ou **8** en difficile).
3. La pile de menace, face cachée, à côté du boss.
4. **4 héros** du marché, face visible.
5. Chaque joueur mélange son deck de 5 et **pioche 5 cartes**.

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
   - **★ → recruter.** Prends **1 carte du marché** en payant son **coût** (chiffre bas-droit) ;
     elle se pose **sur le dessus de ton deck** (tu la joues dès **ton prochain tour**). Remplace-la au marché.
   - **★ → gagner du temps** *(Buy Time)* : paie **3★** pour remonter le **Time Track de +1**.
     Maximum **3 fois par partie** (c'est un secours, pas un moteur).
4. **Léguer (0 ou 1 carte).** Tu peux donner **1 carte non jouée** au **joueur suivant** : elle se pose sur
   **le dessus de son deck** (il la jouera à son tour). *En solo : garde-la pour ton prochain tour.*
   → entraide / coup de pouce économique, et un peu d'interaction.
5. **Le temps file.** Pour **chaque agent encore vivant** (boss exclu), recule le **Time Track de 1**.
6. **Fin du tour.** Défausse ce que tu as joué + le reste de ta main, puis **repioche 5 cartes**
   (deck vide → mélange ta défausse).

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
      ★ = recruter 1 carte (→ sur ton deck, jouée au prochain tour)
          OU gagner du temps (3★ = +1, max 3x)
   4. Tu peux léguer 1 carte au joueur suivant (solo : la garder).
   5. Chaque agent encore vivant → le TEMPS recule de 1.
   6. Défausse, repioche 5.

  GAGNÉ : boss à 0 PV.   PERDU : le temps à 0.
  ⛔ Le texte ne compte pas — regarde les symboles.
```
