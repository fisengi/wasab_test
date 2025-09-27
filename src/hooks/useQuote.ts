import { useQuery } from "@tanstack/react-query";
import { fetchQuote } from "../utils/fetcher";
import { PerpQuoteResponseV2, PerpSide } from "../utils/types";

export const useQuote = (
    marketPairId: number,
    side: PerpSide,
    downPayment: bigint | undefined,
    leverage: number,
    maxSlippage: number,
    speedUp: boolean,
    chainId: number,
    isFormValid: boolean
) => {
    return useQuery<PerpQuoteResponseV2>({
        queryKey: [
            "quote",
            marketPairId,
            side,
            downPayment?.toString(),
            leverage,
            maxSlippage,
            speedUp,
            chainId,
            isFormValid,
        ],
        queryFn: () =>
            fetchQuote(
                marketPairId,
                side,
                downPayment!,
                leverage,
                maxSlippage,
                speedUp,
                chainId
            ),
        enabled:
            marketPairId !== undefined &&
            side !== undefined &&
            downPayment !== undefined &&
            leverage !== undefined &&
            maxSlippage !== undefined &&
            chainId !== undefined &&
            isFormValid,
    });
};
