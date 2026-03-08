import { createContext, useContext, useEffect, useState, useRef, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MaintenanceSettings {
  enabled: boolean;
  message: string;
  estimated_time: string;
}

interface MaintenanceContextType {
  isMaintenanceMode: boolean;
  settings: MaintenanceSettings;
  loading: boolean;
  refetch: () => Promise<void>;
}

const defaultSettings: MaintenanceSettings = {
  enabled: false,
  message: "We are currently upgrading our platform to serve you better.",
  estimated_time: "2 hours",
};

const MaintenanceContext = createContext<MaintenanceContextType>({
  isMaintenanceMode: false,
  settings: defaultSettings,
  loading: true,
  refetch: async () => {},
});

export const useMaintenanceMode = () => useContext(MaintenanceContext);

export const MaintenanceProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<MaintenanceSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const lastValueRef = useRef<string>("");

  const fetchSettings = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "maintenance_mode")
        .maybeSingle();

      if (data?.value) {
        const raw = JSON.stringify(data.value);
        if (raw === lastValueRef.current) return;
        lastValueRef.current = raw;
        setSettings(data.value as unknown as MaintenanceSettings);
      }
    } catch (error) {
      console.error("Error fetching maintenance settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();

    const channel = supabase
      .channel("maintenance-mode-rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        (payload: any) => {
          const row = payload.new || payload.old;
          if (row?.key === "maintenance_mode") fetchSettings();
        }
      )
      .subscribe();

    // Fallback: Poll every 3 seconds
    const pollId = setInterval(fetchSettings, 3000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollId);
    };
  }, [fetchSettings]);

  return (
    <MaintenanceContext.Provider
      value={{
        isMaintenanceMode: settings.enabled,
        settings,
        loading,
        refetch: fetchSettings,
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
};

export default MaintenanceProvider;
