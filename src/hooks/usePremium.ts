import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface PremiumProduct {
  id: string;
  name: string;
  amount: number;
  currency: string;
  benefits: string[];
}

export type PaymentProvider =
  | "yookassa"
  | "cloudpayments"
  | "mir"
  | "qiwi"
  | "apple_pay"
  | "google_pay";

const FALLBACK_PRODUCTS: PremiumProduct[] = [
  {
    id: "premium-month",
    name: "Abonnement 1 mois",
    amount: 49900,
    currency: "RUB",
    benefits: ["Boost mensuel", "Likes illimités", "Filtres premium"],
  },
  {
    id: "premium-quarter",
    name: "Abonnement 3 mois",
    amount: 129900,
    currency: "RUB",
    benefits: ["Boost hebdomadaire", "Likes illimités", "Undo illimité"],
  },
];

interface PremiumOrder {
  id: string;
  status: string;
  provider: string;
  paymentUrl?: string;
}

export const usePremium = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<PremiumProduct[]>(FALLBACK_PRODUCTS);
  const [order, setOrder] = useState<PremiumOrder | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("premium_products")
        .select("id,name,amount,currency,benefits")
        .order("amount", { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) {
        setProducts(data as PremiumProduct[]);
      }
    } catch (error) {
      console.warn("[premium] loadProducts fallback", error);
      setProducts(FALLBACK_PRODUCTS);
    }
  }, []);

  const createOrder = useCallback(
    async (productId: string, provider: PaymentProvider) => {
      if (!user) {
        toast({
          title: "Connexion requise",
          description: "Connectez-vous avant de souscrire.",
          variant: "destructive",
        });
        return null;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("payments", {
          body: {
            productId,
            provider,
            userId: user.id,
          },
        });

        if (error) throw error;

        const nextOrder: PremiumOrder = {
          id: data?.orderId ?? "",
          status: "pending",
          provider,
          paymentUrl: data?.paymentUrl ?? undefined,
        };
        setOrder(nextOrder);

        if (nextOrder.paymentUrl) {
          window.open(nextOrder.paymentUrl, "_blank", "noopener");
        }

        toast({
          title: "Paiement initié",
          description: "Finalisez le paiement depuis la fenêtre ouverte.",
        });
        return nextOrder;
      } catch (error) {
        console.error("[premium] createOrder failed", error);
        toast({
          title: "Erreur",
          description: "Impossible d'initier le paiement.",
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast, user]
  );

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  return {
    loading,
    products,
    lastOrder: order,
    createOrder,
  };
};
