import { useNavigate } from "react-router-dom";
import { Calendar, FolderOpen, ArrowRight, Siren, Mic, Clock, Inbox, TrendingUp } from "lucide-react";
import { useDossiers } from "@/hooks/useDossiers";
import { useSignalements } from "@/hooks/useSignalements";
import BottomNav from "@/components/BottomNav";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: dossiers = [] } = useDossiers();
  const { data: signalements = [] } = useSignalements();
  const nouveauCount = signalements.filter((s) => s.status === "nouveau").length;

  const recentActivity = dossiers.slice(0, 4).map((d) => {
    const lastEvent = [...(d.timeline || [])].filter((t: any) => t.done).pop();
    return { id: d.id, name: d.name, sub: lastEvent?.label || d.lastAction || "", date: lastEvent?.date || d.lastUpdate };
  });

  const events = [
    { label: "Intervention plombier (Bât. B)", date: "14 fév." },
    { label: "Visite technique ascenseur", date: "20 fév." },
    { label: "AG annuelle", date: "26 fév." },
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

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <button
            onClick={() => navigate("/signaler-incident")}
            className="flex flex-col items-center gap-1.5 py-4 rounded-[14px] bg-card border border-border shadow-sm hover:border-destructive/30 transition active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Siren className="h-[18px] w-[18px] text-destructive" />
            </div>
            <span className="text-[11px] font-semibold text-foreground leading-tight text-center">Signaler un<br/>incident</span>
          </button>

          <button
            onClick={() => navigate("/dossiers")}
            className="flex flex-col items-center gap-1.5 py-4 rounded-[14px] bg-card border border-border shadow-sm hover:border-primary/30 transition active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <FolderOpen className="h-[18px] w-[18px] text-primary" />
            </div>
            <span className="text-[11px] font-semibold text-foreground leading-tight text-center">Dossiers</span>
          </button>

          <button
            onClick={() => navigate("/signalements")}
            className="flex flex-col items-center gap-1.5 py-4 rounded-[14px] bg-card border border-border shadow-sm hover:border-amber-300 transition active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center relative">
              <Inbox className="h-[18px] w-[18px] text-amber-600" />
              {nouveauCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {nouveauCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-semibold text-foreground leading-tight text-center">Signalements</span>
          </button>
        </div>

        {/* Prochains événements */}
        <section className="bg-card rounded-[14px] border border-border p-4 shadow-sm mb-3.5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-[16px] w-[16px] text-primary" />
              <h2 className="text-[13px] font-bold text-foreground">Prochains événements</h2>
            </div>
            <button onClick={() => navigate("/events")} className="text-[11px] font-semibold text-primary">
              Tout voir
            </button>
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

        {/* Activité récente */}
        <section className="bg-card rounded-[14px] border border-border p-4 shadow-sm mb-3.5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-[16px] w-[16px] text-muted-foreground" />
              <h2 className="text-[13px] font-bold text-foreground">Activité récente</h2>
            </div>
            <button onClick={() => navigate("/dossiers")} className="text-[11px] font-semibold text-primary">
              Tout voir
            </button>
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-[12px] text-muted-foreground italic py-3 text-center">Aucune activité récente</p>
          ) : (
            <div className="space-y-1">
              {recentActivity.map((u, i) => (
                <button
                  key={u.id}
                  onClick={() => navigate(`/dossiers/${u.id}`)}
                  className="w-full flex items-center gap-3 py-2.5 px-2 -mx-1 text-left hover:bg-accent rounded-xl transition"
                >
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-foreground truncate">{u.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{u.sub}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap flex-shrink-0">{u.date}</span>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
