## Prompt Réécrit pour OpenAI Codex : Initialisation du Projet МойDate et Intégration des Templates Sarcastiques

Ce prompt est conçu pour guider OpenAI Codex dans l'initialisation du projet frontend de l'application МойDate et l'intégration des templates de posts sarcastiques. Il suit les principes d'ingénierie des prompts (`Tell It`, `Describe It`, `Show It`) pour fournir un contexte clair et des instructions précises, permettant à Codex de générer un code pertinent et fonctionnel pour cette première étape.

### Rôle et Contexte

**Rôle de Codex :** Tu es un Senior Frontend Developer expert en React, TailwindCSS et Framer Motion. Ta mission est de mettre en place la structure de base du projet et d'intégrer les données initiales.

**Contexte du Projet :** L'application МойDate est une plateforme de dating innovante qui combine des fonctionnalités de rencontre, de storytelling façon télé-réalité et de gamification sociale. Le frontend sera développé avec React (Vite), TailwindCSS et Framer Motion, en adoptant une approche responsive et mobile-first.

### Instructions Détaillées

1.  **Initialisation du Projet :**
    *   Crée un nouveau projet React en utilisant Vite.
    *   Configure TailwindCSS pour qu'il soit fonctionnel dans le projet. Inclus les couleurs suivantes dans la configuration de Tailwind :
        *   `primary: '#E94057'` (Rouge vif)
        *   `background-light: '#FFFFFF'` (Blanc)
        *   `text-dark: '#111'` (Noir)
        *   `text-secondary: '#666'` (Gris)
        *   `text-meta: '#9AA0A6'` (Gris clair)
    *   Configure également des `borderRadius` de type `xl` pour les éléments arrondis.
    *   Crée une structure de dossiers de base pour organiser le code, incluant au minimum :
        *   `src/components`
        *   `src/pages`
        *   `src/hooks`
        *   `src/utils`
        *   `src/assets`
    *   Assure-toi que le fichier `tailwind.config.js` est correctement configuré et que le fichier `index.css` (ou équivalent) contient les directives `@tailwind` nécessaires.

2.  **Gestion de l'Internationalisation (i18n) :**
    *   Crée un fichier `src/utils/i18n.js` qui initialise une configuration de base pour la gestion multilingue. Les langues supportées sont le français (FR), l'anglais (EN), le portugais (PT) et le russe (RU). Pour l'instant, il n'est pas nécessaire d'implémenter la logique de traduction, juste la structure de base pour les futures intégrations.

3.  **Intégration des Templates Sarcastiques :**
    *   Crée un fichier `src/data/feedTemplates.js` (ou `.json` si tu préfères, mais `.js` est plus flexible pour l'importation directe dans React) qui exporte un tableau JavaScript contenant les templates de posts sarcastiques. Ce tableau doit être exactement le contenu du fichier JSON fourni ci-dessous.

### Contenu du Fichier `moydate_feed_templates.json` à Intégrer

```json
[
  {
    "id": 1,
    "type": "serial_swiper",
    "template": "🔥 {username}, {age} ans, {sign} a déjà swipé {like_count} fois cette semaine. Quelqu’un veut bien lui éviter la tendinite ? 😅"
  },
  {
    "id": 2,
    "type": "type_hunter",
    "template": "👀 {username} ne like QUE les {target_age} ans de {target_origin}… obsession ou destin ? 😏"
  },
  {
    "id": 3,
    "type": "fan_club",
    "template": "⭐ {username} ({sign}) récolte {like_count} likes cette semaine. Bientôt il/elle ouvre un fan club officiel 😎"
  },
  {
    "id": 4,
    "type": "romantic_stalker",
    "template": "💘 {username} a liké {target_user} {repeat_count} fois. Persévérance ou déclaration d’amour ? 😂"
  },
  {
    "id": 5,
    "type": "astro_fun",
    "template": "♏ Scorpions cette semaine : ils likent tout ce qui bouge. Courage aux Lions ♌ !"
  },
  {
    "id": 6,
    "type": "binome_drama",
    "template": "🎬 {userA} + {userB}… ils s’écrivent plus que les scénaristes de Netflix. Un couple en préparation ? 👀"
  },
  {
    "id": 7,
    "type": "intercultural",
    "template": "🌍 Nouveau match ! {userA} {flagA} + {userB} {flagB}. Ça sent les débats pimentés 🌶️ et les câlins glacés ❄️"
  },
  {
    "id": 8,
    "type": "story_overlay",
    "template": "{username} poste: \'{caption}\'. Narrateur: \'Elle veut l’amour… ou juste un cappuccino gratuit ? ☕😂\'"
  },
  {
    "id": 9,
    "type": "no_match_yet",
    "template": "Camila, 23 ans ♎︎… 72 likes ce week-end et toujours pas de match. Quelqu’un veut la sauver ? 😂"
  },
  {
    "id": 10,
    "type": "swipe_hater",
    "template": "Bred, 25 ans… il swipe à gauche plus vite qu’un banquier devant une facture 🤣"
  },
  {
    "id": 11,
    "type": "binome_netflix",
    "template": "Jessica ♌︎ + Ivan ♑︎ … on dirait la saison 2 d’un drama Netflix 💕🔥."
  },
  {
    "id": 12,
    "type": "collectif_astro",
    "template": "Les Scorpions ♏︎ cette semaine ont décidé d’aimer TOUT le monde 😏. Les Lions ♌︎, préparez vos cœurs !"
  },
  {
    "id": 13,
    "type": "profile_pic",
    "template": "Nouvelle photo de {username}… on dirait une cover МойDate, mais est-ce que l’histoire sera aussi dramatique ? 🎬"
  },
  {
    "id": 14,
    "type": "silence_radio",
    "template": "{username}, 28 ans, 12 matchs… mais 0 message. Swipe pour lui apprendre à dire ‘Salut’ 👋😂"
  },
  {
    "id": 15,
    "type": "emoji_addict",
    "template": "{username} envoie plus d’émojis que de mots. Prochain level : écrire une romance entière en 🍕❤️😂."
  },
  {
    "id": 16,
    "type": "premium_hunter",
    "template": "Attention, {username} a activé le mode Premium… on attend la pluie de matchs 💎."
  },
  {
    "id": 17,
    "type": "serial_messenger",
    "template": "{username} a écrit à 12 personnes aujourd’hui. Quelqu’un peut lui rappeler que ce n’est pas un call center ? ☎️😂"
  },
  {
    "id": 18,
    "type": "ghoster_pro",
    "template": "{username}, 27 ans, ouvre les messages mais ne répond pas. Un ghoster professionnel 👻."
  },
  {
    "id": 19,
    "type": "selfie_king",
    "template": "{username} vient d’ajouter son 9ème selfie. Prochain objectif : calendrier 2026 📅😏."
  },
  {
    "id": 20,
    "type": "bio_philosopher",
    "template": "{username} a écrit une bio plus longue qu’un mémoire universitaire 📚😂."
  },
  {
    "id": 21,
    "type": "quick_matcher",
    "template": "{username} a confirmé un match 3 secondes après le like. Coup de foudre ou vitesse éclair ⚡?"
  },
  {
    "id": 22,
    "type": "late_night_swiper",
    "template": "{username} swipe à 3h du matin… l’amour ne dort jamais 🌙💘."
  },
  {
    "id": 23,
    "type": "report_magnet",
    "template": "{username} a déjà été signalé {report_count} fois. Swipez si vous aimez le danger ⚠️😂."
  },
  {
    "id": 24,
    "type": "match_collector",
    "template": "{username} a {match_count} matchs mais toujours célibataire. Collectionneur ou stratège ? 🃏"
  },
  {
    "id": 25,
    "type": "one_emoji_bio",
    "template": "{username} a résumé sa vie entière avec un seul emoji {emoji}. On attend le traducteur officiel 🤔😂."
  },
  {
    "id": 26,
    "type": "workaholic",
    "template": "{username} répond uniquement entre deux réunions Zoom. L’amour en mode corporate 💼❤️."
  },
  {
    "id": 27,
    "type": "meme_lord",
    "template": "{username} a déjà envoyé 15 memes aujourd’hui. On dirait un compte МойDate humoristique 📲."
  },
  {
    "id": 28,
    "type": "like_disappear",
    "template": "{username} like, match… puis disparaît. Un Houdini du dating 🎩✨."
  },
  {
    "id": 29,
    "type": "over_sharer",
    "template": "Bio de {username} : l’histoire de sa vie depuis la maternelle. Manque plus que le biopic 🎬."
  },
  {
    "id": 30,
    "type": "silent_liker",
    "template": "{username} like tout… mais ne parle jamais. Un ninja du swipe 🥷."
  },
  {
    "id": 31,
    "type": "drama_queen",
    "template": "{username} a changé son statut relationnel 3 fois cette semaine. Prochain épisode demain 📺😂."
  },
  {
    "id": 32,
    "type": "foodie",
    "template": "{username} parle plus de bouffe que d’amour 🍕🍣. Swipe si tu veux des dates au resto !"
  },
  {
    "id": 33,
    "type": "no_photo",
    "template": "{username} croit encore qu’on peut matcher sans photo. Même les astres abandonnent 🌌😂."
  },
  {
    "id": 34,
    "type": "over_filterer",
    "template": "{username} veut seulement 1m85, yeux verts, né un mardi, ascendant Taureau. Bonne chance 🧙‍♂️."
  },
  {
    "id": 35,
    "type": "forever18",
    "template": "{username} a 29 ans mais sa bio dit ‘18 pour toujours’. Benjamin Button version МойDate ⏳😂."
  },
  {
    "id": 36,
  "type": "poet",
    "template": "La bio de {username} rime… du Baudelaire en mode МойDate 🎭."
  },
  {
    "id": 37,
    "type": "music_spammer",
    "template": "{username} a déjà envoyé 10 liens Spotify. À ce stade, c’est un DJ amateur 🎧."
  },
  {
    "id": 38,
    "type": "over_reacter",
    "template": "{username} réagit à TOUT avec 🔥🔥🔥. Même une photo de chien 🐕😅."
  },
  {
    "id": 39,
    "type": "travel_addict",
    "template": "{username} a plus de photos d’aéroport que de selfies. Swipe si tu veux cumuler les miles ✈️."
  },
  {
    "id": 40,
    "type": "gym_freak",
    "template": "{username} a plus de photos à la salle qu’en soirée. Il/elle cherche l’amour ou un partenaire de squat ? 🏋️‍♂️😂"
  },
  {
    "id": 41,
    "type": "pet_lover",
    "template": "{username} a plus de photos de {pet_name} que de lui/elle. Faut matcher avec qui au final ? 🐶😂"
  },
  {
    "id": 42,
    "type": "empty_bio",
    "template": "{username} n’a rien écrit dans sa bio. Bienvenue dans l’escape game МойDate 🔐😂."
  },
  {
    "id": 43,
    "type": "over_flirter",
    "template": "{username} flirte avec TOUT LE MONDE. Les compliments pleuvent comme des flyers en soirée 🎉."
  },
  {
    "id": 44,
    "type": "always_online",
    "template": "{username} est connecté 24/7. Soit il/elle cherche vraiment l’amour… soit il/elle bosse pour МойDate 😅."
  },
  {
    "id": 45,
    "type": "influencer",
    "template": "{username} a ajouté ‘influenceur МойDate’ dans sa bio. Prochain objectif : sponsoriser son premier match 🤳😂."
  }
]
```

### Critères d'Acceptation pour cette Étape

*   Le projet React est initialisé avec Vite.
*   TailwindCSS est configuré avec les couleurs et les `borderRadius` spécifiés.
*   La structure de dossiers de base est créée.
*   Le fichier `src/utils/i18n.js` est présent avec une structure minimale.
*   Le fichier `src/data/feedTemplates.js` (ou `.json`) est créé et contient exactement les données JSON fournies.

Ce prompt est la première étape d'une série. Une fois cette base établie, nous pourrons passer à la génération des composants UI spécifiques, écran par écran.
