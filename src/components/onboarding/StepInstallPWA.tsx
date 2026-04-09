import { Smartphone } from "lucide-react";

interface StepInstallPWAProps {
  onNext: () => void;
}

export const StepInstallPWA = ({ onNext }: StepInstallPWAProps) => {
  return (
    <div className="flex-1 px-6 py-4 overflow-y-auto">
      <h2 className="text-[18px] font-bold text-foreground mb-1">Installer l'app</h2>
      <p className="text-[13px] text-muted-foreground mb-6">Ajoutez Septrion à votre écran d'accueil pour un accès rapide.</p>

      <div className="space-y-4">
        {/* iOS */}
        <div className="rounded-[14px] border border-border p-4">
          <div className="flex items-center gap-2.5 mb-3">
            <Smartphone className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-[14px] font-semibold text-foreground">iPhone / iPad</h3>
          </div>
          <ol className="space-y-2 text-[13px] text-muted-foreground list-decimal pl-4">
            <li>Appuyez sur le bouton <strong className="text-foreground">Partager</strong> (carré avec flèche)</li>
            <li>Faites défiler et appuyez sur <strong className="text-foreground">"Sur l'écran d'accueil"</strong></li>
            <li>Confirmez en appuyant sur <strong className="text-foreground">"Ajouter"</strong></li>
          </ol>
        </div>

        {/* Android */}
        <div className="rounded-[14px] border border-border p-4">
          <div className="flex items-center gap-2.5 mb-3">
            <Smartphone className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-[14px] font-semibold text-foreground">Android</h3>
          </div>
          <ol className="space-y-2 text-[13px] text-muted-foreground list-decimal pl-4">
            <li>Appuyez sur le menu <strong className="text-foreground">⋮</strong> (trois points en haut à droite)</li>
            <li>Appuyez sur <strong className="text-foreground">"Installer l'application"</strong></li>
            <li>Confirmez l'installation</li>
          </ol>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full py-3.5 rounded-[12px] btn-gradient text-primary-foreground text-[15px] font-semibold mt-6"
      >
        C'est fait
      </button>
    </div>
  );
};
