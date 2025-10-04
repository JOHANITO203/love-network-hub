/**
 * МойDate - Settings Section Component
 * Privacy, notifications, security settings
 */

import { motion } from 'framer-motion';
import { Bell, Lock, Eye, EyeOff, Shield, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ProfileSettings } from '../types';

interface SettingsSectionProps {
  settings: ProfileSettings;
  onUpdateSettings: (settings: Partial<ProfileSettings>) => void;
  onDeleteAccount: () => void;
}

export const SettingsSection = ({
  settings,
  onUpdateSettings,
  onDeleteAccount,
}: SettingsSectionProps) => {
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl p-6 border border-border/50 dark:border-gray-800">
      {/* Header */}
      <h2 className="text-xl font-bold text-foreground mb-6">Paramètres</h2>

      {/* Notifications */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Notifications</h3>
        </div>

        <div className="space-y-3">
          <ToggleItem
            label="Notifications Push"
            checked={settings.notifications.push}
            onChange={(checked) =>
              onUpdateSettings({
                notifications: { ...settings.notifications, push: checked },
              })
            }
          />
          <ToggleItem
            label="Emails"
            checked={settings.notifications.email}
            onChange={(checked) =>
              onUpdateSettings({
                notifications: { ...settings.notifications, email: checked },
              })
            }
          />
          <ToggleItem
            label="SMS"
            checked={settings.notifications.sms}
            onChange={(checked) =>
              onUpdateSettings({
                notifications: { ...settings.notifications, sms: checked },
              })
            }
          />
        </div>
      </div>

      {/* Privacy */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Confidentialité</h3>
        </div>

        <div className="space-y-3">
          <ToggleItem
            label="Cacher mon âge"
            checked={settings.privacy.hideAge}
            onChange={(checked) =>
              onUpdateSettings({
                privacy: { ...settings.privacy, hideAge: checked },
              })
            }
          />
          <ToggleItem
            label="Cacher ma distance"
            checked={settings.privacy.hideDistance}
            onChange={(checked) =>
              onUpdateSettings({
                privacy: { ...settings.privacy, hideDistance: checked },
              })
            }
          />
          <ToggleItem
            label="Profils vérifiés uniquement"
            checked={settings.privacy.onlyVerifiedUsers}
            onChange={(checked) =>
              onUpdateSettings({
                privacy: { ...settings.privacy, onlyVerifiedUsers: checked },
              })
            }
          />
          <ToggleItem
            label="Afficher statut en ligne"
            checked={settings.privacy.showOnlineStatus}
            onChange={(checked) =>
              onUpdateSettings({
                privacy: { ...settings.privacy, showOnlineStatus: checked },
              })
            }
          />
        </div>
      </div>

      {/* Security */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Sécurité</h3>
        </div>

        <div className="space-y-3">
          <ToggleItem
            label="Authentification 2FA"
            checked={settings.security.twoFactorEnabled}
            onChange={(checked) =>
              onUpdateSettings({
                security: { ...settings.security, twoFactorEnabled: checked },
              })
            }
          />
          <ToggleItem
            label="Détection numéros/réseaux sociaux"
            description="Affiche un disclaimer si numéro ou tag détecté"
            checked={settings.security.socialMediaDetection}
            onChange={(checked) =>
              onUpdateSettings({
                security: {
                  ...settings.security,
                  socialMediaDetection: checked,
                },
              })
            }
          />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border-t border-red-200 dark:border-red-900/30 pt-6">
        <div className="flex items-center gap-2 mb-3">
          <Trash2 className="w-5 h-5 text-red-500" />
          <h3 className="font-semibold text-red-600 dark:text-red-400">
            Zone de danger
          </h3>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="destructive"
            onClick={onDeleteAccount}
            className="w-full bg-red-500 hover:bg-red-600"
          >
            Supprimer mon compte
          </Button>
        </motion.div>

        <p className="text-xs text-muted-foreground mt-2 text-center">
          Cette action est irréversible. Toutes vos données seront supprimées.
        </p>
      </div>
    </div>
  );
};

interface ToggleItemProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleItem = ({ label, description, checked, onChange }: ToggleItemProps) => {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
    >
      <div className="flex-1">
        <div className="text-sm font-medium text-foreground">{label}</div>
        {description && (
          <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
        )}
      </div>

      <button
        onClick={() => onChange(!checked)}
        className={`
          relative w-12 h-6 rounded-full transition-colors duration-300
          ${checked ? 'bg-love-primary' : 'bg-gray-300 dark:bg-gray-600'}
        `}
      >
        <motion.div
          initial={false}
          animate={{ x: checked ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
        />
      </button>
    </motion.div>
  );
};
