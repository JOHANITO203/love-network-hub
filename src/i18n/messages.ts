import type { SupportedLocale } from './types';

export const DEFAULT_LOCALE: SupportedLocale = 'ru';
export const LOCALE_STORAGE_KEY = 'moydate_locale';

export const SUPPORTED_LOCALES: Array<{ code: SupportedLocale; label: string }> = [
  { code: 'ru', label: 'Русский' },
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' }
];

export const MESSAGES: Record<SupportedLocale, Record<string, string>> = {
  ru: {
    'app.loading': 'Загрузка…',
    'app.name': 'МойDate',
    'app.language.auto': 'Автоматически (язык устройства)',
    'app.language.updated': 'Язык изменён',
    // Auth
    'auth.welcome': 'Добро пожаловать',
    'auth.tagline': 'Найди свою идеальную пару',
    'auth.signin': 'Войти',
    'auth.signup': 'Регистрация',
    'auth.continue': 'Продолжить',
    'auth.verify': 'Проверить',
    'auth.email': 'Email',
    'auth.phone': 'Телефон',
    'auth.enterEmail': 'Введите ваш email',
    'auth.enterPhone': 'Введите номер телефона',
    'auth.firstName': 'Имя',
    'auth.lastName': 'Фамилия',
    'auth.password': 'Пароль',
    'auth.createPassword': 'Создайте пароль',
    'auth.enterPassword': 'Введите пароль',
    'auth.otpSent': 'Мы отправили код на',
    'auth.enterOtp': 'Введите код из 4 цифр',
    'auth.resendCode': 'Отправить код повторно',
    'auth.resendCodeIn': 'Отправить повторно через {seconds}с',
    'auth.signingIn': 'Вход...',
    'auth.creatingAccount': 'Создание аккаунта...',
    'auth.verifying': 'Проверка...',
    'auth.sending': 'Отправка...',
    'auth.signInFailed': 'Не удалось войти',
    'auth.signUpFailed': 'Не удалось зарегистрироваться',
    'auth.welcomeBack': 'С возвращением!',
    'auth.signInSuccess': 'Вы успешно вошли',
    'auth.accountCreated': 'Аккаунт создан!',
    'auth.checkEmail': 'Проверьте вашу почту для подтверждения аккаунта',

    'feed.narrator.fallback': 'Саркастичный рассказчик: кто-то собирает лайки... продакшн уже следит.',

    'feed.toast.like.title': 'Лайк отправлен',

    'feed.toast.like.description': 'Алгоритм записал это для поста {postId}.',

    'feed.toast.comment.title': 'Комментарий отправлен',

    'feed.toast.comment.description': 'Твоя остроумная реплика уже летит в пост {postId}.',

    'feed.toast.superlike.title': 'Суперлайк отправлен',

    'feed.toast.superlike.description': 'Суперлайк занесён в журнал для поста {postId}.',

    'feed.toast.share.title': 'Шеринг имитирован',

    'feed.toast.share.description': 'Скрин будто бы улетел лучшим друзьям. Пост {postId}.',

    'feed.toast.profile.title': 'Профиль открыт',

    'feed.toast.profile.description': 'Готовь лучший питч, профиль {userId}.',


  },
  fr: {
    'app.loading': 'Chargement…',
    'app.name': 'МойDate',
    'app.language.auto': "Automatique (langue de l'appareil)",
    'app.language.updated': 'Langue mise à jour',
    // Auth
    'auth.welcome': 'Bienvenue',
    'auth.tagline': 'Trouvez votre partenaire idéal',
    'auth.signin': 'Se connecter',
    'auth.signup': "S'inscrire",
    'auth.continue': 'Continuer',
    'auth.verify': 'Vérifier',
    'auth.email': 'Email',
    'auth.phone': 'Téléphone',
    'auth.enterEmail': 'Entrez votre email',
    'auth.enterPhone': 'Entrez votre numéro de téléphone',
    'auth.firstName': 'Prénom',
    'auth.lastName': 'Nom',
    'auth.password': 'Mot de passe',
    'auth.createPassword': 'Créez un mot de passe',
    'auth.enterPassword': 'Entrez votre mot de passe',
    'auth.otpSent': 'Nous avons envoyé un code à',
    'auth.enterOtp': 'Entrez le code à 4 chiffres',
    'auth.resendCode': 'Renvoyer le code',
    'auth.resendCodeIn': 'Renvoyer dans {seconds}s',
    'auth.signingIn': 'Connexion...',
    'auth.creatingAccount': 'Création du compte...',
    'auth.verifying': 'Vérification...',
    'auth.sending': 'Envoi...',
    'auth.signInFailed': 'Échec de la connexion',
    'auth.signUpFailed': "Échec de l'inscription",
    'auth.welcomeBack': 'Bon retour !',
    'auth.signInSuccess': 'Vous êtes connecté avec succès',
    'auth.accountCreated': 'Compte créé !',
    'auth.checkEmail': 'Vérifiez votre email pour confirmer votre compte',

    'feed.narrator.fallback': 'Narrateur sarcastique : quelqu\'un accumule les likes... l\'équipe production surveille.',

    'feed.toast.like.title': 'Like envoyé',

    'feed.toast.like.description': 'L\'algo prend note pour le post {postId}.',

    'feed.toast.comment.title': 'Commentaire envoyé',

    'feed.toast.comment.description': 'Ta répartie sera servie sur le post {postId}.',

    'feed.toast.superlike.title': 'Superlike envoyé',

    'feed.toast.superlike.description': 'Superlike consigné pour le post {postId}.',

    'feed.toast.share.title': 'Partage simulé',

    'feed.toast.share.description': 'Capture d\'écran envoyée aux BFF (en théorie). Post {postId}.',

    'feed.toast.profile.title': 'Profil ouvert',

    'feed.toast.profile.description': 'Prépare ton meilleur pitch, profil {userId}.',


  },
  en: {
    'app.loading': 'Loading…',
    'app.name': 'МойDate',
    'app.language.auto': 'Automatic (device language)',
    'app.language.updated': 'Language updated',
    // Auth
    'auth.welcome': 'Welcome',
    'auth.tagline': 'Find your perfect match',
    'auth.signin': 'Sign In',
    'auth.signup': 'Sign Up',
    'auth.continue': 'Continue',
    'auth.verify': 'Verify',
    'auth.email': 'Email',
    'auth.phone': 'Phone',
    'auth.enterEmail': 'Enter your email',
    'auth.enterPhone': 'Enter phone number',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.password': 'Password',
    'auth.createPassword': 'Create a password',
    'auth.enterPassword': 'Enter your password',
    'auth.otpSent': 'We sent a code to',
    'auth.enterOtp': 'Enter 4-digit code',
    'auth.resendCode': 'Resend code',
    'auth.resendCodeIn': 'Resend in {seconds}s',
    'auth.signingIn': 'Signing in...',
    'auth.creatingAccount': 'Creating account...',
    'auth.verifying': 'Verifying...',
    'auth.sending': 'Sending...',
    'auth.signInFailed': 'Sign in failed',
    'auth.signUpFailed': 'Sign up failed',
    'auth.welcomeBack': 'Welcome back!',
    'auth.signInSuccess': 'You have successfully signed in',
    'auth.accountCreated': 'Account created!',
    'auth.checkEmail': 'Please check your email to verify your account',

    'feed.narrator.fallback': 'Sarcastic narrator: someone is farming likes... production is watching.',

    'feed.toast.like.title': 'Like sent',

    'feed.toast.like.description': 'The algo logs it for post {postId}.',

    'feed.toast.comment.title': 'Comment queued',

    'feed.toast.comment.description': 'Your witty reply is on its way for post {postId}.',

    'feed.toast.superlike.title': 'Superlike sent',

    'feed.toast.superlike.description': 'Superlike saved for post {postId}.',

    'feed.toast.share.title': 'Share simulated',

    'feed.toast.share.description': 'Screenshot beamed to your BFFs (allegedly). Post {postId}.',

    'feed.toast.profile.title': 'Profile opened',

    'feed.toast.profile.description': 'Polish your pitch, profile {userId}.',


  },
  pt: {
    'app.loading': 'Carregando…',
    'app.name': 'МойDate',
    'app.language.auto': 'Automático (idioma do dispositivo)',
    'app.language.updated': 'Idioma atualizado',
    // Auth
    'auth.welcome': 'Bem-vindo',
    'auth.tagline': 'Encontre seu par perfeito',
    'auth.signin': 'Entrar',
    'auth.signup': 'Cadastrar',
    'auth.continue': 'Continuar',
    'auth.verify': 'Verificar',
    'auth.email': 'Email',
    'auth.phone': 'Telefone',
    'auth.enterEmail': 'Digite seu email',
    'auth.enterPhone': 'Digite o número de telefone',
    'auth.firstName': 'Nome',
    'auth.lastName': 'Sobrenome',
    'auth.password': 'Senha',
    'auth.createPassword': 'Crie uma senha',
    'auth.enterPassword': 'Digite sua senha',
    'auth.otpSent': 'Enviamos um código para',
    'auth.enterOtp': 'Digite o código de 4 dígitos',
    'auth.resendCode': 'Reenviar código',
    'auth.resendCodeIn': 'Reenviar em {seconds}s',
    'auth.signingIn': 'Entrando...',
    'auth.creatingAccount': 'Criando conta...',
    'auth.verifying': 'Verificando...',
    'auth.sending': 'Enviando...',
    'auth.signInFailed': 'Falha ao entrar',
    'auth.signUpFailed': 'Falha ao cadastrar',
    'auth.welcomeBack': 'Bem-vindo de volta!',
    'auth.signInSuccess': 'Você entrou com sucesso',
    'auth.accountCreated': 'Conta criada!',
    'auth.checkEmail': 'Verifique seu email para confirmar sua conta',

    'feed.narrator.fallback': 'Narrador sarcástico: alguém está colecionando likes... a produção está de olho.',

    'feed.toast.like.title': 'Like enviado',

    'feed.toast.like.description': 'O algoritmo anotou para o post {postId}.',

    'feed.toast.comment.title': 'Comentário enviado',

    'feed.toast.comment.description': 'Sua resposta afiada vai aparecer no post {postId}.',

    'feed.toast.superlike.title': 'Superlike enviado',

    'feed.toast.superlike.description': 'Superlike registrado para o post {postId}.',

    'feed.toast.share.title': 'Compartilhamento simulado',

    'feed.toast.share.description': 'Print enviado para as BFFs (na teoria). Post {postId}.',

    'feed.toast.profile.title': 'Perfil aberto',

    'feed.toast.profile.description': 'Capricha no pitch, perfil {userId}.',


  }
};
