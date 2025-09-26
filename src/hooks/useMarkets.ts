import { useQuery } from "@tanstack/react-query";
import { fetchMarketStatsList } from "../utils/fetcher";
import { Market, MarketStatsList, PaginatedResponse } from "../utils/types";

export const useMarketStatsList = (chainId?: number) => {
    return useQuery<PaginatedResponse<MarketStatsList>>({
        queryKey: ["marketStatsList", chainId],
        queryFn: () => fetchMarketStatsList(chainId),
    });
};
