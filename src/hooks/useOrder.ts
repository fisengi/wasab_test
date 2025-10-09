import { fetchOrderV2 } from "../utils/fetcher";
import {
    OpenPositionRequest,
    PerpOrder,
    PerpQuoteRequestV2,
} from "../utils/types";
import { useMutation } from "@tanstack/react-query";

export const useOrder = (request: PerpQuoteRequestV2, chainId: number) => {
    return useMutation<PerpOrder<OpenPositionRequest>, Error>({
        mutationKey: ["order", request.marketId, chainId],
        mutationFn: () => fetchOrderV2(request, chainId),
    });
};
