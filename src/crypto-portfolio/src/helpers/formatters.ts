import { UseToastOptions } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { BullFolio } from "bullfolio-types";
import { links } from "./links";

export const getToast = (
  type: "success"|"error"|"info"|"warning",
  title: string,
  message: string
): UseToastOptions => {
  return {
    duration: type==="success" ? 2000 : 4000,
    status: type,
    title: title,
    description: message,
    isClosable: true,
    position: "bottom-right"
  }
};

export const getEllipsisTxt = (str: string, n = 6) => {
  if (str) {
    return `${str.substr(0, n)}...${str.substr(str.length - n, str.length)}`;
  }
  return "";
};

export function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
};

export const getCurrencySymbol = (currency: BullFolio.MainCurrencies) => {
  if(currency==="usd") return "$";
  if(currency==="eur") return "€";
  if(currency==="jpy") return "¥";
  if(currency==="btc") return "₿";
  if(currency==="eth") return "Ξ";
};

export const createLinkForCoin = (id: string) => {
  return `${links.coinPage}?coinId=${id}`;
};

export const generateUID = () => {
  const uid = crypto.randomUUID();
  return uid;
};

export const stringToHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

export const generateHexColorFromString = (inputString: string) => {
  const hash = stringToHash(inputString);
  const color = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - color.length) + color;
};

export const chainIdToTicker = (id: string) => {
  switch(id) {
    case "0x1": return "ETH";
    case "0x38": return "BNB";
    case "0x89": return "MATIC";
    case "0xa4b1": return "ARB";
    case "0xa86a": return "AVAX";
    case "0xfa": return "FTM";
    default: return "ETH";
  }
};

export const getChainName = (id: string) => {
  switch(id) {
    case "0x1": return "Ethereum";
    case "0x38": return "BNB Chain";
    case "0x89": return "Polygon";
    case "0xa4b1": return "Arbitrum";
    case "0xa86a": return "Avalanche";
    case "0xfa": return "Fantom";
    default: return "Ethereum";
  }
};

export const chainIdToTokenId = (id: string) => {
  switch(id) {
    case "0x1": return "ethereum";
    case "0x38": return "binancecoin";
    case "0x89": return "matic-network";
    case "0xa4b1": return "arbitrum";
    case "0xa86a": return "avalanche-2";
    case "0xfa": return "fantom";
    default: return "ethereum";
  }
};

export const getChainLogoById = (id: string) => {
  switch(id) {
    case "0x1": return "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880";
    case "0x38": return "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850";
    case "0x89": return "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912";
    case "0xa4b1": return "https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg?1680097630";
    case "0xa86a": return "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png?1670992574";
    case "0xfa": return "https://assets.coingecko.com/coins/images/4001/large/Fantom_round.png?1669652346";
    default: return "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880";
  }
};

export const getChainExplorer = (id: string) => {
  switch(id) {
    case "0x1": return "https://etherscan.io/";
    case "0x38": return "https://bscscan.com/";
    case "0x89": return "https://polygonscan.com/";
    case "0xa4b1": return "https://arbiscan.io/";
    case "0xa86a": return "https://snowtrace.io/";
    case "0xfa": return "https://ftmscan.com/";
    default: return "https://etherscan.io/";
  }
};
