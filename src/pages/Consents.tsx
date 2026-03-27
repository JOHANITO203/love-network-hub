import { useMemo } from "react";
import { ArrowLeft, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useConsent } from "@/hooks/useConsent";

const CONSENT_COPY: Record<
  "location" | "push" | "biometry" | "sensitiveData",
  { title: string; description: string }
> = {
  location: {
    title: "Localisation",
    description:
      "Améliore la pertinence des matches et active les rencontres à proximité. Des données anonymisées peuvent être utilisées pour le matching.",
  },
  push: {
    title: "Notifications push",
    description:
      "Recevez des alertes sur vos matches, messages et rappels clés. Indispensable pour profiter du mode temps réel.",
  },
  biometry: {
    title: "Vérification biométrique (18+)",
    description:
      "Permet d’initier la vérification d’âge via selfie + pièce d’identité. Nécessaire pour afficher le badge vérifié.",
  },
  sensitiveData: {
    title: "Données sensibles (orientation, préférences)",
    description:
      "Utilisées uniquement pour le matching et les filtres de recherche. Elles ne sont jamais partagées publiquement sans votre action.",
  },
};

export default function ConsentSettings() {
  const navigate = useNavigate();
  const { consents, updateConsent, resetConsents } = useConsent();

  const entries = useMemo(
    () =>
      Object.entries(consents).map(([key, value]) => ({
        key: key as keyof typeof consents,
        ...CONSENT_COPY[key as keyof typeof CONSENT_COPY],
        granted: value.granted,
        updatedAt: value.updatedAt,
      })),
    [consents]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-sky-50 dark:from-gray-950 dark:via-gray-900 dark:to-black">
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-border/60">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Gestion des consentements</h1>
          <div className="w-9" />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Info className="h-4 w-4 text-primary" />
              Votre contrôle, vos choix
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Modifiez vos préférences quand vous le souhaitez. Chaque modification est enregistrée localement
              et synchronisée avec nos serveurs situés en Russie conformément aux lois 152‑FZ et 242‑FZ.
            </p>
            <p>
              Certaines fonctionnalités (matching précis, notifications temps réel, vérification 18+) nécessitent
              un consentement explicite pour rester actives.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {entries.map(({ key, title, description, granted, updatedAt }) => (
            <Card key={key}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base font-semibold">{title}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>
                <Switch
                  checked={granted}
                  onCheckedChange={(checked) => {
                    void updateConsent(key, checked);
                  }}
                  aria-label={`Activer ${title}`}
                />
              </CardHeader>
              {updatedAt ? (
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Dernière mise à jour : {new Date(updatedAt).toLocaleString()}
                  </p>
                </CardContent>
              ) : null}
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-white/70 p-4 text-sm text-muted-foreground dark:bg-gray-950/50">
          <p>
            Pour exercer vos droits (suppression, portabilité, export complet), utilisez la section confidentialité de
            l’app mobile ou contactez notre équipe via settings@moydate.ru.
          </p>
          <Button variant="outline" className="self-start" onClick={() => void resetConsents()}>
            Réinitialiser tous les consentements
          </Button>
        </div>
      </main>
    </div>
  );
}
