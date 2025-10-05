## Prompt Réécrit pour OpenAI Codex : Match Modal de l'Application МойDate

Ce prompt est la sixième étape de notre approche modulaire. Il guide OpenAI Codex pour créer le composant React de la "Match Modal", qui apparaît lorsque deux utilisateurs se "matchent" mutuellement sur l'application МойDate.

### Rôle et Contexte

**Rôle de Codex :** Tu es un Senior Frontend Developer expert en React, TailwindCSS et Framer Motion. Ta mission est de construire une modale de match visuellement impactante et animée, qui célèbre la connexion entre deux utilisateurs.

**Contexte du Projet :** Nous continuons le développement de МойDate, une application de dating responsive. La base du projet (structure, configuration Tailwind), le flux d'authentification, la configuration du profil et l'écran Discover sont déjà en place. Cette étape se concentre sur l'interface utilisateur qui s'affiche immédiatement après un match réussi.

### Instructions Détaillées pour la Match Modal

1.  **Structure Générale :**
    *   Crée un composant React nommé `MatchModal` dans `src/components/match/MatchModal.jsx`.
    *   Ce composant doit être une modale plein écran, superposée au contenu actuel, avec un fond semi-transparent pour focaliser l'attention.
    *   La modale doit s'ouvrir et se fermer avec des animations fluides.

2.  **Contenu Visuel :**
    *   Affiche un message clair et enthousiaste comme "It's a match!" en grand format.
    *   Affiche les photos de profil des deux utilisateurs qui ont matché. Ces photos doivent être animées (par exemple, elles apparaissent en fondu, se rapprochent, ou ont un effet de "pop").
    *   Les photos doivent être bien mises en valeur, potentiellement avec des formes arrondies et des bordures lumineuses.

3.  **Boutons d'Action (CTA) :**
    *   Inclus deux boutons principaux en bas de la modale :
        *   **Bouton Principal :** "Say hello". Ce bouton doit être stylisé avec la couleur primaire (`#E94057`) et, lorsqu'il est cliqué, il doit fermer la modale et naviguer vers l'écran de chat avec l'utilisateur matché.
        *   **Bouton Secondaire :** "Keep swiping". Ce bouton doit être un lien textuel ou un bouton avec un style secondaire. Lorsqu'il est cliqué, il doit simplement fermer la modale et ramener l'utilisateur à l'écran Discover.

4.  **Design et Style (TailwindCSS) :**
    *   Respecte l'identité visuelle définie : couleur primaire `#E94057` pour le CTA principal, fond blanc pour le contenu de la modale, textes noirs et gris.
    *   La modale elle-même doit avoir des `arrondis XL` et des `ombres soft`.
    *   Un effet de `glassmorphism` (flou d'arrière-plan, transparence subtile) peut être appliqué au fond de la modale pour un look moderne.
    *   Le design doit être **responsive et mobile-first**, assurant que la modale s'affiche correctement sur toutes les tailles d'écran.

5.  **Animations (Framer Motion) :**
    *   Utilise Framer Motion pour l'animation d'entrée et de sortie de la modale (par exemple, `scale` et `opacity`).
    *   Anime l'apparition des photos des utilisateurs et du texte "It's a match!".
    *   Les boutons CTA doivent avoir des animations de survol (`hover`) subtiles.

### Critères d'Acceptation

*   Le composant `MatchModal` est créé et s'affiche correctement.
*   Le message "It's a match!" est visible et les photos des deux utilisateurs matchés sont affichées et animées.
*   Les boutons "Say hello" et "Keep swiping" sont présents et stylisés conformément aux spécifications.
*   La modale est responsive et conforme à la charte graphique de МойDate.
*   Les animations avec Framer Motion sont intégrées pour une expérience utilisateur fluide et engageante lors de l'apparition et de la disparition de la modale, ainsi que pour les éléments internes.

Ce prompt fournit toutes les informations nécessaires à Codex pour générer la Match Modal. Une fois le code généré, il pourra être révisé et intégré au projet.
