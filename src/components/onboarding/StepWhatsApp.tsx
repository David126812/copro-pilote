import { useState } from "react";
import { MessageSquare, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const WHATSAPP_NUMBER = "+15551852563";

interface StepWhatsAppProps {
  onNext: () => void;
}

export const StepWhatsApp = ({ onNext }: StepWhatsAppProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(WHATSAPP_NUMBER);
      setCopied(true);
      toast.success("Numéro copié !");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Impossible de copier");
    }
  };

  return (
    <div className="flex-1 px-6 py-4 overflow-y-auto">
      <h2 className="text-[18px] font-bold text-foreground mb-1">Connecter WhatsApp</h2>
      <p className="text-[13px] text-muted-foreground mb-6">Enregistrez ce numéro pour envoyer vos documents à Septrion.</p>

      {/* Instructions */}
      <div className="rounded-[14px] border border-border p-4 mb-4">
        <div className="flex items-center gap-2.5 mb-3">
          <MessageSquare className="h-5 w-5 text-green-500" />
          <h3 className="text-[14px] font-semibold text-foreground">Comment ça marche</h3>
        </div>
        <ol className="space-y-2 text-[13px] text-muted-foreground list-decimal pl-4">
          <li>Enregistrez le numéro Septrion dans vos contacts</li>
          <li>Quand vous recevez un document de copro (email, courrier...), <strong className="text-foreground">forwardez-le à Septrion sur WhatsApp</strong></li>
          <li>L'IA analyse le document et crée un signalement dans l'app</li>
        </ol>
      </div>

      {/* Phone number */}
      <div className="rounded-[14px] bg-primary/5 border border-primary/20 p-4 flex items-center justify-between mb-6">
        <div>
          <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Numéro Septrion</p>
          <p className="text-[18px] font-bold text-foreground font-mono">{WHATSAPP_NUMBER}</p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary text-[12px] font-semibold hover:bg-primary/20 transition"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copié" : "Copier"}
        </button>
      </div>

      <button
        onClick={onNext}
        className="w-full py-3.5 rounded-[12px] btn-gradient text-primary-foreground text-[15px] font-semibold"
      >
        Suivant
      </button>
    </div>
  );
};
