/**
 * МойDate - Messages Feature Exports
 * Main entry point for the Messages feature
 */

// Components
export * from './components';

// Hooks
export * from './hooks';

// Types
export * from './types';

// Store
export {
  getConversations,
  getActivities,
  filterConversations,
  sendMessage,
  markAsRead,
  togglePin,
  toggleFavorite,
  deleteConversation,
  addReaction,
  markActivityViewed,
  searchMessages,
} from './store/messagesStore';
