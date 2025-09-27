import { useQuery } from "@tanstack/react-query";
import { fetchQuote } from "../utils/fetcher";
import { PerpQuoteResponseV2, PerpSide } from "../utils/types";

export const useQuote = (
    marketPairId: number,
    side: PerpSide,
    downPayment: bigint,
    leverage: number,
    maxSlippage: number,
    speedUp: boolean,
    chainId: number
) => {
    return useQuery<PerpQuoteResponseV2>({
        queryKey: [
            "quote",
            marketPairId,
            side,
            downPayment,
            leverage,
            maxSlippage,
            speedUp,
            chainId,
        ],
        queryFn: () =>
            fetchQuote(
                marketPairId,
                side,
                downPayment,
                leverage,
                maxSlippage,
                speedUp,
                chainId
            ),
        enabled:
            !!marketPairId &&
            !!side &&
            !!downPayment &&
            !!leverage &&
            !!maxSlippage &&
            !!speedUp &&
            !!chainId,
    });
};
