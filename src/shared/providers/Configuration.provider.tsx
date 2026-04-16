import React, { createContext, useContext, ReactNode } from "react";
import {
  useConfiguration,
  ExtendedConfigurationDto,
} from "@shared/hooks/useConfiguration";

type ConfigurationContextType = {
  config: ExtendedConfigurationDto | undefined;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
};

const ConfigurationContext = createContext<
  ConfigurationContextType | undefined
>(undefined);

export const ConfigurationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const configurationData = useConfiguration();

  return (
    <ConfigurationContext.Provider value={configurationData}>
      {children}
    </ConfigurationContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigurationContext);
  if (!context) {
    throw new Error("useConfig must be used within ConfigurationProvider");
  }
  return context;
};
