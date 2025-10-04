/**
 * МойDate - MessagesScreen Component
 * Main messages screen with search, activities, and conversations
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useMessages } from '../hooks/useMessages';
import { SearchBar } from './SearchBar';
import { ActivitiesBar } from './ActivitiesBar';
import { ConversationListItem } from './ConversationListItem';
import { ConversationView } from './ConversationView';
import { useToast } from '@/hooks/use-toast';

export const MessagesScreen: React.FC = () => {
  const { toast } = useToast();
  const [showActivityStory, setShowActivityStory] = useState(false);

  const {
    conversations,
    activities,
    filter,
    setFilter,
    searchQuery,
    search,
    selectedConversation,
    selectConversation,
    sendMessage,
    togglePin,
    toggleFavorite,
    deleteConversation,
    addReaction,
    viewActivity,
    loading,
    unreadCount,
  } = useMessages();

  const handleActivityClick = (activity: any) => {
    viewActivity(activity.id);
    setShowActivityStory(true);
    // TODO: Show activity story viewer
    toast({
      title: 'Story',
      description: `Viewing ${activity.userName}'s story`,
    });
  };

  const handleConversationAction = (action: string, conversationId: string) => {
    switch (action) {
      case 'pin':
        togglePin(conversationId);
        toast({
          title: 'Épinglé',
          description: 'Conversation épinglée',
        });
        break;
      case 'favorite':
        toggleFavorite(conversationId);
        toast({
          title: 'Favori',
          description: 'Ajouté aux favoris',
        });
        break;
      case 'delete':
        deleteConversation(conversationId);
        toast({
          title: 'Supprimé',
          description: 'Conversation supprimée',
        });
        break;
    }
  };

  // If conversation selected, show chat view
  if (selectedConversation) {
    return (
      <ConversationView
        conversation={selectedConversation}
        onBack={() => selectConversation(null)}
        onSendMessage={(content, type) => {
          sendMessage(selectedConversation.id, content, type);
        }}
        onReact={(messageId, emoji) => addReaction(messageId, emoji)}
      />
    );
  }

  // Main messages list view
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white font-display">
                Messages
              </h1>
              {unreadCount > 0 && (
                <p className="text-xs text-primary font-medium">
                  {unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center shadow-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={search}
        filter={filter}
        onFilterChange={setFilter}
      />

      {/* Activities Bar */}
      <ActivitiesBar
        activities={activities}
        onActivityClick={handleActivityClick}
      />

      {/* Conversations List */}
      <main className="max-w-2xl mx-auto pb-24">
        {loading ? (
          // Loading State
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Chargement...
              </p>
            </div>
          </div>
        ) : conversations.length === 0 ? (
          // Empty State
          <div className="flex items-center justify-center py-20 px-4">
            <div className="text-center space-y-6 max-w-md">
              <div className="text-6xl">💬</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">
                Aucun message
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Commencez à discuter avec vos matchs pour voir vos conversations ici!
              </p>
            </div>
          </div>
        ) : (
          // Conversations
          <div className="divide-y divide-gray-200/50 dark:divide-gray-800/50">
            <AnimatePresence>
              {conversations.map((conversation) => (
                <ConversationListItem
                  key={conversation.id}
                  conversation={conversation}
                  onClick={() => selectConversation(conversation)}
                  onPin={() => handleConversationAction('pin', conversation.id)}
                  onFavorite={() => handleConversationAction('favorite', conversation.id)}
                  onDelete={() => handleConversationAction('delete', conversation.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};
