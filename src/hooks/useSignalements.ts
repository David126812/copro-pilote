import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface Signalement {
  id: string;
  name: string;
  urgency: string;
  summary: string;
  next_step: string;
  sender_name: string | null;
  sender_phone: string | null;
  document_url: string | null;
  status: "nouveau" | "qualifie" | "rejete";
  dossier_id: string | null;
  copro_id: string | null;
  location: string | null;
  raw_analysis: any;
  created_at: string;
}

export function useSignalements() {
  return useQuery({
    queryKey: ["signalements"],
    queryFn: async (): Promise<Signalement[]> => {
      const { data, error } = await supabase
        .from("signalements")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useQualifySignalement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ signalement, action }: { signalement: Signalement; action: "qualifie" | "rejete" }) => {
      if (action === "qualifie") {
        const dateLabel = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
        const documents = signalement.document_url
          ? [{ name: signalement.document_url.split("/").pop() || "Document", type: "WhatsApp" }]
          : [];

        // Create dossier with copro_id
        const { data: dossier, error: dossierError } = await supabase.from("dossiers").insert({
          name: signalement.name,
          status: "en_cours",
          urgency: signalement.urgency,
          responsible: "",
          next_step: signalement.next_step || "",
          last_action: signalement.summary || "",
          created_via_agent: true,
          copro_id: signalement.copro_id,
          timeline: [{
            date: dateLabel,
            label: `Signalement${signalement.sender_name ? ` (${signalement.sender_name})` : ""}`,
            done: true,
          }],
          documents,
          prestataires: [],
          syndic_history: [],
        }).select("id").single();

        if (dossierError) throw dossierError;

        // Update signalement
        const { error } = await supabase.from("signalements")
          .update({ status: "qualifie", dossier_id: dossier.id })
          .eq("id", signalement.id);
        if (error) throw error;

        return dossier.id;
      } else {
        // Reject
        const { error } = await supabase.from("signalements")
          .update({ status: "rejete" })
          .eq("id", signalement.id);
        if (error) throw error;
        return null;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["signalements"] });
      queryClient.invalidateQueries({ queryKey: ["dossiers"] });
    },
  });
}

export function useAttachSignalement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ signalementId, dossierId }: { signalementId: string; dossierId: string }) => {
      // Update signalement to point to dossier
      const { error } = await supabase.from("signalements")
        .update({ status: "qualifie" as const, dossier_id: dossierId })
        .eq("id", signalementId);
      if (error) throw error;

      // Add timeline event to dossier
      const { data: dossier } = await supabase.from("dossiers").select("timeline").eq("id", dossierId).single();
      const timeline = dossier?.timeline || [];
      const dateLabel = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
      timeline.push({ date: dateLabel, label: "Nouveau signalement rattaché", done: true });

      await supabase.from("dossiers").update({ timeline }).eq("id", dossierId);

      return dossierId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["signalements"] });
      queryClient.invalidateQueries({ queryKey: ["dossiers"] });
    },
  });
}

export function useUpdateDossierStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dossierId, newStatus }: { dossierId: string; newStatus: "en_cours" | "bloque" | "termine" }) => {
      // Add timeline event
      const { data: dossier } = await supabase.from("dossiers").select("timeline").eq("id", dossierId).single();
      const timeline = dossier?.timeline || [];
      const dateLabel = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
      const statusLabels = { en_cours: "Dossier remis en cours", bloque: "Dossier marqué bloqué", termine: "Dossier terminé" };
      timeline.push({ date: dateLabel, label: statusLabels[newStatus], done: true });

      const { error } = await supabase.from("dossiers")
        .update({ status: newStatus, timeline })
        .eq("id", dossierId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dossiers"] });
    },
  });
}
