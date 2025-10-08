import React from "react";
import { useAppKitAccount, useAppKit } from "@reown/appkit/react";
import { useBalance } from "wagmi";
import type { Address } from "viem";
import { HiLightningBolt } from "react-icons/hi";

import { useIsMobile } from "../../hooks/useMediaQuery";

import { formatUnits } from "viem";
import { useUsdcBalance } from "../../hooks/useUsdcBalance";

export default function ConnectButton() {
    const { address, isConnected } = useAppKitAccount();
    const { open } = useAppKit();

    const isMobile = useIsMobile();

    const evmAddress: Address | undefined =
        isConnected && typeof address === "string" && address.startsWith("0x")
            ? (address as Address)
            : undefined;

    const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
        address: evmAddress,
        query: {
            enabled: Boolean(isConnected && evmAddress),
        },
    });

    const { formatted, symbol } = useUsdcBalance(evmAddress);

    console.log("formatted", formatted);
    console.log("symbol", symbol);

    const displayAddress =
        isConnected && typeof address === "string" ? address : undefined;

    return (
        <div className="flex items-center justify-between w-full">
            {/* Left: Address + Balance (only after connection) */}
            {!isMobile && (
                <div className="flex items-center">
                    {isConnected && (
                        <div className="flex flex-col items-start gap-2 px-2 py-1 rounded  text-white text-sm">
                            <span className="font-mono tracking-tight">
                                Address:{" "}
                                {displayAddress || String(evmAddress || "")}
                            </span>

                            <span className="tabular-nums">
                                {isBalanceLoading
                                    ? "Loading…"
                                    : balanceData
                                    ? `Balance: ${formatUnits(
                                          balanceData.value,
                                          balanceData.decimals
                                      )} ${balanceData.symbol}`
                                    : "-"}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Right: AppKit button + Disconnect */}
            <div className="flex items-center gap-2">
                {isConnected ? (
                    <>
                        <appkit-button />
                    </>
                ) : (
                    <button
                        onClick={() => open()}
                        className="group px-2 py-1 rounded border border-[#94ff0b] text-sm text-white font-semibold flex items-center gap-1 hover:bg-[#94ff0b] hover:text-black"
                    >
                        <HiLightningBolt className="h-4 w-4 text-[#94ff0b] group-hover:text-black" />
                        CONNECT WALLET
                    </button>
                )}
            </div>
        </div>
    );
}
