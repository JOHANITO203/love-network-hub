## Prompt Réécrit pour OpenAI Codex : Écran Paramètres / Mon Profil (Settings / Profile (mine)) de l'Application МойDate

Ce prompt est la dixième étape de notre approche modulaire. Il guide OpenAI Codex pour créer les composants React nécessaires à l'écran des paramètres et de la gestion du profil de l'utilisateur, permettant de visualiser et de modifier ses propres informations, ainsi que de gérer les préférences de l'application.

### Rôle et Contexte

**Rôle de Codex :** Tu es un Senior Frontend Developer expert en React, TailwindCSS et Framer Motion. Ta mission est de construire une interface de gestion de profil et de paramètres complète, sécurisée et intuitive, en respectant les directives de design et les logiques métier.

**Contexte du Projet :** Nous continuons le développement de МойDate, une application de dating responsive. La base du projet (structure, configuration Tailwind) et les écrans précédents sont déjà en place. Cette étape se concentre sur la visualisation et la modification du profil de l'utilisateur, ainsi que la gestion des paramètres de l'application.

### Instructions Détaillées pour l'Écran Paramètres / Mon Profil

1.  **Structure Générale :**
    *   Crée un composant React nommé `SettingsProfileScreen` dans `src/pages/SettingsProfileScreen.jsx`.
    *   Cet écran doit être divisé en plusieurs sections claires : `Mon Profil`, `Préférences de Découverte`, `Notifications`, `Sécurité et Confidentialité`, `Aide et Support`, `Compte`.

2.  **Section "Mon Profil" :**
    *   Affiche les informations du profil de l'utilisateur de manière similaire à l'écran `ProfileDetailScreen`, mais avec des options d'édition.
    *   Permets à l'utilisateur de modifier :
        *   Ses `photos` (ajouter, supprimer, réorganiser, définir la photo principale).
        *   Son `prénom`, `nom` (le nom peut être non modifiable ou modifiable sous certaines conditions).
        *   Sa `bio`.
        *   Ses `intérêts`.
        *   Son `job`.
        *   Son `pays d'origine` et `pays actuel`.
    *   Affiche les `badges` débloqués par l'utilisateur.
    *   Un bouton "Prévisualiser mon profil" pour voir le profil tel qu'il apparaît aux autres utilisateurs.

3.  **Section "Préférences de Découverte" :**
    *   Permets à l'utilisateur de définir ses préférences de recherche :
        *   `Genre` recherché.
        *   `Tranche d'âge` recherchée.
        *   `Distance` maximale (avec un slider).
        *   `Origines` recherchées.
        *   `Intérêts` partagés.
        *   `Toggle` pour activer/désactiver le `intercultural boost`.
    *   Un bouton "Sauvegarder les préférences".

4.  **Section "Notifications" :**
    *   Permets à l'utilisateur de gérer ses préférences de notification :
        *   `Toggle` pour les notifications de `nouveaux matchs`.
        *   `Toggle` pour les notifications de `nouveaux messages`.
        *   `Toggle` pour les notifications du `Social Feed`.
        *   `Toggle` pour les notifications `promotionnelles`.

5.  **Section "Sécurité et Confidentialité" :**
    *   Options pour :
        *   `Changer le mot de passe` (si applicable, ou gérer l'authentification OTP).
        *   `Gérer les appareils connectés`.
        *   `Bloquer/Signaler des utilisateurs` (liste des utilisateurs bloqués).
        *   `Paramètres de visibilité du profil` (par exemple, cacher le profil temporairement).

6.  **Section "Aide et Support" :**
    *   Liens vers la `FAQ`, `Conditions Générales d'Utilisation`, `Politique de Confidentialité`.
    *   Un bouton pour `Contacter le support`.

7.  **Section "Compte" :**
    *   Bouton `Se déconnecter`.
    *   Bouton `Supprimer mon compte` (avec une confirmation).

8.  **Design et Style (TailwindCSS) :**
    *   Respecte l'identité visuelle définie : couleur primaire `#E94057` pour les éléments interactifs et les CTA importants, fond blanc, textes noirs et gris.
    *   Les champs de saisie, toggles et boutons doivent être propres, modernes, avec des `arrondis XL` et des `ombres soft`.
    *   Le design doit être **responsive et mobile-first**, assurant une présentation optimale sur toutes les tailles d'écran.
    *   Utilise des icônes claires pour chaque option de paramètre.

9.  **Animations (Framer Motion) :**
    *   Ajoute des animations subtiles lors de l'ouverture/fermeture des sections ou de la modification des paramètres.
    *   Des animations de `survol` (`hover`) pour les boutons et les éléments interactifs.

### Critères d'Acceptation

*   Le composant `SettingsProfileScreen` est créé et fonctionnel.
*   Toutes les sections spécifiées (`Mon Profil`, `Préférences de Découverte`, `Notifications`, `Sécurité et Confidentialité`, `Aide et Support`, `Compte`) sont implémentées avec leurs options respectives.
*   Les fonctionnalités d'édition du profil sont présentes.
*   Les préférences de découverte sont configurables.
*   Les paramètres de notification sont gérables.
*   Les options de sécurité et de compte sont accessibles.
*   Le design est responsive et conforme à la charte graphique de МойDate.
*   Les animations avec Framer Motion sont intégrées pour une expérience utilisateur fluide.

Ce prompt fournit toutes les informations nécessaires à Codex pour générer l'écran des paramètres et de gestion du profil. Une fois le code généré, il pourra être révisé et intégré au projet.
