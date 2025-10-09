import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import type { Address, Hash } from "viem";
import {
    useWaitForTransactionReceipt,
    useWriteContract,
    useSendTransaction,
} from "wagmi";
import { erc20Abi } from "../utils/erc20Abi";
import { fetchOrderV2 } from "../utils/fetcher";
import type { PerpQuoteRequestV2 } from "../utils/types";
import { getTxUrl } from "../utils/explorer";
import { notify, type NotifyId } from "../utils/notify";

export type FlowStep = "approval" | "trade";

export type FlowState = {
    currentStep: FlowStep | undefined;
    approvalHash?: Hash;
    tradeHash?: Hash;
    isPrompting: boolean;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    errorMessage?: string;
};

export type ApprovalTradeArgs = {
    // EVM details
    chainId: number;
    owner?: Address;
    token?: Address;
    spender?: Address;
    approveAmount?: bigint;
    // Trading backend details
    quoteRequest: PerpQuoteRequestV2;
};

/**
 * Orchestrates a two-step flow: ERC20 approve (if needed) -> trade contract call.
 * Displays toast notifications with explorer links and exposes hashes.
 */
export function useApprovalTradeFlow() {
    const { writeContractAsync } = useWriteContract();
    const { sendTransactionAsync } = useSendTransaction();
    const [state, setState] = useState<FlowState>({
        currentStep: undefined,
        isPrompting: false,
        isPending: false,
        isSuccess: false,
        isError: false,
    });

    const toastIdRef = useRef<NotifyId | undefined>(undefined);
    const chainIdRef = useRef<number | undefined>(undefined);

    const [approvalHash, setApprovalHash] = useState<Hash | undefined>(
        undefined
    );
    const [tradeHash, setTradeHash] = useState<Hash | undefined>(undefined);

    const approvalWait = useWaitForTransactionReceipt({
        hash: approvalHash,
        query: { enabled: Boolean(approvalHash) },
    });
    const tradeWait = useWaitForTransactionReceipt({
        hash: tradeHash,
        query: { enabled: Boolean(tradeHash) },
    });

    useEffect(() => {
        if (!approvalHash) return;
        if (approvalWait.isLoading) {
            setState((s) => ({
                ...s,
                currentStep: "approval",
                isPending: true,
            }));
            if (!toastIdRef.current)
                toastIdRef.current = notify.loading("Approval pending…");
        } else if (approvalWait.isSuccess) {
            const url = getTxUrl(chainIdRef.current, approvalHash);
            if (toastIdRef.current) {
                notify.resolveSuccess(
                    toastIdRef.current,
                    "Approval confirmed",
                    url ? { linkUrl: url, linkLabel: "View tx" } : undefined
                );
                toastIdRef.current = undefined;
            }
            setState((s) => ({ ...s, isPending: false }));
        } else if (approvalWait.isError) {
            const url = getTxUrl(chainIdRef.current, approvalHash);
            if (toastIdRef.current) {
                notify.resolveError(
                    toastIdRef.current,
                    "Approval failed",
                    url ? { linkUrl: url, linkLabel: "View tx" } : undefined
                );
                toastIdRef.current = undefined;
            }
            setState((s) => ({
                ...s,
                isPending: false,
                isError: true,
                errorMessage: "Approval failed",
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        approvalWait.isLoading,
        approvalWait.isSuccess,
        approvalWait.isError,
        approvalHash,
    ]);

    useEffect(() => {
        if (!tradeHash) return;
        if (tradeWait.isLoading) {
            setState((s) => ({ ...s, currentStep: "trade", isPending: true }));
            if (!toastIdRef.current)
                toastIdRef.current = notify.loading("Trade pending…");
        } else if (tradeWait.isSuccess) {
            const url = getTxUrl(chainIdRef.current, tradeHash);
            if (toastIdRef.current) {
                notify.resolveSuccess(
                    toastIdRef.current,
                    "Trade confirmed",
                    url ? { linkUrl: url, linkLabel: "View tx" } : undefined
                );
                console.log("trade confirmed url", url);
                toastIdRef.current = undefined;
            }
            setState((s) => ({ ...s, isPending: false, isSuccess: true }));
        } else if (tradeWait.isError) {
            const url = getTxUrl(chainIdRef.current, tradeHash);
            if (toastIdRef.current) {
                notify.resolveError(
                    toastIdRef.current,
                    "Trade failed",
                    url ? { linkUrl: url, linkLabel: "View tx" } : undefined
                );
                toastIdRef.current = undefined;
            }
            setState((s) => ({
                ...s,
                isPending: false,
                isError: true,
                errorMessage: "Trade failed",
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        tradeWait.isLoading,
        tradeWait.isSuccess,
        tradeWait.isError,
        tradeHash,
    ]);

    const run = useCallback(
        async (
            args: ApprovalTradeArgs,
            options?: { needsApproval: boolean }
        ) => {
            const { chainId, token, spender, approveAmount, quoteRequest } =
                args;
            chainIdRef.current = chainId;
            setState((s) => ({
                ...s,
                isError: false,
                errorMessage: undefined,
            }));

            try {
                // Step 1: Approval (optional)
                if (options?.needsApproval && token && spender) {
                    setState((s) => ({
                        ...s,
                        currentStep: "approval",
                        isPrompting: true,
                    }));
                    const aHash = (await writeContractAsync({
                        address: token,
                        abi: erc20Abi,
                        functionName: "approve",
                        args: [spender, approveAmount!],
                    })) as Hash;
                    setApprovalHash(aHash);
                    setState((s) => ({
                        ...s,
                        isPrompting: false,
                        isPending: true,
                        approvalHash: aHash,
                    }));
                    toastIdRef.current = notify.loading("Approval pending…");
                }

                // Step 2: Get order data from backend (show pending on button)
                setState((s) => ({
                    ...s,
                    currentStep: "trade",
                    isPending: true,
                }));
                const order = await fetchOrderV2(quoteRequest, args.chainId);

                // Step 3: Execute trade call
                setState((s) => ({ ...s, isPrompting: true }));
                const tHash = (await sendTransactionAsync({
                    to: order.callData.to as Address,
                    data: order.callData.data as `0x${string}`,
                    value: order.callData.value as bigint,
                })) as Hash;
                setTradeHash(tHash);
                setState((s) => ({
                    ...s,
                    isPrompting: false,
                    isPending: true,
                    tradeHash: tHash,
                }));
                const id =
                    toastIdRef.current ?? notify.loading("Trade pending…");
                toastIdRef.current = id;

                // Return hashes to caller for optional separate wait hooks
                return { approvalHash, tradeHash: tHash } as {
                    approvalHash?: Hash;
                    tradeHash: Hash;
                };
            } catch (err: any) {
                const lower = String(
                    err?.shortMessage || err?.message || ""
                ).toLowerCase();
                const isRejected =
                    err?.name === "UserRejectedRequestError" ||
                    err?.code === 4001 ||
                    lower.includes("user rejected") ||
                    lower.includes("rejected") ||
                    lower.includes("denied");
                const message = isRejected
                    ? "User rejected"
                    : err?.shortMessage || err?.message || "Transaction failed";
                setState((s) => ({
                    ...s,
                    isError: true,
                    isPending: false,
                    isPrompting: false,
                    errorMessage: message,
                }));
                notify.error(message);
                throw err;
            }
        },
        [writeContractAsync, sendTransactionAsync, approvalHash]
    );

    const setConfirmed = useCallback(
        (chainId: number, which: FlowStep, hash?: Hash) => {
            const url = getTxUrl(chainId, hash);
            if (toastIdRef.current) {
                notify.resolveSuccess(
                    toastIdRef.current,
                    which === "approval"
                        ? "Approval confirmed"
                        : "Trade confirmed",
                    url ? { linkUrl: url, linkLabel: "View tx" } : undefined
                );
                toastIdRef.current = undefined;
            } else {
                notify.success(
                    which === "approval"
                        ? "Approval confirmed"
                        : "Trade confirmed",
                    url ? { linkUrl: url, linkLabel: "View tx" } : undefined
                );
            }
            setState((s) => ({ ...s, isPending: false, isSuccess: true }));
        },
        []
    );

    const reset = useCallback(() => {
        setState({
            currentStep: undefined,
            isPrompting: false,
            isPending: false,
            isSuccess: false,
            isError: false,
            errorMessage: undefined,
        });
        if (toastIdRef.current) notify.dismiss(toastIdRef.current);
        toastIdRef.current = undefined;
    }, []);

    return useMemo(
        () => ({ state, run, setConfirmed, reset }),
        [state, run, setConfirmed, reset]
    );
}
