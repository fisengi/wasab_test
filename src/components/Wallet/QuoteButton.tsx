import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { HiLightningBolt } from "react-icons/hi";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import type { Address } from "viem";
import { useTokenApproval } from "../../hooks/useTokenApproval";
import { FiAlertCircle } from "react-icons/fi";
import { PerpSide } from "../../utils/types";
// fetchOrderV2 handled inside flow hook
import { useChainId } from "wagmi";
import TxProgress from "../QuoteView/TxProgress";
import { useApprovalTradeFlow } from "../../hooks/useApprovalTradeFlow";
import { PayInType, PerpQuoteRequestV2 } from "../../utils/types";
type Props = {
    isReady: boolean;
    tokenAddress?: Address;
    tokenSymbol?: string;
    spenderAddress?: Address;
    requiredAmount?: bigint;
    insufficientBalance?: boolean;
    marketId: number;
    side: PerpSide;
    leverage: number;
    maxSlippage: number;
    speedUp: boolean;
    onTradeSuccess?: () => void;
};

export default function QuoteButton({
    isReady,
    tokenAddress,
    spenderAddress,
    requiredAmount,
    insufficientBalance,
    marketId,
    side,
    leverage,
    maxSlippage,
    speedUp,
    onTradeSuccess,
}: Props) {
    const { isConnected, address } = useAppKitAccount();
    const { open } = useAppKit();

    const evmAddress: Address | undefined =
        isConnected && typeof address === "string" && address.startsWith("0x")
            ? (address as Address)
            : undefined;

    const { hasSufficientAllowance, isAllowanceLoading, approve, isApproving } =
        useTokenApproval({
            token: tokenAddress,
            owner: evmAddress,
            spender: spenderAddress,
            requiredAmount,
        });

    const chainId = useChainId();
    const flow = useApprovalTradeFlow();
    const successCalledRef = useRef<boolean>(false);

    useEffect(() => {
        if (
            flow.state.currentStep === "trade" &&
            flow.state.isSuccess &&
            !successCalledRef.current
        ) {
            successCalledRef.current = true;
            onTradeSuccess?.();
        }
        if (flow.state.isError) {
            successCalledRef.current = false;
        }
    }, [
        flow.state.currentStep,
        flow.state.isSuccess,
        flow.state.isError,
        onTradeSuccess,
    ]);

    const handleSubmitButton = async () => {
        if (!isConnected) {
            open();
        } else {
            if (!isReady && !showApprove) return;

            if (showApprove) {
                await approve();
                return;
            }

            // Build request and run flow
            if (!requiredAmount || !spenderAddress || !evmAddress) return;
            const request: PerpQuoteRequestV2 = {
                marketId,
                side,
                downPayment: requiredAmount,
                leverage,
                maxSlippage,
                speedUp,
                payInType: PayInType.TOKEN,
                address: evmAddress,
            };
            try {
                await flow.run(
                    {
                        chainId,
                        owner: evmAddress,
                        token: tokenAddress,
                        spender: spenderAddress,
                        approveAmount: requiredAmount,
                        quoteRequest: request,
                    },
                    { needsApproval: showApprove }
                );
            } catch {}
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

    const isTrading =
        flow.state.currentStep === "trade" &&
        (flow.state.isPrompting || flow.state.isPending);

    const buttonText = !isConnected
        ? " CONNECT AN EVM WALLET"
        : insufficientBalance
        ? "INSUFFICIENT BALANCE"
        : isApproving
        ? "GETTING APPROVAL…"
        : showApprove
        ? `APPROVE`
        : isTrading
        ? "OPENING…"
        : "Open Position";

    const approvalStatus = isApproving
        ? "active"
        : showApprove
        ? "idle"
        : flow.state.currentStep === "approval" && flow.state.isSuccess
        ? "success"
        : flow.state.currentStep === "approval" && flow.state.isError
        ? "error"
        : "idle";

    const tradeStatus =
        flow.state.currentStep === "trade" && flow.state.isPending
            ? "active"
            : flow.state.currentStep === "trade" && flow.state.isSuccess
            ? "success"
            : flow.state.currentStep === "trade" && flow.state.isError
            ? "error"
            : "idle";

    return (
        <div>
            <button
                onClick={handleSubmitButton}
                disabled={
                    isApproving ||
                    isAllowanceLoading ||
                    insufficientBalance ||
                    isApproving ||
                    isTrading
                }
                className={`flex justify-center items-center gap-2 w-full rounded-md border border-[#94ff0b] p-2 ${buttonBg} ${buttonTextColor} mt-4 text-sm font-semibold cursor-pointer disabled:opacity-70`}
            >
                {!isConnected && <HiLightningBolt className="h-4 w-4" />}
                {insufficientBalance && (
                    <FiAlertCircle className="h-4 w-4 text-red-500" />
                )}
                {buttonText}
            </button>
            <div className="mt-2">
                <TxProgress
                    approval={approvalStatus as any}
                    trade={tradeStatus as any}
                />
            </div>
        </div>
    );
}
