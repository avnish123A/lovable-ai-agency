import { createContext, useContext, useEffect, useState, ReactNode } from "react";
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

  const fetchSettings = async () => {
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "maintenance_mode")
        .maybeSingle();

      if (data?.value) {
        setSettings(data.value as unknown as MaintenanceSettings);
      }
    } catch (error) {
      console.error("Error fetching maintenance settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    // Realtime subscription for instant updates
    const channel = supabase
      .channel("maintenance-mode-rt")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_settings",
          filter: "key=eq.maintenance_mode",
        },
        () => fetchSettings()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
