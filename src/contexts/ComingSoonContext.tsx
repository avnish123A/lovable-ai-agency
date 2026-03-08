import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ComingSoonSettings {
  enabled: boolean;
  headline: string;
  description: string;
  launch_date: string;
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
  launch_date: "2025-04-15",
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

  const fetchSettings = async () => {
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "coming_soon_mode")
        .maybeSingle();

      if (data?.value) {
        setSettings(data.value as unknown as ComingSoonSettings);
      }
    } catch (error) {
      console.error("Error fetching coming soon settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    const channel = supabase
      .channel("coming-soon-mode-rt")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_settings",
          filter: "key=eq.coming_soon_mode",
        },
        () => fetchSettings()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
