/**
 * МойDate Feed Templates - Sarcastic and humorous post templates
 * These templates are used to auto-generate engaging social feed posts
 * based on user behavior and interactions
 */

export interface FeedTemplate {
  id: number;
  type: string;
  template: string;
}

export const feedTemplates: FeedTemplate[] = [
  {
    id: 1,
    type: "serial_swiper",
    template: "🔥 {username}, {age} ans, {sign} a déjà swipé {like_count} fois cette semaine. Quelqu'un veut bien lui éviter la tendinite ? 😅"
  },
  {
    id: 2,
    type: "type_hunter",
    template: "👀 {username} ne like QUE les {target_age} ans de {target_origin}… obsession ou destin ? 😏"
  },
  {
    id: 3,
    type: "fan_club",
    template: "⭐ {username} ({sign}) récolte {like_count} likes cette semaine. Bientôt il/elle ouvre un fan club officiel 😎"
  },
  {
    id: 4,
    type: "romantic_stalker",
    template: "💘 {username} a liké {target_user} {repeat_count} fois. Persévérance ou déclaration d'amour ? 😂"
  },
  {
    id: 5,
    type: "astro_fun",
    template: "♏ Scorpions cette semaine : ils likent tout ce qui bouge. Courage aux Lions ♌ !"
  },
  {
    id: 6,
    type: "binome_drama",
    template: "🎬 {userA} + {userB}… ils s'écrivent plus que les scénaristes de Netflix. Un couple en préparation ? 👀"
  },
  {
    id: 7,
    type: "intercultural",
    template: "🌍 Nouveau match ! {userA} {flagA} + {userB} {flagB}. Ça sent les débats pimentés 🌶️ et les câlins glacés ❄️"
  },
  {
    id: 8,
    type: "story_overlay",
    template: "{username} poste: '{caption}'. Narrateur: 'Elle veut l'amour… ou juste un cappuccino gratuit ? ☕😂'"
  },
  {
    id: 9,
    type: "no_match_yet",
    template: "Camila, 23 ans ♎︎… 72 likes ce week-end et toujours pas de match. Quelqu'un veut la sauver ? 😂"
  },
  {
    id: 10,
    type: "swipe_hater",
    template: "Bred, 25 ans… il swipe à gauche plus vite qu'un banquier devant une facture 🤣"
  },
  {
    id: 11,
    type: "binome_netflix",
    template: "Jessica ♌︎ + Ivan ♑︎ … on dirait la saison 2 d'un drama Netflix 💕🔥."
  },
  {
    id: 12,
    type: "collectif_astro",
    template: "Les Scorpions ♏︎ cette semaine ont décidé d'aimer TOUT le monde 😏. Les Lions ♌︎, préparez vos cœurs !"
  },
  {
    id: 13,
    type: "profile_pic",
    template: "Nouvelle photo de {username}… on dirait une cover МойDate, mais est-ce que l'histoire sera aussi dramatique ? 🎬"
  },
  {
    id: 14,
    type: "silence_radio",
    template: "{username}, 28 ans, 12 matchs… mais 0 message. Swipe pour lui apprendre à dire 'Salut' 👋😂"
  },
  {
    id: 15,
    type: "emoji_addict",
    template: "{username} envoie plus d'émojis que de mots. Prochain level : écrire une romance entière en 🍕❤️😂."
  },
  {
    id: 16,
    type: "premium_hunter",
    template: "Attention, {username} a activé le mode Premium… on attend la pluie de matchs 💎."
  },
  {
    id: 17,
    type: "serial_messenger",
    template: "{username} a écrit à 12 personnes aujourd'hui. Quelqu'un peut lui rappeler que ce n'est pas un call center ? ☎️😂"
  },
  {
    id: 18,
    type: "ghoster_pro",
    template: "{username}, 27 ans, ouvre les messages mais ne répond pas. Un ghoster professionnel 👻."
  },
  {
    id: 19,
    type: "selfie_king",
    template: "{username} vient d'ajouter son 9ème selfie. Prochain objectif : calendrier 2026 📅😏."
  },
  {
    id: 20,
    type: "bio_philosopher",
    template: "{username} a écrit une bio plus longue qu'un mémoire universitaire 📚😂."
  },
  {
    id: 21,
    type: "quick_matcher",
    template: "{username} a confirmé un match 3 secondes après le like. Coup de foudre ou vitesse éclair ⚡?"
  },
  {
    id: 22,
    type: "late_night_swiper",
    template: "{username} swipe à 3h du matin… l'amour ne dort jamais 🌙💘."
  },
  {
    id: 23,
    type: "report_magnet",
    template: "{username} a déjà été signalé {report_count} fois. Swipez si vous aimez le danger ⚠️😂."
  },
  {
    id: 24,
    type: "match_collector",
    template: "{username} a {match_count} matchs mais toujours célibataire. Collectionneur ou stratège ? 🃏"
  },
  {
    id: 25,
    type: "one_emoji_bio",
    template: "{username} a résumé sa vie entière avec un seul emoji {emoji}. On attend le traducteur officiel 🤔😂."
  },
  {
    id: 26,
    type: "workaholic",
    template: "{username} répond uniquement entre deux réunions Zoom. L'amour en mode corporate 💼❤️."
  },
  {
    id: 27,
    type: "meme_lord",
    template: "{username} a déjà envoyé 15 memes aujourd'hui. On dirait un compte МойDate humoristique 📲."
  },
  {
    id: 28,
    type: "like_disappear",
    template: "{username} like, match… puis disparaît. Un Houdini du dating 🎩✨."
  },
  {
    id: 29,
    type: "over_sharer",
    template: "Bio de {username} : l'histoire de sa vie depuis la maternelle. Manque plus que le biopic 🎬."
  },
  {
    id: 30,
    type: "silent_liker",
    template: "{username} like tout… mais ne parle jamais. Un ninja du swipe 🥷."
  },
  {
    id: 31,
    type: "drama_queen",
    template: "{username} a changé son statut relationnel 3 fois cette semaine. Prochain épisode demain 📺😂."
  },
  {
    id: 32,
    type: "foodie",
    template: "{username} parle plus de bouffe que d'amour 🍕🍣. Swipe si tu veux des dates au resto !"
  },
  {
    id: 33,
    type: "no_photo",
    template: "{username} croit encore qu'on peut matcher sans photo. Même les astres abandonnent 🌌😂."
  },
  {
    id: 34,
    type: "over_filterer",
    template: "{username} veut seulement 1m85, yeux verts, né un mardi, ascendant Taureau. Bonne chance 🧙‍♂️."
  },
  {
    id: 35,
    type: "forever18",
    template: "{username} a 29 ans mais sa bio dit '18 pour toujours'. Benjamin Button version МойDate ⏳😂."
  },
  {
    id: 36,
    type: "poet",
    template: "La bio de {username} rime… du Baudelaire en mode МойDate 🎭."
  },
  {
    id: 37,
    type: "music_spammer",
    template: "{username} a déjà envoyé 10 liens Spotify. À ce stade, c'est un DJ amateur 🎧."
  },
  {
    id: 38,
    type: "over_reacter",
    template: "{username} réagit à TOUT avec 🔥🔥🔥. Même une photo de chien 🐕😅."
  },
  {
    id: 39,
    type: "travel_addict",
    template: "{username} a plus de photos d'aéroport que de selfies. Swipe si tu veux cumuler les miles ✈️."
  },
  {
    id: 40,
    type: "gym_freak",
    template: "{username} a plus de photos à la salle qu'en soirée. Il/elle cherche l'amour ou un partenaire de squat ? 🏋️‍♂️😂"
  },
  {
    id: 41,
    type: "pet_lover",
    template: "{username} a plus de photos de {pet_name} que de lui/elle. Faut matcher avec qui au final ? 🐶😂"
  },
  {
    id: 42,
    type: "empty_bio",
    template: "{username} n'a rien écrit dans sa bio. Bienvenue dans l'escape game МойDate 🔐😂."
  },
  {
    id: 43,
    type: "over_flirter",
    template: "{username} flirte avec TOUT LE MONDE. Les compliments pleuvent comme des flyers en soirée 🎉."
  },
  {
    id: 44,
    type: "always_online",
    template: "Attention, {username} est connecté 24/7. Soit il/elle cherche vraiment l'amour… soit il/elle bosse pour МойDate 😅."
  },
  {
    id: 45,
    type: "influencer",
    template: "{username} a ajouté 'influenceur МойDate' dans sa bio. Prochain objectif : sponsoriser son premier match 🤳😂."
  }
];

/**
 * Get a random template by type
 */
export const getTemplateByType = (type: string): FeedTemplate | undefined => {
  return feedTemplates.find(template => template.type === type);
};

/**
 * Get a random template
 */
export const getRandomTemplate = (): FeedTemplate => {
  const randomIndex = Math.floor(Math.random() * feedTemplates.length);
  return feedTemplates[randomIndex];
};

/**
 * Replace template variables with actual values
 */
export const fillTemplate = (
  template: string,
  variables: Record<string, string | number>
): string => {
  let result = template;

  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{${key}}`;
    result = result.replace(new RegExp(placeholder, 'g'), String(value));
  });

  return result;
};
