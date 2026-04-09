import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

interface StepProfilProps {
  onNext: () => void;
}

export const StepProfil = ({ onNext }: StepProfilProps) => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [coproName, setCoproName] = useState("");
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [notificationConsent, setNotificationConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = firstName.trim().length > 0 && coproName.trim().length > 0 && whatsappPhone.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit || !user) return;
    setLoading(true);

    try {
      // Create or find copropriete
      let copro_id: string;

      const { data: existingCopro } = await supabase
        .from("coproprietes")
        .select("id")
        .eq("name", coproName.trim())
        .maybeSingle();

      if (existingCopro) {
        copro_id = existingCopro.id;
      } else {
        const { data: newCopro, error: coproError } = await supabase
          .from("coproprietes")
          .insert({ name: coproName.trim() })
          .select("id")
          .single();

        if (coproError || !newCopro) {
          toast.error("Erreur lors de la création de la copropriété");
          setLoading(false);
          return;
        }
        copro_id = newCopro.id;
      }

      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: firstName.trim(),
          copro_id,
          whatsapp_phone: whatsappPhone.trim(),
          notification_consent: notificationConsent,
        })
        .eq("id", user.id);

      if (profileError) {
        toast.error("Erreur lors de la sauvegarde du profil");
        setLoading(false);
        return;
      }

      onNext();
    } catch {
      toast.error("Erreur de connexion au serveur");
    }

    setLoading(false);
  };

  return (
    <div className="flex-1 px-6 py-4 overflow-y-auto">
      <h2 className="text-[18px] font-bold text-foreground mb-1">Votre profil</h2>
      <p className="text-[13px] text-muted-foreground mb-5">Ces informations personnalisent votre expérience.</p>

      <div className="space-y-3.5">
        {/* Prénom */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Prénom *</label>
          <input
            type="text"
            placeholder="Votre prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full py-3 px-3.5 rounded-[10px] border border-border bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>

        {/* Copropriété */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Nom de votre copropriété *</label>
          <input
            type="text"
            placeholder="Ex : Résidence Les Jardins du Parc"
            value={coproName}
            onChange={(e) => setCoproName(e.target.value)}
            className="w-full py-3 px-3.5 rounded-[10px] border border-border bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>

        {/* Numéro WhatsApp */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Numéro WhatsApp *</label>
          <input
            type="tel"
            placeholder="+33 6 12 34 56 78"
            value={whatsappPhone}
            onChange={(e) => setWhatsappPhone(e.target.value)}
            className="w-full py-3 px-3.5 rounded-[10px] border border-border bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
          <p className="text-[11px] text-muted-foreground mt-1">Ce numéro sera lié à votre compte pour recevoir et envoyer des documents via WhatsApp.</p>
        </div>

        {/* Opt-in notifications */}
        <label className="flex items-start gap-3 py-2 cursor-pointer">
          <input
            type="checkbox"
            checked={notificationConsent}
            onChange={(e) => setNotificationConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
          />
          <span className="text-[13px] text-muted-foreground leading-snug">
            J'accepte de recevoir des notifications par WhatsApp et email concernant mes dossiers
          </span>
        </label>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          className="w-full py-3.5 rounded-[12px] btn-gradient text-primary-foreground text-[15px] font-semibold disabled:opacity-40 mt-2"
        >
          {loading ? "Enregistrement..." : "Suivant"}
        </button>
      </div>
    </div>
  );
};
