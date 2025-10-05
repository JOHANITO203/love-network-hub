## Prompt Réécrit pour OpenAI Codex : Écran de Messagerie / Chat de l'Application МойDate

Ce prompt est la huitième étape de notre approche modulaire. Il guide OpenAI Codex pour créer les composants React nécessaires à l'écran de messagerie et de chat, permettant aux utilisateurs de communiquer avec leurs matchs, avec une attention particulière aux fonctionnalités de sécurité et à l'expérience utilisateur.

### Rôle et Contexte

**Rôle de Codex :** Tu es un Senior Frontend Developer expert en React, TailwindCSS et Framer Motion. Ta mission est de construire une interface de messagerie complète, intuitive et sécurisée, en respectant les directives de design et les logiques métier.

**Contexte du Projet :** Nous continuons le développement de МойDate, une application de dating responsive. La base du projet (structure, configuration Tailwind), le flux d'authentification, la configuration du profil, l'écran Discover, la Match Modal et la Matches List sont déjà en place. Cette étape se concentre sur la communication directe entre les utilisateurs.

### Instructions Détaillées pour l'Écran de Messagerie / Chat

1.  **Structure Générale :**
    *   Crée un composant React nommé `MessagesChatScreen` dans `src/pages/MessagesChatScreen.jsx`.
    *   Ce composant doit gérer deux vues principales : la liste des conversations et la vue détaillée d'une conversation.

2.  **Vue "Liste des Conversations" :**
    *   Affiche une liste des conversations actives de l'utilisateur.
    *   Chaque élément de la liste doit inclure :
        *   L'`avatar` du correspondant.
        *   Un `aperçu` du dernier message échangé.
        *   Le `statut` en ligne/hors ligne du correspondant (si disponible, utilise un indicateur visuel simple).
        *   Un indicateur pour les messages `non-lus`.
    *   Les conversations doivent être triées par date du dernier message.
    *   Cliquer sur un élément de la liste doit naviguer vers la vue détaillée de cette conversation.

3.  **Vue "Détail du Chat" :**
    *   Affiche l'historique des messages pour une conversation spécifique.
    *   Les messages doivent être présentés sous forme de `bulles` (distinguant les messages envoyés par l'utilisateur et ceux reçus).
    *   Chaque message doit inclure un `horodatage` (heure d'envoi/réception).
    *   **Zone de Saisie de Message (`Input`) :**
        *   Un champ de texte pour taper les messages.
        *   Un bouton pour envoyer des `emojis`.
        *   Un bouton pour `joindre des fichiers` (images, vidéos - la logique d'upload sera simulée pour l'instant).
        *   Un bouton pour envoyer des `messages audio` (la fonctionnalité d'enregistrement sera simulée).
    *   **Disclaimer de Sécurité :**
        *   Implémente une logique de `détection de mots-clés` (par exemple, "WhatsApp", "Telegram", "Insta", numéros de téléphone) dans les messages envoyés.
        *   Si un mot-clé est détecté, affiche automatiquement une `bannière de sécurité` (`DisclaimerBanner`) en haut de la conversation, avertissant l'utilisateur des risques de partager des informations hors plateforme.
        *   Le composant `DisclaimerBanner` doit être créé dans `src/components/chat/DisclaimerBanner.jsx`.

4.  **Design et Style (TailwindCSS) :**
    *   Respecte l'identité visuelle définie : couleur primaire `#E94057` pour les éléments interactifs (bouton d'envoi, icônes), fond blanc, textes noirs et gris.
    *   Les avatars doivent être circulaires.
    *   Les bulles de message doivent avoir des `arrondis XL` et des `ombres soft`.
    *   La zone de saisie de message doit être stylisée de manière moderne et fonctionnelle.
    *   Le `DisclaimerBanner` doit être visuellement distinct, par exemple avec un fond de couleur d'avertissement et une icône.
    *   Le design doit être **responsive et mobile-first**, assurant une présentation optimale sur toutes les tailles d'écran.

5.  **Animations (Framer Motion) :**
    *   Ajoute des animations subtiles lors du chargement des messages ou de l'envoi d'un nouveau message (par exemple, les bulles de message apparaissent avec un léger `fade` ou `slide`).
    *   Anime l'apparition du `DisclaimerBanner`.
    *   Des animations de `survol` (`hover`) pour les boutons et icônes de la zone de saisie.

### Critères d'Acceptation

*   Le composant `MessagesChatScreen` est créé et gère les vues liste et détail.
*   La liste des conversations affiche les avatars, aperçus, statuts et indicateurs de non-lus.
*   La vue détaillée du chat affiche les messages sous forme de bulles avec horodatage.
*   La zone de saisie de message inclut les fonctionnalités de texte, emoji, pièce jointe et audio (simulées).
*   Le `DisclaimerBanner` est implémenté et s'affiche lors de la détection de mots-clés spécifiques.
*   Le design est responsive et conforme à la charte graphique de МойDate.
*   Les animations avec Framer Motion sont intégrées pour une expérience utilisateur fluide.

Ce prompt fournit toutes les informations nécessaires à Codex pour générer l'écran de messagerie et de chat. Une fois le code généré, il pourra être révisé et intégré au projet.
