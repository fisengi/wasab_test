import React from "react";
import { HiLightningBolt } from "react-icons/hi";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import type { Address } from "viem";
import { useTokenApproval } from "../../hooks/useTokenApproval";
import { FiAlertCircle } from "react-icons/fi";
type Props = {
    isReady: boolean;
    tokenAddress?: Address;
    tokenSymbol?: string;
    spenderAddress?: Address;
    requiredAmount?: bigint;
    insufficientBalance?: boolean;
};

export default function QuoteButton({
    isReady,
    tokenAddress,
    tokenSymbol,
    spenderAddress,
    requiredAmount,
    insufficientBalance,
}: Props) {
    const { isConnected, address } = useAppKitAccount();
    const { open } = useAppKit();

    const evmAddress: Address | undefined =
        isConnected && typeof address === "string" && address.startsWith("0x")
            ? (address as Address)
            : undefined;

    const {
        hasSufficientAllowance,
        isAllowanceLoading,
        approve,
        isApproving,
        statusText,
    } = useTokenApproval({
        token: tokenAddress,
        owner: evmAddress,
        spender: spenderAddress,
        requiredAmount,
    });

    const handleSubmitButton = () => {
        if (!isConnected) {
            open();
        } else {
            if (!isReady && !showApprove) return;
            if (showApprove) {
                approve();
                return;
            }
        }
    };

    const showApprove =
        isConnected &&
        (!hasSufficientAllowance || requiredAmount === undefined);

    const buttonBg = !isConnected
        ? "bg-[#94ff0b]"
        : insufficientBalance
        ? "bg-black"
        : isReady
        ? "bg-[#94ff0b]"
        : "bg-black";
    const buttonTextColor = !isConnected
        ? "text-black"
        : insufficientBalance
        ? "text-red-500"
        : isReady
        ? "text-black"
        : "text-[#94ff0b]";

    const buttonText = !isConnected
        ? " CONNECT AN EVM WALLET"
        : insufficientBalance
        ? "INSUFFICIENT BALANCE"
        : isApproving
        ? "GETTING APPROVAL…"
        : showApprove
        ? `APPROVE`
        : "Open Position";

    return (
        <div>
            <button
                onClick={handleSubmitButton}
                disabled={
                    isApproving || isAllowanceLoading || insufficientBalance
                }
                className={`flex justify-center items-center gap-2 w-full rounded-md border border-[#94ff0b] p-2 ${buttonBg} ${buttonTextColor} mt-4 text-sm font-semibold cursor-pointer disabled:opacity-70`}
            >
                {!isConnected && <HiLightningBolt className="h-4 w-4" />}
                {insufficientBalance && (
                    <FiAlertCircle className="h-4 w-4 text-red-500" />
                )}
                {buttonText}
            </button>
        </div>
    );
}
