import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useRealtimeSignalements = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("signalements-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "signalements" },
        () => {
          // Invalidate signalements query to refetch
          queryClient.invalidateQueries({ queryKey: ["signalements"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
