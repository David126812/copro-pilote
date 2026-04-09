import { FileText, ArrowRight, FolderOpen } from "lucide-react";

interface StepExplicationProps {
  onNext: () => void;
}

export const StepExplication = ({ onNext }: StepExplicationProps) => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 text-center">
      {/* Flow illustration */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <FileText className="h-7 w-7 text-primary" />
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground" />
        <div className="w-14 h-14 rounded-2xl btn-gradient flex items-center justify-center">
          <span className="text-primary-foreground text-[18px] font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>S</span>
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground" />
        <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
          <FolderOpen className="h-7 w-7 text-green-500" />
        </div>
      </div>

      <h2 className="text-[20px] font-bold text-foreground mb-2">
        Comment ça marche
      </h2>
      <p className="text-[14px] text-muted-foreground mb-10 max-w-[280px]">
        Envoyez vos documents, l'IA les organise pour vous en dossiers structurés.
      </p>

      <button
        onClick={onNext}
        className="w-full max-w-sm py-3.5 rounded-[12px] btn-gradient text-primary-foreground text-[15px] font-semibold"
      >
        Suivant
      </button>
    </div>
  );
};
