import { useNavigate } from "react-router-dom";
import { Calendar, ArrowRight, Siren, Mic, Clock, Inbox } from "lucide-react";
import { useDossiers } from "@/hooks/useDossiers";
import { useSignalements } from "@/hooks/useSignalements";
import BottomNav from "@/components/BottomNav";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: dossiers = [] } = useDossiers();
  const { data: signalements = [] } = useSignalements();
  const nouveauCount = signalements.filter((s) => s.status === "nouveau").length;

  const activeDossiers = dossiers.filter((d) => d.status !== "termine");
  const blockedDossiers = dossiers.filter((d) => d.status === "bloque");
  const termineDossiers = dossiers.filter((d) => d.status === "termine");

  const events = [
    { label: "Intervention plombier (Bât. B)", date: "14 fév." },
    { label: "Visite technique ascenseur", date: "20 fév." },
    { label: "AG annuelle", date: "26 fév." },
  ];

  const updates = [
    { label: "Devis ascensoriste transmis au syndic", date: "il y a 4 j" },
    { label: "Diagnostic ascenseur : carte mère HS", date: "il y a 6 j" },
    { label: "Bon de commande plomberie validé", date: "il y a 1 sem." },
    { label: "Signalement éclairage couloir Bât. B", date: "il y a 2 sem." },
  ];

  return (
    <div className="bg-card flex flex-col" style={{ minHeight: "calc(812px - 54px)" }}>
      <div className="flex-1 px-5 pb-4 pt-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[12px] text-muted-foreground mb-0.5">Résidence Les Jardins du Parc</p>
            <h1 className="text-[26px] font-bold text-foreground">Bonjour Marie</h1>
          </div>
          <div className="w-10 h-10 rounded-full btn-gradient flex items-center justify-center" onClick={() => navigate("/settings")}>
            <span className="text-primary-foreground text-[13px] font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>ML</span>
          </div>
        </div>

        {/* Voice Agent card */}
        <button
          onClick={() => navigate("/voice-agent")}
          className="w-full rounded-[16px] border border-primary/20 bg-gradient-to-r from-primary/[0.06] to-primary/[0.02] p-4 mb-5 text-left hover:border-primary/40 transition active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl btn-gradient flex items-center justify-center flex-shrink-0">
              <Mic className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-[14px] font-bold text-foreground">Parler à l'assistant</h2>
              <p className="text-[11px] text-muted-foreground">Décrivez un problème, je gère le reste</p>
            </div>
            <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
          </div>
        </button>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <button
            onClick={() => navigate("/dossiers")}
            className="rounded-[12px] bg-primary/5 border border-primary/10 p-3 text-center hover:border-primary/30 transition active:scale-[0.97]"
          >
            <p className="text-[20px] font-bold text-primary">{activeDossiers.length}</p>
            <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">En cours</p>
          </button>
          <button
            onClick={() => navigate("/dossiers")}
            className="rounded-[12px] bg-[hsl(28_87%_52%/0.06)] border border-[hsl(28_87%_52%/0.12)] p-3 text-center hover:border-[hsl(28_87%_52%/0.3)] transition active:scale-[0.97]"
          >
            <p className="text-[20px] font-bold text-[hsl(28_87%_40%)]">{blockedDossiers.length}</p>
            <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">Bloqués</p>
          </button>
          <button
            onClick={() => navigate("/dossiers")}
            className="rounded-[12px] bg-[hsl(145_63%_42%/0.05)] border border-[hsl(145_63%_42%/0.1)] p-3 text-center hover:border-[hsl(145_63%_42%/0.3)] transition active:scale-[0.97]"
          >
            <p className="text-[20px] font-bold text-[hsl(145_63%_36%)]">{termineDossiers.length}</p>
            <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">Résolus</p>
          </button>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <button
            onClick={() => navigate("/signaler-incident")}
            className="flex items-center gap-3 py-3.5 px-4 rounded-[14px] bg-card border border-border shadow-sm hover:border-destructive/30 transition active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <Siren className="h-[18px] w-[18px] text-destructive" />
            </div>
            <span className="text-[12px] font-semibold text-foreground leading-tight">Signaler un incident</span>
          </button>
          <button
            onClick={() => navigate("/signalements")}
            className="flex items-center gap-3 py-3.5 px-4 rounded-[14px] bg-card border border-border shadow-sm hover:border-amber-300 transition active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0 relative">
              <Inbox className="h-[18px] w-[18px] text-amber-600" />
              {nouveauCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {nouveauCount}
                </span>
              )}
            </div>
            <span className="text-[12px] font-semibold text-foreground leading-tight">Signalements</span>
          </button>
        </div>

        {/* Prochains événements */}
        <section className="bg-card rounded-[14px] border border-border p-4 shadow-sm mb-3.5">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-[16px] w-[16px] text-primary" />
            <h2 className="text-[13px] font-bold text-foreground">Prochains événements</h2>
          </div>
          <div className="space-y-1">
            {events.map((ev, i) => (
              <div
                key={i}
                className={`flex items-center justify-between py-2.5 px-2 -mx-1 rounded-xl ${i > 0 ? "border-t border-border" : ""}`}
              >
                <span className="text-[12px] font-medium text-foreground">{ev.label}</span>
                <span className="text-[11px] text-muted-foreground font-medium whitespace-nowrap ml-3">{ev.date}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Dernières mises à jour */}
        <section className="bg-card rounded-[14px] border border-border p-4 shadow-sm mb-3.5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-[16px] w-[16px] text-muted-foreground" />
            <h2 className="text-[13px] font-bold text-foreground">Dernières mises à jour</h2>
          </div>
          <div className="space-y-1">
            {updates.map((u, i) => (
              <div
                key={i}
                className={`flex items-center justify-between py-2.5 px-2 -mx-1 rounded-xl ${i > 0 ? "border-t border-border" : ""}`}
              >
                <span className="text-[12px] font-medium text-foreground">{u.label}</span>
                <span className="text-[11px] text-muted-foreground font-medium whitespace-nowrap ml-3">{u.date}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
