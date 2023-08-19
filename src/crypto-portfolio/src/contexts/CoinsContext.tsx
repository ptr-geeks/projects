import React, { useState, createContext, useContext } from "react";
import { functions } from "../helpers/firebase";
import { useToast } from '@chakra-ui/react'
import { getToast } from "../helpers/formatters";
import { httpsCallable } from "firebase/functions";
import { useUser } from "./UserContext";
import { BullFolio } from "bullfolio-types";

interface CoinsProviderProps {
  children: React.ReactNode
}

interface CoinsContextProps {
  getAllCoins: (page: number) => Promise<BullFolio.CoinData[] | null>;
  getMarketData: () => Promise<BullFolio.MarketData | null>;
  getCoinById: (id: string) => Promise<BullFolio.CoinData | null>;
  getCoinChart: (id: string) => Promise<any>;
  getAllNfts: () => Promise<any | null>;
}

const CoinsContext = createContext<CoinsContextProps>({
  getAllCoins: (page) => new Promise(() => null),
  getMarketData: () => new Promise(() => null),
  getCoinById: (id) => new Promise(() => null),
  getCoinChart: (id) => new Promise(() => null),
  getAllNfts: () => new Promise(() => null)
});


export const CoinsProvider = ({ children }: CoinsProviderProps) => {

  const [allCoins, setAllCoins] = useState<BullFolio.CoinData[] | null>(null);
  const [marketData, setMarketData] = useState<BullFolio.MarketData | null>(null);

  const { user, userData } = useUser();
  const toast = useToast();

  const getAllCoins = async (page: number) => {
    if(!user || !userData) {
      return null;
    };

    if(allCoins?.length >= page*250) {
      return allCoins;
    }

    try{
      const getAllCoinsF = httpsCallable(functions, "getAllCoins");
      const result = await getAllCoinsF({
        page: page,
        currency: userData.baseCurrency,
      });
      const data = result.data as BullFolio.CoinData[];
      const prev = allCoins ? [...allCoins] : [];
      setAllCoins([...prev, ...data]);
      return data;
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

  const getMarketData = async () => {
    if(!user) return null;
    if(marketData) return marketData;

    try{
      const getMarketDataF = httpsCallable(functions, "getMarketData");
      const result = await getMarketDataF();
      const data = result.data as BullFolio.MarketData;
      setMarketData(data);
      return data;
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

  const getCoinById = async (id: string): Promise<BullFolio.CoinData | null> => {
    if(user && userData) {
      if(allCoins) {
        const coinToReturn = allCoins.find((element) => element.id === id);
        if(coinToReturn) {
          return coinToReturn;
        }
      }

      try{
        const getAllCoinsF = httpsCallable(functions, "getAllCoins");
        const result = await getAllCoinsF({
          ids: [id],
          currency: userData.baseCurrency,
          page: 1
        });
        const data = result.data as BullFolio.CoinData[];
        return data[0];
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
  }

  const getCoinChart = async (id: string) => {
    if(user && userData) {
      try{
        const getCoinChartF = httpsCallable(functions, "getCoinChart");
        const result = await getCoinChartF({
          ids: [id],
          includeStrategy: true
        });
        const data = result.data;
        console.log(data);
        return data;
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
  }

  const getAllNfts = async () => {
    if(user && userData) {
      try{
        const getTopNfts = httpsCallable(functions, "getTopNfts");
        const result = await getTopNfts();
        const data = result.data;
        console.log(data);
        return data;
      }catch(err){
        const error: any = err;
        const code = error.code;
        const message = error.message;
        const details = error.details;
        console.log(code, message, details);
        toast(getToast("error", "Something went wrong while getting NFTs!", message));
        return null;
      }
    }
  }

  return (
    <CoinsContext.Provider
      value={{
        getAllCoins,
        getMarketData,
        getCoinById,
        getCoinChart,
        getAllNfts
      }}
    >
      {children}
    </CoinsContext.Provider>
  );
};

export const useCoins = () => {
  return useContext(CoinsContext);
}