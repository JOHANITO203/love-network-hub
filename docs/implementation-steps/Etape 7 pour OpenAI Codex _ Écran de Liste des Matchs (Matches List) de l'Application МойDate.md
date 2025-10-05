## Prompt Réécrit pour OpenAI Codex : Écran de Liste des Matchs (Matches List) de l'Application МойDate

Ce prompt est la septième étape de notre approche modulaire. Il guide OpenAI Codex pour créer les composants React nécessaires à l'écran de liste des matchs, où l'utilisateur peut voir ses matchs existants et ceux qui l'ont liké.

### Rôle et Contexte

**Rôle de Codex :** Tu es un Senior Frontend Developer expert en React, TailwindCSS et Framer Motion. Ta mission est de construire une interface claire et fonctionnelle pour afficher les matchs, permettant des actions rapides et une navigation facile vers les conversations.

**Contexte du Projet :** Nous continuons le développement de МойDate, une application de dating responsive. La base du projet (structure, configuration Tailwind), le flux d'authentification, la configuration du profil, l'écran Discover et la Match Modal sont déjà en place. Cette étape se concentre sur l'affichage et la gestion des matchs de l'utilisateur.

### Instructions Détaillées pour l'Écran de Liste des Matchs

1.  **Structure Générale :**
    *   Crée un composant React nommé `MatchesListScreen` dans `src/pages/MatchesListScreen.jsx`.
    *   Cet écran doit présenter deux sections distinctes ou des onglets :
        *   "Vos Matchs" : Liste des utilisateurs avec lesquels l'utilisateur a matché.
        *   "Ceux qui vous ont liké" : Liste des utilisateurs qui ont liké le profil de l'utilisateur (permettant à l'utilisateur de les liker en retour pour créer un match).
    *   Chaque section doit afficher les profils sous forme de `grid` (grille) ou de `list` (liste), avec une préférence pour une grille visuellement attrayante sur mobile et desktop.

2.  **Contenu de Chaque Élément de la Liste/Grille :**
    *   Pour chaque profil affiché, inclus :
        *   L'`avatar` de l'utilisateur (photo principale).
        *   Le `prénom` de l'utilisateur.
        *   Un indicateur visuel pour les nouveaux matchs ou les likes non traités.
    *   Lorsqu'un utilisateur clique sur un match dans la section "Vos Matchs", il doit être redirigé vers l'écran de chat correspondant.
    *   Lorsqu'un utilisateur clique sur un profil dans la section "Ceux qui vous ont liké", il doit pouvoir voir un aperçu du profil et avoir la possibilité de `liker` ou `rejeter` (actions rapides ❤️ ❌).

3.  **Actions Rapides :**
    *   Dans la section "Ceux qui vous ont liké", implémente des boutons ou des icônes pour les actions rapides `❤️` (liker) et `❌` (rejeter) directement sur l'élément du profil, sans avoir à naviguer vers un écran de détail.
    *   Ces actions doivent déclencher une animation visuelle et mettre à jour la liste.

4.  **Design et Style (TailwindCSS) :**
    *   Respecte l'identité visuelle définie : couleur primaire `#E94057` pour les éléments interactifs, fond blanc, textes noirs et gris.
    *   Les avatars doivent être circulaires et bien visibles.
    *   Les éléments de la grille/liste doivent avoir des `arrondis XL` et des `ombres soft` pour un aspect moderne.
    *   Le design doit être **responsive et mobile-first**, assurant une présentation optimale sur toutes les tailles d'écran.
    *   Prévois un état visuel pour les listes vides (par exemple, "Aucun match pour l'instant").

5.  **Animations (Framer Motion) :**
    *   Ajoute des animations subtiles lors du chargement de la liste des matchs.
    *   Anime l'apparition et la disparition des éléments de profil lors des actions de like/rejeter.
    *   Des animations de `survol` (`hover`) pour les éléments de la liste et les boutons d'action rapide.

### Critères d'Acceptation

*   Le composant `MatchesListScreen` est créé et fonctionnel.
*   Les deux sections ("Vos Matchs" et "Ceux qui vous ont liké") sont clairement présentées.
*   Chaque élément de profil affiche l'avatar et le prénom de l'utilisateur.
*   Les actions rapides `❤️` et `❌` sont implémentées pour la section "Ceux qui vous ont liké".
*   La navigation vers l'écran de chat est fonctionnelle pour les matchs existants.
*   Le design est responsive et conforme à la charte graphique de МойDate.
*   Les animations avec Framer Motion sont intégrées pour une expérience utilisateur fluide.

Ce prompt fournit toutes les informations nécessaires à Codex pour générer l'écran de liste des matchs. Une fois le code généré, il pourra être révisé et intégré au projet.
