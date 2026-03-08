import { createContext, useContext, useEffect, useState, useRef, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ComingSoonSettings {
  enabled: boolean;
  headline: string;
  description: string;
  countdown_days: number;
  countdown_hours: number;
  countdown_minutes: number;
  countdown_target: string;
}

interface ComingSoonContextType {
  isComingSoonMode: boolean;
  settings: ComingSoonSettings;
  loading: boolean;
  refetch: () => Promise<void>;
}

const defaultSettings: ComingSoonSettings = {
  enabled: false,
  headline: "Something Powerful is Coming",
  description: "We're building the future of financial comparison. Be the first to know.",
  countdown_days: 30,
  countdown_hours: 0,
  countdown_minutes: 0,
  countdown_target: new Date(Date.now() + 30 * 86400000).toISOString(),
};

const ComingSoonContext = createContext<ComingSoonContextType>({
  isComingSoonMode: false,
  settings: defaultSettings,
  loading: true,
  refetch: async () => {},
});

export const useComingSoonMode = () => useContext(ComingSoonContext);

export const ComingSoonProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<ComingSoonSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const lastValueRef = useRef<string>("");

  const fetchSettings = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "coming_soon_mode")
        .maybeSingle();

      if (data?.value) {
        const raw = JSON.stringify(data.value);
        // Only update state if value actually changed
        if (raw === lastValueRef.current) return;
        lastValueRef.current = raw;

        const val = data.value as Record<string, unknown>;
        let target = val.countdown_target as string | undefined;
        if (!target && val.launch_date) {
          target = new Date((val.launch_date as string) + "T00:00:00").toISOString();
        }
        setSettings({
          enabled: !!val.enabled,
          headline: (val.headline as string) || defaultSettings.headline,
          description: (val.description as string) || defaultSettings.description,
          countdown_days: (val.countdown_days as number) ?? 30,
          countdown_hours: (val.countdown_hours as number) ?? 0,
          countdown_minutes: (val.countdown_minutes as number) ?? 0,
          countdown_target: target || defaultSettings.countdown_target,
        });
      }
    } catch (error) {
      console.error("Error fetching coming soon settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();

    // Primary: Realtime subscription
    const channel = supabase
      .channel("coming-soon-mode-rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        (payload: any) => {
          const row = payload.new || payload.old;
          if (row?.key === "coming_soon_mode") fetchSettings();
        }
      )
      .subscribe();

    // Fallback: Poll every 3 seconds in case realtime misses events
    const pollId = setInterval(fetchSettings, 3000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollId);
    };
  }, [fetchSettings]);

  return (
    <ComingSoonContext.Provider
      value={{
        isComingSoonMode: settings.enabled,
        settings,
        loading,
        refetch: fetchSettings,
      }}
    >
      {children}
    </ComingSoonContext.Provider>
  );
};

export default ComingSoonProvider;
