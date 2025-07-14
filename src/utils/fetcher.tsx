import { getBaseURL } from "./constants";
import fetchData from "./fetchData";
import { Market, MarketStatsList, PaginatedResponse, PerpQuoteResponseV2, PerpSide } from "./types";

export const fetchMarketStatsList = async (
    chainId?: number,
  ): Promise<PaginatedResponse<MarketStatsList>> => {
    const params = new URLSearchParams();
    params.set("env", "test");
  
    if (chainId) {
      params.set("chainId", chainId.toString());
    }
  
    return fetchData(`https://mtpmmrxvh7.us-east-1.awsapprunner.com/markets?${params}`);
  };
  

export const fetchQuote = async (
    marketPairId: number,
    side: PerpSide,
    downPayment: bigint,
    leverage: number,
    maxSlippage: number,
    speedUp: boolean,
    chainId: number,
    existingPositionId: number | undefined,
  ): Promise<PerpQuoteResponseV2> => {
    const params = new URLSearchParams();
    params.append("marketId", marketPairId.toString());
    params.append("side", side.toUpperCase());
    params.append("downPayment", downPayment.toString());
    params.append("leverage", leverage.toString());
    params.append("maxSlippage", maxSlippage.toString());
    params.append("speedUp", speedUp.toString());
    if (existingPositionId) {
      params.append("existingPositionId", existingPositionId.toString());
    }
  
    return fetchData(`${getBaseURL(chainId)}/api/market/quote?${params}`);
  };