# Présentation simple de l'univers MoyDate

Ce document explique avec des mots du quotidien comment fonctionne l'application MoyDate et les étapes prévues pour son évolution. Il est destiné à des personnes qui ne travaillent pas dans l'informatique.

## Le voyage d'un nouvel utilisateur

1. **Découvrir et s'inscrire**  
   La personne arrive sur l'application, choisit comment créer son compte (adresse e-mail, téléphone ou réseaux sociaux) et confirme son identité en recevant un code.

2. **Construire son profil**  
   Un petit parcours guidé aide à remplir les informations importantes : prénom, ville, centres d'intérêt, photos, préférences de rencontre. Cela ressemble à un questionnaire en plusieurs étapes.

3. **Trouver des profils compatibles**  
   Une fois le profil prêt, l'application propose des personnes compatibles en tenant compte de l'âge, des goûts en commun, de la distance et même du signe astrologique.

4. **Commencer à discuter**  
   Quand deux personnes s'apprécient, elles peuvent parler ensemble. MoyDate prévoit un chat moderne avec messages écrits, messages vocaux et l'aide d'un assistant intelligent pour lancer la conversation.

5. **Participer à la vie de la communauté**  
   Des idées en cours : un fil d'actualités pour partager des moments, des défis pour gagner des badges, et des options « Premium » pour booster la visibilité ou obtenir plus de fonctionnalités.

## Les coulisses de l'application

Pour que tout se déroule en douceur, plusieurs « équipes » logicielles travaillent en coulisses. Chacune s’occupe d’une tâche précise, un peu comme des services municipaux.

- **Service d’identification (Auth)**  
  Gère les inscriptions, connexions, envois de codes de sécurité et connexions via Google ou VK. Objectif : simplicité et protection des comptes.

- **Service Profils**  
  Range toutes les informations personnelles, les préférences de rencontre et les photos. Il assure que les données sont à jour et bien protégées.

- **Service Rencontres (Matching)**  
  Compare les profils, calcule un score de compatibilité et alimente l’écran de « swipe » pour proposer les meilleures rencontres possibles.

- **Service Messages**  
  Permet les discussions en direct (texte ou voix). Il garde l’historique et s’assure que les échanges arrivent instantanément.

- **Service Assistant IA**  
  Fournit des idées de messages, un ton léger ou humoristique, et aide à briser la glace lorsque la conversation démarre.

- **Service Fil Social**  
  Gère les publications, les réactions et les commentaires pour créer un espace communautaire au-delà des rencontres.

- **Service Jeu & Badges**  
  Anime l’expérience avec des succès à débloquer, des classements et des bonus comme les « super likes ».

- **Service Premium**  
  S’occupe des abonnements payants, des boosts de profil et de la gestion des paiements (par carte ou solutions locales).

- **Service Notifications**  
  Envoie les e-mails, SMS et notifications push pour avertir en temps réel (nouveau message, like, sécurité…).

- **Service Média**  
  Stocke les photos/vidéos et applique des contrôles automatiques pour éviter les contenus inappropriés.

- **Service Traduction & Localisation**  
  Aide à proposer l’application dans plusieurs langues et adapte les contenus aux marchés visés (France, Russie, international).

- **Service Conformité & Sécurité**  
  Archive les consentements, surveille la fraude, respecte les lois locales (RGPD, normes russes) et coopère avec les autorités si nécessaire.

## Les grandes phases du projet

| Phase | Objectif principal | Ce que cela signifie |
| --- | --- | --- |
| **Phase 1 – Lancement MVP** | Authentification, profils, premiers matchs | Pouvoir créer un compte, compléter son profil et rencontrer quelques profils compatibles. |
| **Phase 2 – Conversation enrichie** | Messagerie en direct, assistant IA | Faciliter les échanges et donner un coup de pouce pour engager la discussion. |
| **Phase 3 – Communauté vivante** | Fil social, badges, défis | Encourager les utilisateurs à rester actifs et à partager des moments. |
| **Phase 4 – Offre Premium** | Abonnements, boosts, super likes | Générer des revenus et offrir plus d’options aux utilisateurs motivés. |
| **Phase 5 – International & IA avancée** | Traduction, recommandations intelligentes | Adapter l’application à plusieurs pays et proposer des suggestions encore plus personnalisées. |

## Comment lire ce document

- Pensez aux services comme à des équipes spécialisées.  
- Chaque phase ajoute une couche d’expérience utilisateur.  
- L’application évolue progressivement : on commence simple, puis on enrichit au fil du temps.

---
**En résumé**  
MoyDate veut accompagner les personnes depuis leur inscription jusqu’à la rencontre, grâce à une expérience soignée et des services en coulisses bien orchestrés. Ce plan aide toute l’équipe à garder le cap, y compris celles et ceux qui ne sont pas du métier.
