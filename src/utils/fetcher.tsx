import { getBaseURL } from "./constants";
import fetchData from "./fetchData";
import { Market, MarketStatsList, OpenPositionRequest, PaginatedResponse, PerpOrder, PerpQuoteRequestV2, PerpQuoteResponseV2, PerpSide } from "./types";

export const fetchMarketStatsList = async (
    chainId?: number,
  ): Promise<PaginatedResponse<MarketStatsList>> => {
    const params = new URLSearchParams();
    params.set("env", "test");
  
    if (chainId) {
      params.set("chainId", chainId.toString());
    }
  
    return fetchData(`https://test-gateway.wasabi.xyz/markets?${params}`);
  };
  

export const fetchQuote = async (
    marketPairId: number,
    side: PerpSide,
    downPayment: bigint,
    leverage: number,
    maxSlippage: number,
    speedUp: boolean,
    chainId: number
  ): Promise<PerpQuoteResponseV2> => {
    const params = new URLSearchParams();
    params.append("marketId", marketPairId.toString());
    params.append("side", side.toUpperCase());
    params.append("downPayment", downPayment.toString());
    params.append("leverage", leverage.toString());
    params.append("maxSlippage", maxSlippage.toString());
    params.append("speedUp", speedUp.toString());
    return fetchData(`${getBaseURL(chainId)}/api/market/quote?${params}`);
  };


// export const fetchOrderV2 = async (
//   request: PerpQuoteRequestV2,
//   chainId: number,
// ): Promise<PerpOrder<OpenPositionRequest>> => {
  // return await postData(`${getBaseURL(chainId)}/api/v2/order/open`, {
  //   ...request,
  //   side: request.side.toUpperCase(),
  // });
  // send post request
// };
