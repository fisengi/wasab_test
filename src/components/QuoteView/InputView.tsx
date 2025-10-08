import React, { useEffect, useMemo } from "react";
import { Token, MarketStats, PerpQuoteResponseV2 } from "../../utils/types";
import { useAppKitAccount } from "@reown/appkit/react";
import { useBalance } from "wagmi";
import { Address, formatUnits } from "viem";
import { useUsdcBalance } from "../../hooks/useUsdcBalance";

type Props = {
    CARD_MIN_H: string;
    setIsInsufficientBalance: (isInsufficientBalance: boolean) => void;
    amountInput: string;
    setAmountInput: (amountInput: string) => void;
    tokenStats: Token;
    quote: PerpQuoteResponseV2;
    isLoading: boolean;
};

export default function InputView({
    CARD_MIN_H,
    setIsInsufficientBalance,
    amountInput,
    setAmountInput,
    tokenStats,
    quote,
    isLoading,
}: Props) {
    const { address, isConnected } = useAppKitAccount();
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

    const downPaymentNum = Number.parseFloat(amountInput);
    const tokenUsdPrice =
        quote?.swapResponse.tokenToUsdPrice[tokenStats.address];
    const amountUsd =
        !Number.isNaN(downPaymentNum) && tokenUsdPrice !== undefined
            ? downPaymentNum * tokenUsdPrice
            : undefined;
    const amountUsdFormatted =
        amountUsd !== undefined
            ? new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 2,
              }).format(amountUsd)
            : "";

    const isInsufficientBalance = useMemo(() => {
        // Compare user input (in token units) with user's formatted balance for that token
        if (!amountInput || Number.isNaN(downPaymentNum) || downPaymentNum <= 0)
            return false;

        // USDC balance comes from custom hook already formatted as a decimal string
        if (tokenStats.symbol === "USDC") {
            const usdcFormatted = formatted ? Number(formatted) : 0;
            return downPaymentNum > usdcFormatted;
        }

        // For non-USDC (e.g., WETH), use wagmi balance and formatUnits to compare in human units
        const decimals = balanceData?.decimals ?? 0;
        const value = balanceData?.value as bigint | undefined;
        if (value == null) return false;
        const humanReadable = Number(formatUnits(value, decimals));
        if (Number.isNaN(humanReadable)) return false;
        return downPaymentNum > humanReadable;
    }, [
        amountInput,
        downPaymentNum,
        tokenStats.symbol,
        formatted,
        balanceData?.value,
        balanceData?.decimals,
    ]);

    useEffect(() => {
        setIsInsufficientBalance(isInsufficientBalance ?? false);
    }, [isInsufficientBalance]);

    return (
        <label
            className={`relative text-red-500 flex justify-between items-center ${CARD_MIN_H} rounded-md border border-[#62666a] p-3 focus-within:border-[#94ff0b] focus-within:ring-2 focus-within:ring-[#94ff0b]/30`}
        >
            <div className="flex flex-col justify-between min-w-0">
                <span className="text-gray-300 text-lg">Pay</span>
                <div className="relative flex-1">
                    <input
                        inputMode="decimal"
                        placeholder="0"
                        className="h-14 w-full text-3xl text-white
bg-transparent border-0 outline-none shadow-none
focus:outline-none focus:ring-0 focus:border-0 appearance-none
placeholder-gray-300 caret-white"
                        value={amountInput}
                        onChange={(e) => {
                            const nextValue = e.target.value;
                            if (
                                nextValue === "" ||
                                /^\d*\.?\d*$/.test(nextValue)
                            ) {
                                setAmountInput(nextValue);
                            }
                        }}
                    />
                </div>
                <span
                    className={`text-gray-300 text-sm ${
                        isLoading ? "blur-sm" : ""
                    }`}
                >
                    {quote ? amountUsdFormatted : "$0.00"}
                </span>
            </div>

            <div className="font-medium flex items-center border border-[#62666a] rounded-full px-2 py-1 shrink-0">
                <div className="flex items-center mr-2">
                    <img
                        src={tokenStats.imageUrl}
                        alt=""
                        className="h-6 w-6 rounded-full ring-2 ring-[#0c0e13] relative z-1 flex-none"
                    />
                </div>
                <div className=" text-white ">{tokenStats.symbol}</div>
            </div>
            <div className="text-gray-500 text-xs bottom-2 absolute right-2 ">
                Balance:{" "}
                {tokenStats.symbol === "USDC" &&
                    formatted &&
                    Number(formatted).toLocaleString("de-DE")}{" "}
                {tokenStats.symbol === "WETH" &&
                    formatUnits(
                        balanceData?.value as bigint,
                        balanceData?.decimals ?? 0
                    )}{" "}
                <span className="text-[#94ff0b] text-xs">Max</span>
            </div>
        </label>
    );
}
