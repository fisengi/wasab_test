import { useReadContract } from "wagmi";
import type { Address } from "viem";
import { useAppKitAccount } from "@reown/appkit/react";
import { erc20Abi } from "../utils/erc20Abi";
import { TEST_USDC } from "../utils/constants";
import { useMemo } from "react";
import { formatUnits } from "viem";

export const useUsdcBalance = (evmAddress: Address | undefined) => {
    const { isConnected } = useAppKitAccount();
    const tokenAddress = TEST_USDC as Address;

    const { data: raw } = useReadContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: evmAddress ? [evmAddress] : undefined,
        query: { enabled: Boolean(isConnected && evmAddress) },
    });

    const { data: decimals } = useReadContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "decimals",
    });

    const { data: symbol } = useReadContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "symbol",
    });

    const formatted = useMemo(() => {
        if (raw == null || decimals == null) return undefined;
        try {
            return formatUnits(raw as bigint, decimals as number);
        } catch {
            return undefined;
        }
    }, [raw, decimals]);

    return { formatted, symbol: symbol as string };
};
