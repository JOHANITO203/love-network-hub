import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Zap, Undo, Eye, Filter, Star, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaymentMethod } from "../types";
import { usePremium } from "@/hooks/usePremium";

interface PremiumCardProps {
  isPremium: boolean;
  premiumExpiry?: string;
  onUpgrade?: () => void;
}

const PREMIUM_FEATURES = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Boost mensuel",
    description: "Profil boosté pendant 30 min",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: "Voir qui a liké",
    description: "Accès illimité aux likes",
  },
  {
    icon: <Undo className="w-5 h-5" />,
    title: "Undo swipe",
    description: "Annule tes derniers swipes",
  },
  {
    icon: <Filter className="w-5 h-5" />,
    title: "Filtres avancés",
    description: "Filtres exclusifs premium",
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: "Superlikes illimités",
    description: "Pas de limite quotidienne",
  },
];

const PAYMENT_METHODS: { id: PaymentMethod; name: string; description: string }[] = [
  { id: "yookassa", name: "YooKassa", description: "SBP, cartes MIR / Visa / Mastercard locales" },
  { id: "cloudpayments", name: "CloudPayments", description: "MIR, Visa/Mastercard internationales" },
  { id: "mir", name: "Carte MIR", description: "Paiement direct carte MIR" },
  { id: "qiwi", name: "Qiwi", description: "Portefeuille Qiwi" },
  { id: "apple_pay", name: "Apple Pay", description: "Safari iOS" },
  { id: "google_pay", name: "Google Pay", description: "Chrome / Android" },
];

export const PremiumCard = ({ isPremium, premiumExpiry }: PremiumCardProps) => {
  const { loading: paymentLoading, products, createOrder, lastOrder } = usePremium();
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  useEffect(() => {
    if (!selectedProductId && products.length > 0) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  const expiryLabel = useMemo(() => {
    if (!premiumExpiry) return null;
    const date = new Date(premiumExpiry);
    return date.toLocaleDateString("fr-FR");
  }, [premiumExpiry]);

  const handleStartCheckout = () => {
    setShowCheckout(true);
  };

  const handlePay = async (method: PaymentMethod) => {
    if (!selectedProductId) return;
    setSelectedMethod(method);
    await createOrder(selectedProductId, method);
  };

  if (isPremium) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bento-card p-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-orange-500/20 to-pink-500/20" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Membre Premium</h2>
          </div>
          <p className="text-white/80 mb-4">
            Tu profites actuellement de tous les avantages premium.
          </p>
          {expiryLabel && (
            <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
              <p className="text-sm text-white/80">
                Expire le <span className="font-semibold text-white">{expiryLabel}</span>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bento-card p-6 relative overflow-hidden space-y-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400/20 to-pink-500/20 rounded-full blur-3xl" />
      <div className="relative space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Passer Premium</h2>
          </div>
          <p className="text-sm text-white/60">
            Boosts, likes illimités, filtres avancés et priorité dans le matching.
          </p>
        </div>

        <div className="space-y-3">
          {PREMIUM_FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-yellow-300">
                {feature.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{feature.title}</p>
                <p className="text-xs text-white/60">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-yellow-300">Choisir une offre</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => setSelectedProductId(product.id)}
                className={`rounded-xl border p-3 text-left transition ${
                  selectedProductId === product.id
                    ? "border-yellow-400 bg-yellow-400/10"
                    : "border-white/10"
                }`}
              >
                <p className="text-sm font-semibold text-white">{product.name}</p>
                <p className="text-xs text-white/60">
                  {(product.amount / 100).toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: product.currency,
                  })}
                </p>
              </button>
            ))}
          </div>
        </div>

        {!showCheckout ? (
          <Button
            className="w-full"
            onClick={handleStartCheckout}
            disabled={paymentLoading || !selectedProductId}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Voir les moyens de paiement
          </Button>
        ) : (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Choisir un moyen de paiement</h3>
            <div className="grid gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handlePay(method.id)}
                  className={`rounded-xl border p-3 text-left transition ${
                    selectedMethod === method.id
                      ? "border-yellow-400 bg-yellow-400/10"
                      : "border-white/10"
                  }`}
                  disabled={paymentLoading}
                >
                  <p className="text-sm font-semibold text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> {method.name}
                  </p>
                  <p className="text-xs text-white/60">{method.description}</p>
                </button>
              ))}
            </div>
            {lastOrder && (
              <p className="text-xs text-white/50">
                Commande #{lastOrder.id.slice(0, 8)} en attente de paiement via {lastOrder.provider}.
                Rafraîchis l'écran après validation.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
