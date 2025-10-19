/**
 * МойDate - Profile Edit Modal
 * Modal for editing profile information
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { ProfileEditData, RelationshipStatus } from '../types';
import { AVAILABLE_PASSIONS, RELATIONSHIP_STATUS_CONFIG } from '../types';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    username: string;
    bio: string;
    passions: string[];
    relationshipStatus: RelationshipStatus;
    currentCity: string;
  };
  onSave: (data: ProfileEditData) => void;
}

export const ProfileEditModal = ({
  isOpen,
  onClose,
  initialData,
  onSave,
}: ProfileEditModalProps) => {
  const [username, setUsername] = useState(initialData.username);
  const [bio, setBio] = useState(initialData.bio);
  const [passions, setPassions] = useState<string[]>(initialData.passions);
  const [relationshipStatus, setRelationshipStatus] = useState<RelationshipStatus>(
    initialData.relationshipStatus
  );
  const [currentCity, setCurrentCity] = useState(initialData.currentCity);

  const handleSave = () => {
    onSave({
      username,
      bio,
      passions,
      relationshipStatus,
      currentCity,
    });
    onClose();
  };

  const togglePassion = (passion: string) => {
    if (passions.includes(passion)) {
      setPassions(passions.filter((p) => p !== passion));
    } else {
      setPassions([...passions, passion]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border dark:border-gray-800">
                <h2 className="text-2xl font-bold text-foreground">Modifier le profil</h2>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Username */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Nom d'utilisateur
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-love-primary text-foreground"
                    placeholder="Ton nom d'utilisateur"
                  />
                </div>

                {/* Current City */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Ville actuelle
                  </label>
                  <input
                    type="text"
                    value={currentCity}
                    onChange={(e) => setCurrentCity(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-love-primary text-foreground"
                    placeholder="Paris, Londres, etc."
                  />
                </div>

                {/* Relationship Status */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Statut relationnel
                  </label>
                  <div className="flex gap-3">
                    {Object.entries(RELATIONSHIP_STATUS_CONFIG).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => setRelationshipStatus(key as RelationshipStatus)}
                        className={`
                          flex-1 px-4 py-3 rounded-xl border-2 transition-all
                          ${
                            relationshipStatus === key
                              ? `${config.color} text-white border-transparent`
                              : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-foreground hover:border-gray-300 dark:hover:border-gray-600'
                          }
                        `}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span>{config.icon}</span>
                          <span className="text-sm font-medium">{config.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Bio ({bio.length}/500)
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 500))}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-love-primary text-foreground resize-none"
                    placeholder="Raconte-nous qui tu es..."
                  />
                  {bio.length >= 50 && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      ✓ Bio complète
                    </p>
                  )}
                </div>

                {/* Passions */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Passions ({passions.length} sélectionnées)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_PASSIONS.map((passion) => (
                      <button
                        key={passion}
                        onClick={() => togglePassion(passion)}
                        className={`
                          px-4 py-2 rounded-full border-2 transition-all text-sm font-medium
                          ${
                            passions.includes(passion)
                              ? 'bg-gradient-to-r from-love-primary to-love-secondary text-white border-transparent'
                              : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-foreground hover:border-gray-300 dark:hover:border-gray-600'
                          }
                        `}
                      >
                        {passion}
                      </button>
                    ))}
                  </div>
                  {passions.length >= 3 && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                      ✓ Au moins 3 passions sélectionnées
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-border dark:border-gray-800">
                <Button variant="ghost" onClick={onClose}>
                  Annuler
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-love-primary to-love-secondary text-white"
                >
                  Sauvegarder
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
