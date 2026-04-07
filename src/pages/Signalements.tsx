import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Inbox, Clock, AlertTriangle, CheckCircle2, XCircle, FileText, User, ChevronDown, ChevronUp } from "lucide-react";
import { useSignalements, useQualifySignalement, Signalement } from "@/hooks/useSignalements";
import BottomNav from "@/components/BottomNav";

const urgencyColors: Record<string, { bg: string; text: string; label: string }> = {
  normal: { bg: "bg-blue-50", text: "text-blue-700", label: "Normal" },
  urgent: { bg: "bg-orange-50", text: "text-orange-700", label: "Urgent" },
  critique: { bg: "bg-red-50", text: "text-red-700", label: "Critique" },
};

const statusConfig: Record<string, { bg: string; text: string; label: string; icon: any }> = {
  nouveau: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", label: "Nouveau", icon: Inbox },
  qualifie: { bg: "bg-green-50 border-green-200", text: "text-green-700", label: "Qualifié", icon: CheckCircle2 },
  rejete: { bg: "bg-gray-50 border-gray-200", text: "text-gray-500", label: "Rejeté", icon: XCircle },
};

const SignalementCard = ({ signalement, onQualify }: { signalement: Signalement; onQualify: (s: Signalement, action: "qualifie" | "rejete") => void }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const urgency = urgencyColors[signalement.urgency] || urgencyColors.normal;
  const status = statusConfig[signalement.status] || statusConfig.nouveau;
  const StatusIcon = status.icon;
  const date = new Date(signalement.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`rounded-[14px] border p-4 ${signalement.status === "nouveau" ? "bg-card border-amber-200" : "bg-card border-border opacity-70"}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1">
          <h3 className="text-[14px] font-semibold text-foreground leading-snug">{signalement.name}</h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${urgency.bg} ${urgency.text}`}>
              <AlertTriangle className="h-2.5 w-2.5" />
              {urgency.label}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${status.bg} ${status.text}`}>
              <StatusIcon className="h-2.5 w-2.5" />
              {status.label}
            </span>
          </div>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="p-1">
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-2">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {date}
        </div>
        {signalement.sender_name && (
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {signalement.sender_name}
          </div>
        )}
        {signalement.document_url && (
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Document joint
          </div>
        )}
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="mt-3 space-y-3">
          {signalement.summary && (
            <div className="rounded-[10px] bg-secondary p-3">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Résumé IA</p>
              <p className="text-[13px] text-foreground leading-relaxed">{signalement.summary}</p>
            </div>
          )}
          {signalement.next_step && (
            <div className="rounded-[10px] bg-primary/5 border border-primary/10 p-3">
              <p className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-1">Action recommandée</p>
              <p className="text-[13px] text-foreground leading-relaxed">{signalement.next_step}</p>
            </div>
          )}

          {/* Actions */}
          {signalement.status === "nouveau" && (
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => onQualify(signalement, "qualifie")}
                className="flex-1 py-2.5 rounded-[10px] bg-primary text-primary-foreground text-[13px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition"
              >
                <CheckCircle2 className="h-4 w-4" />
                Créer le dossier
              </button>
              <button
                onClick={() => onQualify(signalement, "rejete")}
                className="py-2.5 px-4 rounded-[10px] bg-secondary border border-border text-muted-foreground text-[13px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition"
              >
                <XCircle className="h-4 w-4" />
                Rejeter
              </button>
            </div>
          )}

          {signalement.status === "qualifie" && signalement.dossier_id && (
            <button
              onClick={() => navigate(`/dossiers/${signalement.dossier_id}`)}
              className="w-full py-2.5 rounded-[10px] bg-green-50 border border-green-200 text-green-700 text-[13px] font-semibold flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              Voir le dossier créé
            </button>
          )}
        </div>
      )}
    </div>
  );
};

type FilterValue = "tous" | "nouveau" | "qualifie" | "rejete";

const Signalements = () => {
  const navigate = useNavigate();
  const { data: signalements = [], isLoading } = useSignalements();
  const qualify = useQualifySignalement();
  const [filter, setFilter] = useState<FilterValue>("tous");

  const nouveauCount = signalements.filter((s) => s.status === "nouveau").length;

  const filtered = filter === "tous" ? signalements : signalements.filter((s) => s.status === filter);

  const handleQualify = (signalement: Signalement, action: "qualifie" | "rejete") => {
    qualify.mutate({ signalement, action });
  };

  const filters: { label: string; value: FilterValue; count?: number }[] = [
    { label: "Tous", value: "tous" },
    { label: "Nouveaux", value: "nouveau", count: nouveauCount },
    { label: "Qualifiés", value: "qualifie" },
    { label: "Rejetés", value: "rejete" },
  ];

  return (
    <div className="bg-card flex flex-col" style={{ minHeight: "calc(812px - 54px)" }}>
      <div className="flex-1 px-5 pb-4 pt-5">
        {/* Header */}
        <div className="mb-5">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1 text-[13px] text-muted-foreground font-medium hover:text-foreground transition mb-3"
          >
            <ArrowLeft className="h-5 w-5" />
            Retour
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
              <Inbox className="h-[18px] w-[18px] text-amber-600" />
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-foreground">Signalements</h1>
              <p className="text-[12px] text-muted-foreground">
                {nouveauCount > 0 ? `${nouveauCount} en attente de qualification` : "Aucun signalement en attente"}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 mb-5 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-[6px] rounded-full text-[11px] font-semibold transition ${
                filter === f.value
                  ? "bg-foreground text-card"
                  : "bg-card text-muted-foreground border border-border"
              }`}
            >
              {f.label}
              {f.count !== undefined && f.count > 0 && (
                <span className="ml-1 inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {isLoading && <p className="text-center text-sm text-muted-foreground py-10">Chargement…</p>}

        {/* List */}
        <div className="space-y-3">
          {filtered.map((s) => (
            <SignalementCard key={s.id} signalement={s} onQualify={handleQualify} />
          ))}
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-12">
              <Inbox className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Aucun signalement</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Signalements;
