/**
 * МойDate - Premium Card Component
 * Premium features showcase and payment options
 */

import { motion } from 'framer-motion';
import { Crown, Zap, Undo, Eye, Filter, Star, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { PaymentMethod } from '../types';

interface PremiumCardProps {
  isPremium: boolean;
  premiumExpiry?: string;
  onUpgrade: () => void;
}

const PREMIUM_FEATURES = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Boost mensuel',
    description: 'Profil boosté pendant 30 min',
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: 'Voir qui a liké',
    description: 'Accès illimité aux likes',
  },
  {
    icon: <Undo className="w-5 h-5" />,
    title: 'Undo swipe',
    description: 'Annuler tes derniers swipes',
  },
  {
    icon: <Filter className="w-5 h-5" />,
    title: 'Filtres avancés',
    description: 'Filtres exclusifs premium',
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: 'Superlikes illimités',
    description: 'Pas de limite quotidienne',
  },
];

const PAYMENT_METHODS: { id: PaymentMethod; name: string; icon: string }[] = [
  { id: 'yoomoney', name: 'YooMoney', icon: '💳' },
  { id: 'mir', name: 'Mir', icon: '🏦' },
  { id: 'qiwi', name: 'Qiwi', icon: '🔵' },
  { id: 'apple_pay', name: 'Apple Pay', icon: '' },
  { id: 'google_pay', name: 'Google Pay', icon: '🟢' },
  { id: 'stripe', name: 'Carte bancaire', icon: '💳' },
];

export const PremiumCard = ({ isPremium, premiumExpiry, onUpgrade }: PremiumCardProps) => {
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);

  if (isPremium) {
    const expiryDate = premiumExpiry ? new Date(premiumExpiry) : null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-3xl p-6 text-white relative overflow-hidden"
      >
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Membre Premium</h2>
          </div>

          <p className="text-white/90 mb-4">
            Tu profites actuellement de tous les avantages premium.
          </p>

          {expiryDate && (
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
              <p className="text-sm">
                Expire le{' '}
                <span className="font-semibold">
                  {expiryDate.toLocaleDateString('fr-FR')}
                </span>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl p-6 border-2 border-yellow-500/50 dark:border-yellow-500/30 relative overflow-hidden">
      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400/20 to-pink-500/20 rounded-full blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-500 to-pink-500 bg-clip-text text-transparent">
            Passer Premium
          </h2>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {PREMIUM_FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                {feature.icon}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground">{feature.title}</div>
                <div className="text-sm text-muted-foreground">
                  {feature.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Price */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-yellow-500/10 to-pink-500/10 dark:from-yellow-500/5 dark:to-pink-500/5 rounded-2xl p-4 mb-4 border border-yellow-500/20 dark:border-yellow-500/10"
        >
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-pink-500 bg-clip-text text-transparent mb-1">
              9.99€
            </div>
            <div className="text-sm text-muted-foreground">par mois</div>
          </div>
        </motion.div>

        {/* Upgrade Button */}
        {!showPaymentMethods ? (
          <Button
            onClick={() => setShowPaymentMethods(true)}
            className="w-full bg-gradient-to-r from-yellow-500 to-pink-500 hover:from-yellow-600 hover:to-pink-600 text-white font-semibold h-12 rounded-xl shadow-lg"
          >
            <Crown className="w-5 h-5 mr-2" />
            Débloquer Premium
          </Button>
        ) : (
          <>
            {/* Payment Methods */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Choisir un moyen de paiement
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <motion.button
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`
                      p-3 rounded-xl border-2 transition-all
                      ${
                        selectedPayment === method.id
                          ? 'border-yellow-500 bg-yellow-500/10 dark:bg-yellow-500/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{method.icon}</span>
                      <span className="text-sm font-medium text-foreground">
                        {method.name}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Confirm Payment */}
            <Button
              onClick={onUpgrade}
              disabled={!selectedPayment}
              className="w-full bg-gradient-to-r from-yellow-500 to-pink-500 hover:from-yellow-600 hover:to-pink-600 text-white font-semibold h-12 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Confirmer le paiement
            </Button>

            <button
              onClick={() => setShowPaymentMethods(false)}
              className="w-full mt-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Annuler
            </button>
          </>
        )}
      </div>
    </div>
  );
};
