import React, { useState, createContext, useContext } from "react";
import { functions } from "../helpers/firebase";
import { useToast } from '@chakra-ui/react'
import { getToast } from "../helpers/formatters";
import { httpsCallable } from "firebase/functions";
import { useUser } from "./UserContext";
import { BullFolio } from "bullfolio-types";

interface PortfolioProviderProps {
  children: React.ReactNode
}

interface PortfolioContextProps {
  getPortfolioData: (bundleId: string) => Promise<any>;
}

const PortfolioContext = createContext<PortfolioContextProps>({
  getPortfolioData: (bundleId) => new Promise(() => null)
});


export const PortfolioProvider = ({ children }: PortfolioProviderProps) => {

  const [portfolioData, setPortfolioData] = useState<any>(null);

  const { user, userData } = useUser();
  const toast = useToast();

  const getPortfolioData = async (bundleId: string) => {
    if(!user) {
      return null;
    };

    if(portfolioData) {
      if(portfolioData[bundleId]) {
        return portfolioData[bundleId];
      }
    }

    try{
      const getPortfolioDataF = httpsCallable(functions, "getPortfolioData");
      const result = await getPortfolioDataF({
        addresses: userData.addressBundles[bundleId].addresses,
        id: bundleId
      });
      const data = result.data;
      const prev = {...portfolioData};
      prev[bundleId] = data;
      setPortfolioData(prev);
      return data as any;
    }catch(err){
      const error: any = err;
      const code = error.code;
      const message = error.message;
      const details = error.details;
      console.log(code, message, details);
      toast(getToast("error", "Something went wrong while getting coins!", message));
      return null;
    }
  }

  return (
    <PortfolioContext.Provider
      value={{
        getPortfolioData
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  return useContext(PortfolioContext);
}