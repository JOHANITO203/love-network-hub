## Prompt Réécrit pour OpenAI Codex : Écran de Détail du Profil (Profile Detail) de l'Application МойDate

Ce prompt est la cinquième étape de notre approche modulaire. Il guide OpenAI Codex pour créer les composants React nécessaires à l'affichage détaillé du profil d'un utilisateur (autre que le sien), intégrant les spécifications fonctionnelles et visuelles définies pour l'application МойDate.

### Rôle et Contexte

**Rôle de Codex :** Tu es un Senior Frontend Developer expert en React, TailwindCSS et Framer Motion. Ta mission est de construire une interface de visualisation de profil détaillée, intuitive et visuellement attrayante, en respectant les directives de design et les logiques métier.

**Contexte du Projet :** Nous continuons le développement de МойDate, une application de dating responsive. La base du projet (structure, configuration Tailwind), le flux d'authentification, la configuration du profil et l'écran Discover sont déjà en place. Cette étape se concentre sur l'affichage complet des informations d'un profil après un potentiel match ou une consultation depuis l'écran Discover.

### Instructions Détaillées pour l'Écran de Détail du Profil

1.  **Structure Générale :**
    *   Crée un composant React nommé `ProfileDetailScreen` dans `src/pages/ProfileDetailScreen.jsx`.
    *   Ce composant doit afficher toutes les informations détaillées d'un profil utilisateur.

2.  **Section "Hero" (Haut de Page) :**
    *   Affiche une `Hero photo` (la photo principale du profil) en grand format, occupant la majeure partie de la largeur de l'écran.
    *   Intègre des `actions` (par exemple, un bouton de retour, un bouton de signalement/blocage, un bouton pour initier un chat si match) superposées à la photo ou dans une barre d'en-tête transparente.

3.  **Informations du Profil :**
    *   Sous la photo, affiche clairement les informations suivantes :
        *   `Prénom`
        *   `Âge`
        *   `Job`
        *   `Badge Astro` (signe astrologique, calculé à partir de la date de naissance)
        *   `Drapeaux` (pays d'origine et pays actuel)
        *   `Chip Diaspora` (si le pays d'origine est différent du pays actuel)
    *   Affiche la `Bio` de l'utilisateur.
    *   Affiche la liste des `Intérêts` (sous forme de tags avec icônes, comme configuré lors de la création du profil).
    *   Affiche une `Galerie photo` des photos secondaires de l'utilisateur, permettant de les visualiser en grand format.
    *   Affiche les `Badges` débloqués par l'utilisateur (par exemple, `Vérifié`, `Intercultural`, `Couple Officiel`, `Superlikes Gemmes`, `Report`, etc.). Ces badges doivent être visuellement distincts et clairs.

4.  **Design et Style (TailwindCSS) :**
    *   Respecte l'identité visuelle définie : couleur primaire `#E94057` pour les éléments interactifs, fond blanc, textes noirs et gris.
    *   Les sections du profil doivent être bien espacées et lisibles.
    *   Les éléments visuels (photos, badges) doivent utiliser des `arrondis XL` et des `ombres soft`.
    *   Le design doit être **responsive et mobile-first**. L'agencement des informations doit s'adapter fluidement aux différentes tailles d'écran.

5.  **Animations (Framer Motion) :**
    *   Ajoute des animations subtiles lors du chargement de l'écran ou de l'apparition des informations.
    *   Des animations de `survol` (`hover`) pour les boutons d'action et les photos de la galerie.
    *   Des transitions fluides lors de l'ouverture de la galerie photo.

### Critères d'Acceptation

*   Le composant `ProfileDetailScreen` est créé et affiche un profil complet.
*   La `Hero photo` est affichée avec les actions superposées ou en en-tête.
*   Toutes les informations spécifiées (`prénom`, `âge`, `job`, `badge astro`, `drapeaux`, `chip diaspora`, `bio`, `intérêts`, `galerie photo`, `badges`) sont correctement affichées.
*   Le design est responsive et conforme à la charte graphique de МойDate.
*   Les animations avec Framer Motion sont intégrées pour une expérience utilisateur fluide.

Ce prompt fournit toutes les informations nécessaires à Codex pour générer l'écran de détail du profil. Une fois le code généré, il pourra être révisé et intégré au projet.
