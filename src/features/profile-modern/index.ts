/**
 * МойDate - Profile Modern Feature Exports
 * Main entry point for the Profile feature
 */

// Components
export * from './components';

// Hooks
export { useProfile } from './hooks/useProfile';

// Types
export * from './types';

// Store utilities (for advanced usage)
export {
  getUserProfile,
  updateProfile,
  calculateAge,
  calculateAstroSign,
  calculateProfileCompletion,
} from './store/profileStore';
