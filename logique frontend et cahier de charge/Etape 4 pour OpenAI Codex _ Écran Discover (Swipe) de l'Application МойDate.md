## Prompt Réécrit pour OpenAI Codex : Écran Discover (Swipe) de l'Application МойDate

Ce prompt est la quatrième étape de notre approche modulaire. Il guide OpenAI Codex pour créer les composants React nécessaires à l'écran principal de découverte par "swipe", intégrant les spécifications fonctionnelles et visuelles définies pour l'application МойDate.

### Rôle et Contexte

**Rôle de Codex :** Tu es un Senior Frontend Developer expert en React, TailwindCSS et Framer Motion. Ta mission est de construire une interface de découverte par swipe intuitive, fluide et visuellement engageante, en respectant les directives de design et les logiques métier.

**Contexte du Projet :** Nous continuons le développement de МойDate, une application de dating responsive. La base du projet (structure, configuration Tailwind), le flux d'authentification et la configuration du profil sont déjà en place. Cette étape se concentre sur l'affichage des profils à "swiper" et les interactions associées.

### Instructions Détaillées pour l'Écran Discover (Swipe)

1.  **Structure Générale :**
    *   Crée un composant React nommé `DiscoverScreen` dans `src/pages/DiscoverScreen.jsx`.
    *   Ce composant doit afficher une "carte" de profil (`SwipeCard`) au centre de l'écran, permettant à l'utilisateur d'interagir avec.
    *   Un mécanisme pour charger dynamiquement les profils suivants doit être prévu (par exemple, en utilisant un hook `useSwipeProfiles`).

2.  **Composant `SwipeCard` :**
    *   Crée un composant `src/components/discover/SwipeCard.jsx`.
    *   Chaque `SwipeCard` doit afficher les informations suivantes du profil : `photo principale`, `prénom`, `âge`, `job`, `signe astrologique`, `drapeaux` (pays d'origine et pays actuel), et les `badges visibles` (par exemple, `Verified`, `Intercultural`).
    *   Les photos secondaires du profil doivent être accessibles via des `dots verticaux` sur le côté de la carte, permettant de changer l'image principale affichée.
    *   Le design de la carte doit être moderne, avec des `arrondis XL` et des `ombres soft`.

3.  **Actions de Swipe et Boutons :**
    *   Implémente la fonctionnalité de `swipe` : `❌` (gauche pour rejeter), `❤️` (droite pour aimer), `⭐` (superlike).
    *   Ces actions doivent être réalisables par `drag` sur mobile et desktop.
    *   Sur desktop, des `raccourcis clavier` doivent être implémentés : `←` (gauche), `→` (droite), `↑` (superlike), `entrée` (like).
    *   Affiche des boutons visuels pour ces actions sous la `SwipeCard`.

4.  **Filtres de Recherche :**
    *   Un mécanisme pour accéder aux filtres de recherche doit être présent (par exemple, une icône de filtre en haut de l'écran).
    *   Les filtres doivent inclure : `genre`, `distance`, `âge`, `origines`, `intérêts`, `langues`.
    *   Un `toggle` pour activer le `intercultural boost` doit être disponible.
    *   L'interface des filtres doit être claire et facile à utiliser.

5.  **Design et Style (TailwindCSS) :**
    *   Respecte l'identité visuelle définie : couleur primaire `#E94057` pour les éléments interactifs (boutons de like, superlike), fond blanc, textes noirs et gris.
    *   Le design doit être **responsive et mobile-first**.
    *   Les cartes de profil doivent être centrées et occuper une part significative de l'écran, s'adaptant à la taille du viewport.

6.  **Animations (Framer Motion) :**
    *   Implémente des animations fluides pour les actions de `swipe` (déplacement de la carte hors de l'écran).
    *   Des animations de `transition` lors du changement de photo sur la `SwipeCard`.
    *   Des animations de `survol` (`hover`) pour les boutons d'action et l'icône de filtre.

### Critères d'Acceptation

*   Le composant `DiscoverScreen` est créé et affiche les profils à swiper.
*   Le composant `SwipeCard` est fonctionnel, affichant toutes les informations requises (photo principale, prénom, âge, job, signe astro, drapeaux, badges).
*   La navigation entre les photos du profil via les `dots verticaux` est implémentée.
*   Les actions de `swipe` (gauche, droite, superlike) sont fonctionnelles via `drag` et `raccourcis clavier`.
*   L'interface des filtres est accessible et contient tous les filtres spécifiés, y compris le `toggle intercultural boost`.
*   Le design est responsive et conforme à la charte graphique de МойDate.
*   Les animations avec Framer Motion sont intégrées pour une expérience utilisateur fluide et engageante.

Ce prompt fournit toutes les informations nécessaires à Codex pour générer l'écran Discover (Swipe). Une fois le code généré, il pourra être révisé et intégré au projet.
