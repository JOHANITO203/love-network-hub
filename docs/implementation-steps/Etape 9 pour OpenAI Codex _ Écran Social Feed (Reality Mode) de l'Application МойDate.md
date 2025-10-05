## Prompt Réécrit pour OpenAI Codex : Écran Social Feed (Reality Mode) de l'Application МойDate

Ce prompt est la neuvième étape de notre approche modulaire. Il guide OpenAI Codex pour créer les composants React nécessaires à l'écran du "Social Feed" (ou "Reality Mode"), qui présente une narration dynamique et gamifiée de l'expérience utilisateur sur МойDate.

### Rôle et Contexte

**Rôle de Codex :** Tu es un Senior Frontend Developer expert en React, TailwindCSS et Framer Motion. Ta mission est de construire une interface de fil d'actualité social engageante, visuellement riche et animée, qui met en scène les événements clés de l'application avec un ton sarcastique.

**Contexte du Projet :** Nous continuons le développement de МойDate, une application de dating responsive. La base du projet (structure, configuration Tailwind), le flux d'authentification, la configuration du profil, l'écran Discover, la Match Modal, la Matches List et l'écran de Messagerie sont déjà en place. Cette étape se concentre sur la création d'un fil d'actualité unique, inspiré de la télé-réalité.

### Instructions Détaillées pour l'Écran Social Feed (Reality Mode)

1.  **Structure Générale :**
    *   Crée un composant React nommé `SocialFeedScreen` dans `src/pages/SocialFeedScreen.jsx`.
    *   Ce composant doit afficher une liste de posts dans un fil défilant verticalement.
    *   Chaque post doit être un composant `FeedPost` distinct.

2.  **Types de Posts :**
    Le feed doit être capable d'afficher plusieurs types de posts, chacun avec une mise en page et un contenu spécifique :
    *   **🔥 Nouveaux matchs confirmés :** Affiche les avatars des deux utilisateurs qui ont matché, avec un message de célébration.
    *   **💍 Couples officiels :** Affiche les photos des utilisateurs qui ont atteint le statut de "Couple Officiel" (basé sur un questionnaire concordant, pour l'instant, simule cette condition). Un message félicitant le couple.
    *   **🏆 Badges débloqués :** Affiche le badge débloqué par un utilisateur, avec son avatar et un message d'annonce.
    *   **🎬 Stories (vidéo 45s ou photo + caption user) :** Affiche une vignette de story (vidéo ou photo) avec une légende (`caption`) de l'utilisateur. Au clic, une modale `StoryViewer` doit s'ouvrir pour afficher la story en plein écran.
    *   **😂 Posts sarcastiques générés par l’algo :** Ces posts sont le cœur du "Reality Mode". Ils doivent utiliser les templates définis dans `src/data/feedTemplates.js` (précédemment intégré). L'algorithme (simulé pour le frontend) ajoute un `overlay sarcastique` sur ces posts. Ces posts peuvent être de type `spotlight solo`, `binôme`, `collectif`, `astro`, etc.

3.  **Interactions sur les Posts :**
    *   Chaque post doit inclure des boutons ou icônes pour `Like` et `Commentaire`.
    *   Un clic sur l'avatar ou le nom d'utilisateur doit permettre de `voir le profil` de l'utilisateur concerné.

4.  **Intégration des Templates Sarcastiques :**
    *   Le composant `SocialFeedScreen` doit importer et utiliser les templates de posts sarcastiques depuis `src/data/feedTemplates.js`.
    *   Lors de l'affichage d'un post sarcastique, sélectionne un template aléatoire et injecte les données dynamiques (par exemple, `{username}`, `{age}`, `{sign}`, `{like_count}`) pour générer le message final. Les données dynamiques seront des mocks pour l'instant.
    *   L'"overlay sarcastique" doit être un élément visuel (par exemple, une bulle de texte stylisée) superposé au post, affichant le commentaire sarcastique généré par l'algo.

5.  **Design et Style (TailwindCSS) :**
    *   Respecte l'identité visuelle définie : couleur primaire `#E94057` pour les éléments interactifs, fond blanc, textes noirs et gris.
    *   Les posts doivent avoir des `arrondis XL` et des `ombres soft`.
    *   Les avatars doivent être circulaires.
    *   Le `overlay sarcastique` doit être visuellement distinct, avec une typographie et un style qui reflètent le ton humoristique/sarcastique.
    *   Le design doit être **responsive et mobile-first**, assurant une présentation optimale des posts sur toutes les tailles d'écran.

6.  **Animations (Framer Motion) :**
    *   Ajoute des animations fluides lors du défilement du feed (par exemple, les nouveaux posts apparaissent avec un léger `fade-in` ou `slide-up`).
    *   Anime l'apparition des `overlays sarcastiques`.
    *   Des animations de `survol` (`hover`) pour les boutons d'interaction (Like, Commentaire) et les vignettes de story.

### Critères d'Acceptation

*   Le composant `SocialFeedScreen` est créé et affiche un fil d'actualité dynamique.
*   Les différents types de posts (matchs, couples, badges, stories, posts sarcastiques) sont implémentés et affichés correctement.
*   Les posts sarcastiques utilisent les templates de `feedTemplates.js` et intègrent des données dynamiques (mocks).
*   Les `overlays sarcastiques` sont affichés sur les posts correspondants.
*   Les interactions `Like`, `Commentaire` et `Voir profil` sont présentes.
*   Le design est responsive et conforme à la charte graphique de МойDate.
*   Les animations avec Framer Motion sont intégrées pour une expérience utilisateur fluide et engageante.

Ce prompt fournit toutes les informations nécessaires à Codex pour générer l'écran Social Feed (Reality Mode). Une fois le code généré, il pourra être révisé et intégré au projet.
