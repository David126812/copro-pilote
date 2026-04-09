import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Send, Upload, Sparkles, X, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

const locationOptions = [
  "Parking", "Hall d'entrée", "Ascenseur", "Escalier", "Façade",
  "Toiture", "Parties communes", "Cave / Sous-sol", "Jardin / Extérieur", "Autre",
];

const SignalerIncident = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = title.trim().length > 0;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Check 10MB limit
    if (selected.size > 10 * 1024 * 1024) {
      toast.error("Le fichier dépasse 10MB");
      return;
    }

    setFile(selected);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyzeIA = async () => {
    if (!file) return;
    setAnalyzing(true);

    try {
      // Upload file to Supabase Storage
      const ext = file.name.split(".").pop() || "bin";
      const path = `documents/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("Copro bucket")
        .upload(path, file, { contentType: file.type });

      if (uploadError) {
        toast.error("Erreur lors de l'upload du fichier");
        setAnalyzing(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("Copro bucket").getPublicUrl(path);

      // Call analyze-document Edge Function
      const { data, error } = await supabase.functions.invoke("analyze-document", {
        body: { document_url: urlData.publicUrl, mime_type: file.type },
      });

      if (error || !data?.success) {
        toast.error("Erreur d'analyse IA — vous pouvez remplir manuellement");
        setAnalyzing(false);
        return;
      }

      // Pre-fill fields
      if (data.data.name) setTitle(data.data.name);
      if (data.data.location) setLocation(data.data.location);
      if (data.data.summary) setDescription(data.data.summary);

      toast.success("Champs pré-remplis par l'IA");
    } catch {
      toast.error("Erreur de connexion");
    }

    setAnalyzing(false);
  };

  const handleSubmit = async () => {
    if (!canSubmit || !user) return;
    setLoading(true);

    try {
      // Get user's copro_id
      const { data: profile } = await supabase
        .from("profiles")
        .select("copro_id")
        .eq("id", user.id)
        .single();

      // Upload file if present and not already uploaded by IA analysis
      let documentUrl: string | undefined;
      if (file) {
        const path = `documents/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("Copro bucket")
          .upload(path, file, { contentType: file.type });

        if (!uploadError) {
          const { data: urlData } = supabase.storage.from("Copro bucket").getPublicUrl(path);
          documentUrl = urlData.publicUrl;
        }
      }

      // Insert signalement
      const { error } = await supabase.from("signalements").insert({
        name: title.trim(),
        urgency: "normal",
        location: location || null,
        summary: description.trim() || null,
        next_step: "À qualifier par le conseil syndical",
        document_url: documentUrl || null,
        status: "nouveau",
        copro_id: profile?.copro_id || null,
        raw_analysis: null,
      });

      if (error) {
        toast.error("Erreur lors de la création du signalement");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setTimeout(() => navigate("/signalements"), 1500);
    } catch {
      toast.error("Erreur de connexion");
    }

    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="bg-card px-5 pb-6 pt-5 flex flex-col items-center justify-center min-h-[600px]">
        <div className="w-16 h-16 rounded-full bg-[hsl(145_63%_36%/0.1)] flex items-center justify-center mb-4">
          <Send className="h-7 w-7 text-[hsl(145_63%_36%)]" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-1">Signalement créé !</h2>
        <p className="text-[13px] text-muted-foreground text-center">Votre signalement a été ajouté à l'inbox.</p>
      </div>
    );
  }

  return (
    <div className="bg-card px-5 pb-6 pt-5">
      {/* Header */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-[13px] text-muted-foreground font-medium mb-3 hover:text-foreground transition"
      >
        <ArrowLeft className="h-5 w-5" />
        Retour
      </button>
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-lg bg-[hsl(4_74%_57%/0.1)] flex items-center justify-center">
          <AlertTriangle className="h-[18px] w-[18px] text-[hsl(4_74%_48%)]" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Signaler un incident</h1>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1.5 block">
            Titre de l'incident *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex : Fuite d'eau au 3ème étage"
            className="w-full rounded-[10px] border border-border bg-secondary px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            maxLength={100}
          />
        </div>

        {/* Location */}
        <div>
          <label className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1.5 block">
            Localisation
          </label>
          <div className="flex flex-wrap gap-1.5">
            {locationOptions.map((loc) => (
              <button
                key={loc}
                onClick={() => setLocation(location === loc ? "" : loc)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition ${
                  location === loc
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-foreground border-border hover:border-primary/30"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1.5 block">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez l'incident en détail…"
            rows={3}
            className="w-full rounded-[10px] border border-border bg-secondary px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            maxLength={500}
          />
        </div>

        {/* File upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {!file ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 rounded-[10px] border-2 border-dashed border-border text-muted-foreground flex items-center justify-center gap-2 hover:border-primary/30 transition"
          >
            <Upload className="h-4 w-4" />
            <span className="text-[12px] font-medium">Ajouter un fichier (PDF, image)</span>
          </button>
        ) : (
          <div className="rounded-[10px] border border-border bg-secondary p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-[12px] text-foreground font-medium truncate max-w-[200px]">{file.name}</span>
              </div>
              <button onClick={handleRemoveFile} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleAnalyzeIA}
              disabled={analyzing}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/10 text-primary text-[12px] font-semibold hover:bg-primary/20 transition disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              {analyzing ? "Analyse en cours..." : "Analyser avec l'IA"}
            </button>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          className="w-full py-3.5 rounded-[12px] btn-gradient text-primary-foreground text-[15px] font-semibold flex items-center justify-center gap-2 transition disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
          {loading ? "Envoi..." : "Envoyer le signalement"}
        </button>
      </div>
    </div>
  );
};

export default SignalerIncident;
