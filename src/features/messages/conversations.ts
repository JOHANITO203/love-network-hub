interface ConversationMessage {
  id: string;
  sender: "me" | "them";
  content: string;
  time: string;
}

interface ConversationData {
  matchId: string;
  matchName: string;
  matchAvatar: string;
  messages: ConversationMessage[];
}

export const mockConversations: ConversationData[] = [
  {
    matchId: "msg-1",
    matchName: "Grace",
    matchAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    messages: [
      {
        id: "m1",
        sender: "them",
        content: "Hi Jake, how are you? I saw on the app that we’ve crossed paths several times this week ??",
        time: "2:55 PM",
      },
      {
        id: "m2",
        sender: "me",
        content: "Haha truly! Nice to meet you Grace! What about a cup of coffee today evening? ?",
        time: "3:02 PM",
      },
      {
        id: "m3",
        sender: "them",
        content: "Sure, let’s do it! ??",
        time: "3:10 PM",
      },
      {
        id: "m4",
        sender: "me",
        content: "Great! I will write later the exact time and place. See you soon!",
        time: "3:12 PM",
      },
    ],
  },
];
