import { useQuery } from "@tanstack/react-query";
import { useAppKitAccount } from "@reown/appkit/react";
import { useChainId } from "wagmi";
import { fetchPositionsPortfolio } from "../utils/fetcher";
import type { PaginatedResponse, PositionStatus } from "../utils/types";

export type UsePositionsOptions = {
    /** Refetch interval in ms for polling live updates */
    refetchIntervalMs?: number;
    /** When true, request backend to include/compute mark price for PnL */
    markPriceForPnl?: boolean;
};

export function usePositions(options?: UsePositionsOptions) {
    const { isConnected, address } = useAppKitAccount();
    const chainId = useChainId();

    const evmAddress =
        isConnected && typeof address === "string" && address.startsWith("0x")
            ? address
            : undefined;

    return useQuery<PaginatedResponse<PositionStatus>>({
        queryKey: [
            "positions",
            chainId,
            evmAddress,
            Boolean(options?.markPriceForPnl),
        ],
        queryFn: () =>
            fetchPositionsPortfolio({
                address: evmAddress,
                chainId,
                markPriceForPnl: options?.markPriceForPnl ?? true,
            }),
        enabled: Boolean(chainId && evmAddress),
        refetchInterval: options?.refetchIntervalMs ?? 5000,
        refetchOnWindowFocus: true,
    });
}
