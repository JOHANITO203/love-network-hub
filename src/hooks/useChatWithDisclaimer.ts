import { useState, useCallback, useRef } from 'react';
import { detectOffPlatformKeywords, getDisclaimerMessage, getDisclaimerInterval } from '@/utils/keywordDetector';
import { useToast } from './use-toast';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'match' | 'system';
  content: string;
  timestamp: Date;
  isDisclaimer?: boolean;
  keywordFlags?: string[];
}

export const useChatWithDisclaimer = (matchId: string, userLang: string = 'fr') => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const lastDisclaimerTime = useRef<number>(0);
  const { toast } = useToast();

  const injectDisclaimer = useCallback((detectedFlags: string[]) => {
    const now = Date.now();
    const interval = getDisclaimerInterval();

    // Only inject if enough time has passed since last disclaimer
    if (now - lastDisclaimerTime.current < interval) {
      return;
    }

    const disclaimerMessage: ChatMessage = {
      id: `disclaimer-${now}`,
      sender: 'system',
      content: getDisclaimerMessage(userLang),
      timestamp: new Date(),
      isDisclaimer: true,
      keywordFlags: detectedFlags,
    };

    setMessages(prev => [...prev, disclaimerMessage]);
    lastDisclaimerTime.current = now;

    // Show toast notification
    toast({
      title: "⚠️ Rappel de sécurité",
      description: "Nous avons détecté une tentative de partage de contact externe.",
      variant: "destructive",
    });
  }, [userLang, toast]);

  const sendMessage = useCallback(async (content: string, sender: 'user' | 'match' = 'user') => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      sender,
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);

    // Detect off-platform keywords
    try {
      const detection = await detectOffPlatformKeywords(content, userLang);

      if (detection.flags.length > 0 && detection.confidence > 0.5) {
        // Inject disclaimer if suspicious content detected
        injectDisclaimer(detection.flags);


      }
    } catch (error) {
      console.error('Keyword detection failed:', error);
    }

    return newMessage;
  }, [userLang, injectDisclaimer]);

  const addSystemMessage = useCallback((content: string) => {
    const systemMessage: ChatMessage = {
      id: `system-${Date.now()}`,
      sender: 'system',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, systemMessage]);
  }, []);

  return {
    messages,
    sendMessage,
    addSystemMessage,
    setMessages,
  };
};
