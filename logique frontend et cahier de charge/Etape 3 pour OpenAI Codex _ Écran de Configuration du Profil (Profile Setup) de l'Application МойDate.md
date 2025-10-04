## Prompt Réécrit pour OpenAI Codex : Écran de Configuration du Profil (Profile Setup) de l'Application МойDate

Ce prompt est la troisième étape de notre approche modulaire. Il guide OpenAI Codex pour créer les composants React nécessaires à la configuration complète du profil utilisateur, en intégrant les spécifications fonctionnelles et visuelles définies.

### Rôle et Contexte

**Rôle de Codex :** Tu es un Senior Frontend Developer expert en React, TailwindCSS et Framer Motion. Ta mission est de construire une interface de configuration de profil intuitive et visuellement attrayante, en respectant les directives de design et les logiques métier.

**Contexte du Projet :** Nous continuons le développement de МойDate, une application de dating responsive. La base du projet (structure, configuration Tailwind) et le flux d'authentification sont déjà en place. Cette étape se concentre sur la collecte des informations détaillées du profil utilisateur.

### Instructions Détaillées pour l'Écran de Profile Setup

1.  **Structure Générale :**
    *   Crée un composant React nommé `ProfileSetupScreen` dans `src/pages/ProfileSetupScreen.jsx`.
    *   Ce composant doit organiser les différentes sections de saisie d'informations de manière claire et progressive, potentiellement sous forme d'étapes ou de sections déroulantes.

2.  **Champs de Saisie et Fonctionnalités :**
    *   **Upload de Photos :**
        *   Implémente une zone d'upload permettant à l'utilisateur d'ajouter entre 1 et 9 photos. Affiche des aperçus des photos téléchargées et des emplacements vides pour les photos restantes.
        *   Permets la réorganisation et la suppression des photos.
    *   **Informations Personnelles :**
        *   Champs pour `Prénom` et `Nom`.
        *   Champ pour `Date de naissance` (DOB) : Utilise un sélecteur de date. À partir de cette date, calcule et affiche l'âge de l'utilisateur ainsi que son signe astrologique. Ces informations (âge et signe astro) devront être affichées sur le profil et dans l'écran Discover.
    *   **Genre :** Un groupe de boutons radio ou un sélecteur pour `Homme`, `Femme`, `Autre`.
    *   **Orientation Sexuelle :** Un sélecteur pour l'orientation sexuelle. Cette information doit être marquée comme `privée` (non visible pour les autres utilisateurs) et sera utilisée uniquement pour l'algorithme de matching.
    *   **Intérêts :** Un champ de saisie avec auto-complétion ou une liste de tags pré-définis avec des icônes. L'utilisateur doit pouvoir sélectionner plusieurs intérêts.
    *   **Localisation et Origine :**
        *   Champ pour `Pays d'origine` : Utilise une liste complète de pays avec un affichage de drapeau (basé sur le code ISO2). Un composant `CountrySelector` pourrait être utile.
        *   Champ pour `Pays actuel` : Similaire au pays d'origine.
        *   Si le `Pays d'origine` est différent du `Pays actuel`, un "chip" `Diaspora` doit être calculé et affiché (par exemple, sur le profil ou la carte Discover).
    *   **Accès aux Contacts :** Un bouton ou un toggle pour demander l'accès aux contacts de l'utilisateur. Un bouton `Skip` doit être disponible.
    *   **Notifications :** Un bouton ou un toggle pour activer les notifications. Un bouton `Skip` doit être disponible.

3.  **Design et Style (TailwindCSS) :**
    *   Respecte l'identité visuelle définie : couleur primaire `#E94057` pour les CTA et les éléments actifs, fond blanc, textes noirs et gris.
    *   Les champs de saisie, boutons et sélecteurs doivent être propres, modernes, avec des coins bien arrondis (`rounded-xl`) et des ombres douces (`shadow-lg`).
    *   Le design doit être **responsive et mobile-first**.
    *   Sur desktop, le formulaire doit être contenu dans une modale ou un conteneur centré avec une largeur maximale de `560px`.

4.  **Animations (Framer Motion) :**
    *   Ajoute des animations subtiles pour les transitions entre les sections du formulaire ou lors de l'ajout/suppression de photos.
    *   Les éléments interactifs (boutons, tags d'intérêts) doivent avoir des animations de survol (`hover`).

5.  **Bouton de Soumission :**
    *   Un bouton principal "Enregistrer le profil" ou "Terminer" doit être présent en bas de l'écran, stylisé avec la couleur primaire.

### Critères d'Acceptation

*   Le composant `ProfileSetupScreen` est créé et fonctionnel.
*   La fonctionnalité d'upload de photos (1-9) avec aperçus est implémentée.
*   Les champs `Prénom`, `Nom`, `Date de naissance` sont présents. L'âge et le signe astrologique sont calculés et affichés.
*   Les sélecteurs pour `Genre` et `Orientation sexuelle` sont fonctionnels, avec l'orientation marquée comme privée.
*   La sélection d'intérêts est implémentée (tags avec icônes).
*   Les sélecteurs de `Pays d'origine` et `Pays actuel` avec drapeaux sont fonctionnels. Le "chip" `Diaspora` est calculé si nécessaire.
*   Les options pour l'accès aux contacts et aux notifications sont présentes avec la possibilité de passer.
*   Le design est responsive et conforme à la charte graphique de МойDate.
*   Les animations avec Framer Motion sont intégrées pour une expérience utilisateur fluide.

Ce prompt fournit toutes les informations nécessaires à Codex pour générer l'écran de configuration du profil. Une fois le code généré, il pourra être révisé et intégré au projet.
