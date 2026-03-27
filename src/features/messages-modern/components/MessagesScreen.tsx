/**
 * МойDate - MessagesScreen Component
 * Main messages screen with search, activities, and conversations
 */

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useMessages } from '../hooks/useMessages';
import { ConversationListItem } from './ConversationListItem';
import { ConversationView } from './ConversationView';
import { SearchBar } from './SearchBar';
import { cn } from '@/lib/utils';

export const MessagesScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chats' | 'matches'>('chats');
  const [showSearch, setShowSearch] = useState(false);

  const {
    conversations,
    activities,
    searchQuery,
    search,
    selectedConversation,
    selectConversation,
    sendMessage,
    addReaction,
    loading,
  } = useMessages();

  const handleSelectConversation = (conversation: any) => {
    selectConversation(conversation);
  };

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

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(90,169,255,0.16),transparent_45%)]" />

      <header className="sticky top-0 z-30 glass-surface border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white font-display">Messages</h1>
              <div className="mt-2 flex items-center gap-3 text-xs text-white/60">
                <span className="inline-flex items-center gap-2">
                  <span className="text-sm">🇷🇺</span> Moscow
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="text-sm">🇷🇺</span> Voronezh
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowSearch((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            >
              <Search className="w-5 h-5 text-white/70" />
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-white/5 p-1 w-fit">
            <button
              onClick={() => setActiveTab('chats')}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-semibold transition',
                activeTab === 'chats' ? 'bg-white text-black' : 'text-white/60'
              )}
            >
              Chats
            </button>
            <button
              onClick={() => setActiveTab('matches')}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-semibold transition',
                activeTab === 'matches' ? 'bg-white text-black' : 'text-white/60'
              )}
            >
              Matches
            </button>
          </div>
        </div>
      </header>

      {showSearch && (
        <SearchBar
          value={searchQuery}
          onChange={search}
          filter="all"
          onFilterChange={() => null}
        />
      )}

      <main className="max-w-2xl mx-auto px-4 pb-28 space-y-6">
        {activeTab === 'chats' && (
          <>
            <section className="space-y-3">
              <div className="flex items-center justify-between text-sm text-white/70">
                <h3 className="font-semibold">New Matches</h3>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar">
                {activities.slice(0, 3).map((match) => (
                  <div key={match.id} className="flex-shrink-0 text-center">
                    <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border border-white/10">
                      <img src={match.avatar} alt={match.userName} className="w-full h-full object-cover" />
                      {!match.viewed && (
                        <span className="absolute -right-1 -bottom-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-[#0b0f1a]" />
                      )}
                    </div>
                    <p className="text-xs text-white/70 mt-2">{match.userName}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white/80">Recent Chats</h3>
                <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4 text-white/60" />
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16 text-white/60">Chargement...</div>
              ) : conversations.length === 0 ? (
                <div className="flex items-center justify-center py-16 text-white/60">Aucun message pour l'instant.</div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {conversations.map((conversation) => (
                      <ConversationListItem
                        key={conversation.id}
                        conversation={conversation}
                        onClick={() => handleSelectConversation(conversation)}
                        onPin={() => null}
                        onFavorite={() => null}
                        onDelete={() => null}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === 'matches' && (
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-white/80">Nouveaux matchs</h3>
            <div className="grid gap-4">
              {activities.slice(0, 4).map((match) => (
                <div key={match.id} className="glass-panel rounded-2xl p-4 flex items-center gap-3">
                  <img src={match.avatar} alt={match.userName} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{match.userName}</p>
                    <p className="text-xs text-white/50">Match récent • démarre la conversation</p>
                  </div>
                  <span className="w-2 h-2 bg-rose-500 rounded-full" />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <button
        className="fixed bottom-20 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-[#ff4d6d] to-[#ff8b5a] text-white shadow-[0_16px_36px_rgba(255,77,109,0.4)] flex items-center justify-center"
        aria-label="New message"
      >
        +
      </button>
    </div>
  );
};
