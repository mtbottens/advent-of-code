import React, {useContext, useState} from "react";

export interface ConfigContextType {
  session: string;
}

const ConfigContext = React.createContext<ConfigContextType | undefined>(undefined);

export interface ConfigContextProviderProps {}

export const ConfigContextProvider: React.FC<ConfigContextProviderProps> = ({
  children
}) => {

  
  return (
    <ConfigContext.Provider value={{session: "abc"}}>
      {children}  
    </ConfigContext.Provider>
  );
};

export const useConfigContext = () => {
  return useContext(ConfigContext);
}
