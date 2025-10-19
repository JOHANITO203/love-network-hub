// Auto-messages sent by "Équipe МойDate" system

export interface AutoMessage {
  id: string;
  type: 'MATCH_SECURITY' | 'RELATIONSHIP_SURVEY' | 'SAFETY_REMINDER';
  lang: string;
  content: string;
  sender_name: string;
}

const SECURITY_MESSAGES: Record<string, string> = {
  fr: `🎉 Félicitations pour votre nouveau match !

Quelques conseils de sécurité de l'équipe МойDate :
• Prenez le temps de vous connaître dans l'application
• Ne partagez jamais vos informations personnelles (adresse, numéro, etc.) trop rapidement
• Restez vigilant face aux demandes d'argent ou comportements suspects
• Signalez tout profil ou comportement inapproprié

Profitez de cette belle rencontre ! ❤️

— L'équipe МойDate`,

  en: `🎉 Congratulations on your new match!

Some safety tips from the МойDate team:
• Take time to get to know each other in the app
• Never share personal information (address, phone number, etc.) too quickly
• Stay alert to requests for money or suspicious behavior
• Report any inappropriate profile or behavior

Enjoy this wonderful connection! ❤️

— The МойDate Team`,

  pt: `🎉 Parabéns pelo seu novo match!

Algumas dicas de segurança da equipe МойDate:
• Tire um tempo para se conhecerem no aplicativo
• Nunca compartilhe informações pessoais (endereço, telefone, etc.) muito rapidamente
• Fique alerta a pedidos de dinheiro ou comportamento suspeito
• Denuncie qualquer perfil ou comportamento inadequado

Aproveite esta bela conexão! ❤️

— A equipe МойDate`,

  ru: `🎉 Поздравляем с новым матчем!

Несколько советов по безопасности от команды МойDate:
• Не торопитесь узнать друг друга в приложении
• Никогда не делитесь личной информацией (адрес, номер телефона и т.д.) слишком быстро
• Будьте внимательны к просьбам о деньгах или подозрительному поведению
• Сообщайте о любом неподобающем профиле или поведении

Наслаждайтесь этой прекрасной встречей! ❤️

— Команда МойDate`,
};

export const getMatchSecurityMessage = (lang: string = 'fr'): AutoMessage => {
  const normalizedLang = ['fr', 'en', 'pt', 'ru'].includes(lang.toLowerCase())
    ? lang.toLowerCase()
    : 'en';

  return {
    id: `auto-security-${Date.now()}`,
    type: 'MATCH_SECURITY',
    lang: normalizedLang,
    content: SECURITY_MESSAGES[normalizedLang] || SECURITY_MESSAGES.en,
    sender_name: 'Équipe МойDate',
  };
};

export const createAutoMessageInDB = async (
  supabase: any,
  matchId: string,
  message: AutoMessage
) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        match_id: matchId,
        sender_id: null, // System message
        content: message.content,
        is_system: true,
        metadata: {
          type: message.type,
          lang: message.lang,
          sender_name: message.sender_name,
        },
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to create auto-message:', error);
    throw error;
  }
};
