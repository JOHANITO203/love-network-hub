## Prompt Réécrit pour OpenAI Codex : Écran d'Onboarding de l'Application МойDate

Ce prompt est conçu pour guider OpenAI Codex dans la génération du code React (avec TailwindCSS et Framer Motion) pour l'écran d'Onboarding de l'application МойDate. Il intègre les spécifications visuelles et fonctionnelles détaillées du cahier des charges original, en suivant une approche modulaire et itérative.

### Rôle et Contexte

**Rôle de Codex :** Tu es un Senior Frontend Developer expert en React, TailwindCSS et Framer Motion. Ta mission est d'implémenter l'écran d'Onboarding en respectant scrupuleusement les directives de design et d'interaction.

**Contexte du Projet :** L'application МойDate est une plateforme de dating qui combine des fonctionnalités de rencontre, de storytelling façon télé-réalité et de gamification sociale. Le frontend est développé avec React (Vite), TailwindCSS et Framer Motion, en adoptant une approche responsive et mobile-first. Les couleurs et les styles de base ont déjà été configurés dans le projet.

### Instructions Détaillées pour l'Écran d'Onboarding

1.  **Structure Générale :**
    *   Crée un composant React nommé `OnboardingScreen` dans `src/pages/OnboardingScreen.jsx`.
    *   Ce composant doit gérer l'affichage de trois slides distinctes : "Algorithm", "Matches", et "Premium".
    *   Utilise un mécanisme de navigation (par exemple, des points indicateurs ou des flèches) pour permettre à l'utilisateur de passer d'une slide à l'autre.

2.  **Contenu de Chaque Slide :**
    *   Chaque slide doit inclure un titre, une description et une image illustrative (pour l'instant, utilise des placeholders pour les images).
    *   **Slide "Algorithm" :**
        *   Titre : "Matches intelligents"
        *   Description : "Vous likez, vous matchez, vous vivez. Le reste, c’est juste du bonus."
        *   Narratif Algo (à afficher clairement) : “Real People. Real Drama. Sur МойDate, même l’algo a de la répartie.”
    *   **Slide "Matches" :** Décris la logique de matching.
    *   **Slide "Premium" :** Décris les avantages de l'abonnement premium.

3.  **Design et Style (TailwindCSS) :**
    *   **Identité Visuelle :**
        *   Couleur primaire : Rouge vif (`#E94057`).
        *   Fond : Blanc (`#FFFFFF`) avec des dégradés subtils rose/violet.
        *   Textes : Noir (`#111`) pour le principal, gris (`#666`) pour le secondaire, gris clair (`#9AA0A6`) pour les métadonnées.
        *   Typographie : `font-sans` (pour Inter / SF Pro).
        *   Style : Flat moderne avec arrondis XL (`rounded-xl`), ombres soft (`shadow-lg`) et un effet de glassmorphism sur les modales (si applicable, pour l'instant pas de modale sur l'onboarding).
    *   **Responsive et Mobile-First :** Le design doit être optimisé pour les appareils mobiles par défaut et s'adapter aux écrans plus larges.
    *   **Desktop :** Pour les écrans de bureau, l'écran d'onboarding doit apparaître dans une modale centrée avec une largeur maximale de `560px`.

4.  **Animations (Framer Motion) :**
    *   Implémente des transitions fluides entre les slides utilisant Framer Motion (par exemple, des animations de `slide` ou de `fade`).
    *   Les CTA doivent avoir des animations de survol (`hover`) subtiles.

5.  **Boutons d'Action (CTA) :**
    *   En bas de l'écran, inclus deux boutons :
        *   **Bouton Principal :** "Create an account". Ce bouton doit être stylisé avec la couleur primaire (`#E94057`) et être bien visible.
        *   **Lien Secondaire :** "Sign in". Ce doit être un lien textuel simple.

### Critères d'Acceptation

*   Le composant `OnboardingScreen` est créé et fonctionnel.
*   Les trois slides (Algorithm, Matches, Premium) sont implémentées avec leur contenu textuel et des placeholders pour les images.
*   La navigation entre les slides est fluide et animée avec Framer Motion.
*   Les boutons "Create an account" et "Sign in" sont présents et stylisés conformément aux spécifications.
*   Le design est responsive et s'adapte correctement aux écrans mobiles et desktop (modale centrée pour desktop).
*   Les couleurs, typographies et styles (arrondis XL, ombres soft) sont appliqués via TailwindCSS.

Ce prompt fournit toutes les informations nécessaires à Codex pour générer l'écran d'Onboarding de manière autonome. Une fois le code généré, il pourra être révisé et intégré au projet.
