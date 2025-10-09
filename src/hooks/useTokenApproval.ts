import { useEffect, useMemo, useRef, useState } from "react";
import { Address, maxUint256 } from "viem";
import {
    useAccount,
    useReadContract,
    useWaitForTransactionReceipt,
    useWriteContract,
    useBalance,
} from "wagmi";
import { erc20Abi } from "../utils/erc20Abi";
import toast from "react-hot-toast";
import { formatUnits } from "viem";

type UseTokenApprovalArgs = {
    token: Address | undefined;
    owner: Address | undefined;
    spender: Address | undefined;
    requiredAmount: bigint | undefined;
    approveAmount?: bigint; // default to maxUint256
};

export function useTokenApproval({
    token,
    owner,
    spender,
    requiredAmount,
    approveAmount,
}: UseTokenApprovalArgs) {
    const { isConnected } = useAccount();

    const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
        address: owner,
        query: {
            enabled: Boolean(isConnected && owner),
        },
    });

    const shouldQueryAllowance = Boolean(
        isConnected && token && owner && spender
    );

    const {
        data: allowance,
        refetch: refetchAllowance,
        isLoading: isAllowanceLoading,
    } = useReadContract({
        address: token,
        abi: erc20Abi,
        functionName: "allowance",
        args: owner && spender ? [owner, spender] : undefined,
        query: {
            enabled: shouldQueryAllowance,
        },
    });

    const required = requiredAmount ?? BigInt(0);
    const currentAllowance = (allowance as bigint | undefined) ?? BigInt(0);
    const hasSufficientAllowance = currentAllowance >= required;

    const {
        writeContract,
        writeContractAsync,
        data: hash,
        isPending: isWriting,
    } = useWriteContract();
    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        isError: isTxError,
    } = useWaitForTransactionReceipt({
        hash,
        query: {
            enabled: Boolean(hash),
        },
    });

    const [userDeclined, setUserDeclined] = useState(false);
    const [userDeclinedMessage, setUserDeclinedMessage] = useState<
        string | undefined
    >(undefined);

    const approve = async () => {
        if (!token || !spender) return;
        const value = approveAmount ?? maxUint256;
        // reset any previous decline state on a new attempt
        setUserDeclined(false);
        setUserDeclinedMessage(undefined);
        try {
            await writeContractAsync({
                address: token,
                abi: erc20Abi,
                functionName: "approve",
                args: [spender, value],
            });
        } catch (error: any) {
            const message: string =
                error?.shortMessage ||
                error?.message ||
                "Approval request declined";
            const lower = String(message).toLowerCase();
            const isRejected =
                error?.name === "UserRejectedRequestError" ||
                error?.code === 4001 ||
                lower.includes("user rejected") ||
                lower.includes("rejected") ||
                lower.includes("denied");

            if (isRejected) {
                const declineMsg = "Approval request declined";
                setUserDeclined(true);
                setUserDeclinedMessage(declineMsg);
                if (toastIdRef.current) toast.dismiss(toastIdRef.current);
                toast.error(declineMsg);
                return;
            }

            // Other failure during write
            if (toastIdRef.current) toast.dismiss(toastIdRef.current);
            toast.error("Approval failed");
        }
    };

    const isApproving = isWriting || isConfirming;

    // Toast notifications for approval lifecycle
    const toastIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (isApproving) {
            if (!toastIdRef.current) {
                toastIdRef.current = toast.loading("Allowing Token Transfers");
            }
        } else if (
            !isApproving &&
            toastIdRef.current &&
            !isConfirmed &&
            !isTxError
        ) {
            // If approval flow stopped without success or error, clear toast
            toast.dismiss(toastIdRef.current);
            toastIdRef.current = null;
        }
    }, [isApproving, isConfirmed, isTxError]);

    useEffect(() => {
        if (isConfirmed) {
            // Refresh allowance after confirmation
            refetchAllowance();
            if (toastIdRef.current) toast.dismiss(toastIdRef.current);
            toast.success("Approved");
        }
    }, [isConfirmed, refetchAllowance]);

    useEffect(() => {
        if (isTxError) {
            if (toastIdRef.current) toast.dismiss(toastIdRef.current);
            toast.error("Approval failed");
        }
    }, [isTxError]);

    const statusText = useMemo(() => {
        if (isBalanceLoading) return "Checking balance…";
        if (!shouldQueryAllowance) return undefined;
        if (isAllowanceLoading) return "Checking allowance…";
        if (userDeclined)
            return userDeclinedMessage ?? "Approval request declined";
        if (isApproving) return "GETTING APPROVAL…";
        if (isConfirmed) return "Approved";
        if (isTxError) return "Approval failed";
        return hasSufficientAllowance
            ? "Allowance sufficient"
            : `Approval needed ${balanceData?.formatted} and ${requiredAmount}`;
    }, [
        shouldQueryAllowance,
        isAllowanceLoading,
        userDeclined,
        userDeclinedMessage,
        isApproving,
        isConfirmed,
        isTxError,
        hasSufficientAllowance,
    ]);

    return {
        allowance: currentAllowance,
        hasSufficientAllowance,
        isAllowanceLoading,
        approve,
        isApproving,
        isConfirmed,
        statusText,
        refetchAllowance,
    };
}
