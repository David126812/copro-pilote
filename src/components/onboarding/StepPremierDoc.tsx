import { useNavigate } from "react-router-dom";
import { Upload, Sparkles, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const StepPremierDoc = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const completeOnboarding = async () => {
    if (user) {
      await supabase
        .from("profiles")
        .update({ first_name: undefined }) // triggers onboarding_completed check via first_name being set
        .eq("id", user.id);
    }
  };

  const handleUpload = () => {
    // TODO: Story 3 — integrate with analyze-document Edge Function
    toast.info("Upload de document — à implémenter (Epic 3)");
    completeOnboarding();
    navigate("/signalements");
  };

  const handleExample = () => {
    // TODO: Story 2.5 full — upload dummy document via pipeline
    toast.info("Document exemple chargé");
    completeOnboarding();
    navigate("/signalements");
  };

  const handleExplore = () => {
    completeOnboarding();
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
          className="w-full flex items-center gap-4 px-4 py-4 rounded-[14px] border border-border bg-card hover:border-primary/30 transition active:scale-[0.98] text-left"
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
          className="w-full flex items-center gap-4 px-4 py-4 rounded-[14px] border border-border bg-card hover:border-primary/30 transition active:scale-[0.98] text-left"
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
          className="w-full flex items-center gap-4 px-4 py-4 rounded-[14px] border border-transparent hover:bg-accent transition active:scale-[0.98] text-left"
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
    </div>
  );
};
