import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Sparkles, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const SEED_DOSSIERS = [
  {
    name: "Ascenseur bâtiment C — panne récurrente",
    status: "bloque",
    urgency: "critique",
    responsible: "",
    next_step: "Relancer syndic + ascensoriste",
    last_action: "3ème panne signalée, syndic non réactif",
    blocage_reason: "Pièce détachée en commande chez OTIS — délai 3 semaines",
    created_via_agent: false,
    timeline: [
      { date: "10 déc.", label: "1ère panne signalée", done: true },
      { date: "22 déc.", label: "Réparation temporaire", done: true },
      { date: "28 jan.", label: "3ème panne — ascenseur bloqué 4h", done: true },
      { date: "—", label: "Relance syndic + assurance", done: false },
    ],
    documents: [{ name: "Historique_pannes.pdf", type: "Rapport" }],
    prestataires: [{ name: "OTIS Ascenseurs", devisStatus: "en_attente" }],
    syndic_history: [],
  },
  {
    name: "Ravalement façade",
    status: "en_cours",
    urgency: "normal",
    responsible: "",
    next_step: "Vote AG — 3 devis à comparer",
    last_action: "3ème devis reçu",
    created_via_agent: false,
    timeline: [
      { date: "10 déc.", label: "Étude préalable lancée", done: true },
      { date: "15 jan.", label: "1er devis reçu (BTP Rénov)", done: true },
      { date: "28 jan.", label: "2ème devis reçu (Façade Pro)", done: true },
      { date: "4 fév.", label: "3ème devis reçu (Bâti France)", done: true },
      { date: "—", label: "Présentation AG", done: false },
    ],
    documents: [
      { name: "Devis_BTP_Renov.pdf", type: "Devis" },
      { name: "Devis_Facade_Pro.pdf", type: "Devis" },
      { name: "Devis_Bati_France.pdf", type: "Devis" },
    ],
    prestataires: [
      { name: "BTP Rénov", devisStatus: "recu", montant: "45 000 €" },
      { name: "Façade Pro", devisStatus: "recu", montant: "52 000 €" },
      { name: "Bâti France", devisStatus: "recu", montant: "48 500 €" },
    ],
    syndic_history: [],
  },
  {
    name: "Éclairage hall défectueux",
    status: "termine",
    urgency: "normal",
    responsible: "",
    next_step: "—",
    last_action: "Intervention terminée",
    created_via_agent: false,
    timeline: [
      { date: "20 jan.", label: "Signalement copropriétaire", done: true },
      { date: "23 jan.", label: "Électricien sollicité", done: true },
      { date: "28 jan.", label: "Intervention effectuée", done: true },
      { date: "1 fév.", label: "Clôture dossier", done: true },
    ],
    documents: [{ name: "Facture_electricien.pdf", type: "Facture" }],
    prestataires: [{ name: "Elec Express", devisStatus: "recu", montant: "320 €" }],
    syndic_history: [],
  },
];

export const StepPremierDoc = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const insertSeedDossiers = async () => {
    if (!user) return;

    // Get user's copro_id
    const { data: profile } = await supabase
      .from("profiles")
      .select("copro_id")
      .eq("id", user.id)
      .single();

    if (!profile?.copro_id) return;

    // Check if seed dossiers already exist for this copro
    const { data: existing } = await supabase
      .from("dossiers")
      .select("id")
      .eq("copro_id", profile.copro_id)
      .limit(1);

    if (existing && existing.length > 0) return; // Already seeded

    // Insert seed dossiers with copro_id
    for (const seed of SEED_DOSSIERS) {
      await supabase.from("dossiers").insert({
        ...seed,
        copro_id: profile.copro_id,
      });
    }
  };

  const completeOnboarding = async () => {
    await insertSeedDossiers();
  };

  const handleUpload = () => {
    toast.info("Upload de document — sélectionnez un fichier");
    completeOnboarding();
    navigate("/signalements");
  };

  const handleExample = async () => {
    setLoading(true);
    await completeOnboarding();

    // Create a dummy signalement
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("copro_id")
        .eq("id", user.id)
        .single();

      if (profile?.copro_id) {
        await supabase.from("signalements").insert({
          name: "Fuite d'eau parking souterrain",
          urgency: "urgent",
          location: "Parking souterrain — Niveau -1",
          summary: "Fuite d'eau constatée au niveau -1 du parking, près de la place 42. L'eau semble provenir d'une canalisation au plafond. Risque de dégât sur les véhicules stationnés.",
          next_step: "Contacter un plombier en urgence",
          status: "nouveau",
          copro_id: profile.copro_id,
          raw_analysis: null,
        });
      }
    }

    toast.success("Document exemple analysé !");
    setLoading(false);
    navigate("/signalements");
  };

  const handleExplore = async () => {
    setLoading(true);
    await completeOnboarding();
    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="flex-1 px-6 py-4 flex flex-col">
      <h2 className="text-[18px] font-bold text-foreground mb-1">Votre premier document</h2>
      <p className="text-[13px] text-muted-foreground mb-6">Testez Septrion avec un document ou explorez d'abord l'app.</p>

      <div className="space-y-3 flex-1">
        {/* Option 1: Upload */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-[14px] border border-border bg-card hover:border-primary/30 transition active:scale-[0.98] text-left disabled:opacity-50"
        >
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Upload className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-foreground">Uploader un document</p>
            <p className="text-[12px] text-muted-foreground">PDF, image — l'IA l'analyse pour vous</p>
          </div>
        </button>

        {/* Option 2: Example */}
        <button
          onClick={handleExample}
          disabled={loading}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-[14px] border border-border bg-card hover:border-primary/30 transition active:scale-[0.98] text-left disabled:opacity-50"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-5 w-5 text-amber-500" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-foreground">Utiliser un document exemple</p>
            <p className="text-[12px] text-muted-foreground">Découvrez le résultat sans partager vos fichiers</p>
          </div>
        </button>

        {/* Option 3: Explore */}
        <button
          onClick={handleExplore}
          disabled={loading}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-[14px] border border-transparent hover:bg-accent transition active:scale-[0.98] text-left disabled:opacity-50"
        >
          <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-medium text-muted-foreground">Explorer d'abord</p>
            <p className="text-[12px] text-muted-foreground">Découvrez l'app avec des dossiers de démonstration</p>
          </div>
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="ml-2 text-[13px] text-muted-foreground">Préparation de votre espace...</span>
        </div>
      )}
    </div>
  );
};
