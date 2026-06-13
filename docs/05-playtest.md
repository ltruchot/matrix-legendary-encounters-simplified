# 05 — Playtest : protocole & boutons de réglage

But : garantir la promesse du stand → **explication ≤ 90 s, partie ≤ 4 min, départ content**,
et un taux de victoire ni trop facile ni frustrant (**~60–70 %** est idéal pour « partir content »).

## Protocole (à faire avec les vraies cartes)

1. **Test « mamie » (le plus important).** Une personne **non-joueuse** s'installe.
   - Chrono 1 : durée de l'explication (cible **≤ 90 s**). A-t-elle eu besoin de lire une carte ? (doit être *non*).
   - Chrono 2 : durée de la partie (cible **≤ 4 min**).
   - Question finale : « tu rejouerais ? » (on vise un *oui* spontané).
2. **3 configurations chronométrées** : solo, 2 joueurs, 4 joueurs. Noter durée + issue (victoire/défaite).
3. **Les 3 difficultés** : vérifier que Facile/Normal/Difficile donnent bien 3 sensations différentes.
4. **1 variante** au moins : tester **A1 (scan)** *ou* **A2 (duel)** pour valider qu'elles tiennent aussi en ~5 min.

Tableau de relevé suggéré :

| Partie | Joueurs | Difficulté | Éco (B1/2/3) | Explication | Durée | Issue | Ressenti |
|---|---|---|---|---|---|---|---|
| 1 | | | | | | | |

## ✅ Équilibrage déjà validé par simulation

Les stats des cartes ont été **extraites des 213 visuels officiels** (`data/cards.csv`) et l'équilibrage
**mesuré sur 5000 parties par config** avec un bot (`prototype/sim.js`). Résultats (Time Track 10, main 5,
starter 3 Unplug + 3 Spoon, **max 2 agents**) :

| Difficulté | Boss | Victoire (1–4 j) | Durée |
|---|---|---|---|
| 🟢 Facile | 8 | ~97 % | ~6 tours-joueur |
| 🟡 Normal | 10 | ~80–85 % | ~7 |
| 🔴 Difficile | 12 (Smith) | ~50–60 % | ~8 |

Commandes utiles :
- `node prototype/sim.js final` → la table ci-dessus (par nombre de joueurs).
- `node prototype/sim.js grid [main] [unplug] [spoon] [cap] [grace]` → grille boss × temps pour re-régler.

Le **playtest physique** ci-dessous sert à confirmer ces chiffres *à la table* (sensation, durée réelle,
test « mamie »). La méthode de calibrage reste utile si tu changes le set de cartes.

## Calibrage express (5 min, avant le 1er vrai jeu)

Objectif : remplacer mes chiffres « au pif » par des chiffres **mesurés sur tes vraies cartes**.

1. **Mesure la puissance de frappe.** Un joueur joue 3 tours « à blanc » (pioche 4, additionne la griffure,
   achète quand il peut, repioche). Note la **griffure totale produite sur ces 3 tours** → appelle-la `F`.
2. **Fixe les PV du boss.** Vise une partie de ~5-6 tours de joueur :
   - 🟢 Facile : **PV boss ≈ F × 1,5** · 🟡 Normal : **≈ F × 2** · 🔴 Difficile : **≈ F × 2,5**.
   *(Le deck monte en puissance en cours de partie, d'où les multiplicateurs > 1.)*
3. **Fixe le Time Track** : pars sur **8** et ajuste (+1 si trop dur, −1 si trop facile).
4. **Vérifie le marché.** Regarde les 14 cartes du groupe choisi : s'il n'y a presque que des ★ (ou que des
   coûts ≥ 5), le marché sera mou → change de groupe (voir `04`). Idéal : coûts étalés de ~2 à ~6.

Tu obtiens des valeurs **ancrées dans tes cartes** en une poignée de minutes, sans dépendre d'aucune base
externe.

## Risque connu à surveiller

Le seul vrai inconnu est le **profil du groupe de héros du marché** (éventail des coûts et mix ★/griffure).
C'est pour ça que `04` recommande de **comparer 2-3 groupes** et de **photographier** le groupe pressenti.
Tout le reste (boss, temps) se règle avec les 2 boutons.

## Les boutons de réglage (et leur effet)

| Bouton | ↑ augmente | Effet sur la partie |
|---|---|---|
| **PV du boss** | plus dur / plus long | principal levier de difficulté & de durée |
| **Time Track de départ** | plus facile / plus long | marge de l'équipe avant défaite |
| **Taille de la main** (pioche/tour) | plus facile / plus rapide | plus de ressources par tour → on tape plus fort |
| **Coût des héros du marché** | plus dur | ralentit la montée en puissance |
| **Petits chiffres des ennemis** | plus facile | ennemis vite tués → le temps s'érode moins |
| **Nb d'ennemis révélés / tour** | plus dur | sature la table, force des choix |

## Réglages validés (rappel de `02`)

| | Boss PV | Time Track | Max agents | Main |
|---|---|---|---|---|
| 🟢 Facile | 8 | 10 | 2 | 5 |
| 🟡 Normal | 10 | 10 | 2 | 5 |
| 🔴 Difficile | 12 | 10 | 2 | 5 |

## Symptômes → correctifs rapides

- **Trop long (> 5 min)** → baisser les PV du boss (−2/−3) **ou** monter la main à 5.
- **Trop facile (victoire écrasante)** → monter PV boss, ou baisser le Time Track, ou monter les coûts.
- **Trop dur / frustrant** → monter le Time Track (+2), baisser les chiffres des ennemis.
- **Temps mort / on hésite** → réduire le marché à 2 cartes, simplifier l'éco vers **B3**.
- **« J'ai rien compris »** → passer en **B3** (une seule icône à lire), enlever la variante scan.

## Définition de « terminé »

- [ ] Test mamie réussi : explication ≤ 90 s, **0 lecture de carte**, partie ≤ 4 min, « je rejoue ».
- [ ] Solo / 2 / 4 joueurs tiennent dans la fenêtre 5–6 min.
- [ ] Les 3 difficultés produisent 3 sensations distinctes, taux de victoire ~60–70 %.
- [ ] Au moins une variante (scan ou duel) validée.
- [ ] Chiffres définitifs reportés dans `02-regles-coop-express.md` (remplacent les valeurs de départ).
- [ ] Fiche d'aide A5 finalisée et plastifiée pour le stand.
