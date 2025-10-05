## Prompt Réécrit pour OpenAI Codex : Écran d'Authentification (Sign Up / Auth) de l'Application МойDate

Ce prompt est la deuxième étape de notre approche modulaire. Il guide OpenAI Codex pour créer les composants React nécessaires à l'authentification des utilisateurs par OTP (One-Time Password), soit par téléphone mobile, soit par email.

### Rôle et Contexte

**Rôle de Codex :** Tu es un Senior Frontend Developer expert en React, TailwindCSS et Framer Motion. Ta mission est de construire une interface d'authentification par OTP qui soit sécurisée, intuitive et conforme à l'identité visuelle de l'application.

**Contexte du Projet :** Nous continuons le développement de МойDate, une application de dating responsive. La base du projet (structure, configuration Tailwind) est déjà en place. Cette étape se concentre sur le flux d'inscription et de connexion.

### Instructions Détaillées pour l'Écran de Sign Up / Auth

1.  **Structure des Composants :**
    *   Crée une page principale `src/pages/AuthScreen.jsx`.
    *   Cette page gérera la logique pour afficher soit le formulaire de saisie du contact (email/téléphone), soit le formulaire de vérification de l'OTP.
    *   Crée un composant `src/components/auth/OtpInput.jsx` pour le champ de saisie du code à 4 chiffres.

2.  **Flux d'Authentification - Étape 1 : Saisie du Contact**
    *   L'utilisateur doit pouvoir choisir entre une authentification par **téléphone mobile** ou par **email** (par exemple, via des onglets ou des boutons radio).
    *   **Pour le mobile :** Affiche un champ de saisie pour le numéro de téléphone, précédé d'un sélecteur de pays avec drapeau et indicatif. La liste des pays doit être complète.
    *   **Pour l'email :** Affiche un champ de saisie standard pour l'adresse email.
    *   Un bouton CTA principal (ex: "Continuer") doit soumettre le formulaire pour envoyer l'OTP. La logique d'envoi réelle sera simulée pour l'instant.

3.  **Flux d'Authentification - Étape 2 : Vérification de l'OTP**
    *   Après la soumission, l'interface doit passer à un nouvel état pour la saisie de l'OTP.
    *   Utilise le composant `OtpInput.jsx` pour afficher **4 champs de saisie distincts** pour le code.
    *   Implémente une logique d'**auto-focus** : lorsque l'utilisateur saisit un chiffre, le focus doit automatiquement passer au champ suivant.
    *   Affiche un message indiquant à l'utilisateur de vérifier ses messages ou ses emails (ex: "Nous avons envoyé un code à {email/numéro}").
    *   Inclus un lien ou un bouton **"Renvoyer le code"** (`Resend`) qui ne devient cliquable qu'après un certain délai (par exemple, 60 secondes).

4.  **Design et Style (TailwindCSS) :**
    *   Respecte l'identité visuelle définie : couleur primaire `#E94057` pour les CTA et les éléments actifs, fond blanc, textes noirs et gris.
    *   Les champs de saisie doivent être propres, modernes, avec des coins bien arrondis (`rounded-xl`) et des ombres douces (`shadow-lg`).
    *   Le design doit rester **responsive et mobile-first**.
    *   Sur desktop, le formulaire doit être contenu dans une modale ou un conteneur centré avec une largeur maximale de `560px`.

5.  **Animations (Framer Motion) :**
    *   Ajoute une transition animée (par exemple, un `slide` ou un `fade`) lors du passage entre l'étape de saisie du contact et l'étape de vérification de l'OTP.

### Critères d'Acceptation

*   La page `AuthScreen.jsx` est créée et gère les deux états du flux (saisie contact / vérification OTP).
*   L'utilisateur peut choisir entre l'authentification par email et par téléphone.
*   Le champ de téléphone inclut un sélecteur de pays fonctionnel (la liste peut être un mock pour l'instant).
*   Le composant `OtpInput.jsx` pour le code à 4 chiffres est fonctionnel, avec une logique d'auto-focus.
*   La fonctionnalité "Renvoyer le code" est présente avec un minuteur.
*   Le design est responsive et conforme à la charte graphique de МойDate.
*   Les transitions entre les étapes sont animées avec Framer Motion.

Une fois cette étape validée, nous aurons un flux d'authentification fonctionnel, prêt à être connecté à un backend.
