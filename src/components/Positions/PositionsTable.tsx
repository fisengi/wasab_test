import React, { useMemo, useState, useCallback } from "react";
import { usePositions } from "../../hooks/usePositions";
import type { PositionStatus } from "../../utils/types";
import { useChainId } from "wagmi";
import { getAddressUrl } from "../../utils/explorer";
import TxProgress from "../QuoteView/TxProgress";
import { notify } from "../../utils/notify";
import { formatUnits } from "viem";
import { formatStat } from "../../utils/formatStat";

type Props = {
    /** Polling interval in ms */
    refetchIntervalMs?: number;
};

type ModalState =
    | { type: "none" }
    | { type: "close"; row: PositionStatus }
    | { type: "modify"; row: PositionStatus };

const numberOrDash = (n: number | undefined | null, digits = 2) =>
    Number.isFinite(n as number) ? (n as number).toFixed(digits) : "-";

const pnlClass = (pnl: number) =>
    pnl > 0 ? "text-green-400" : pnl < 0 ? "text-red-400" : "text-gray-300";

const Row = React.memo(function Row({
    row,
    onClose,
    onModify,
}: {
    row: PositionStatus;
    onClose: (r: PositionStatus) => void;
    onModify: (r: PositionStatus) => void;
}) {
    const side = row.position.side.toUpperCase();
    const size = row.position.principal; // base token size
    const entry = row.position.entryPrice;
    const current = row.markPrice;
    const leverage = row.position.leverage;
    const netValue = row.netValue;
    const sideSign = row.position.side === "long" ? 1 : -1;
    const liquidationPrice = row.liquidationPrice;
    const pnlNum =
        Number.isFinite(current) &&
        Number.isFinite(entry) &&
        Number.isFinite(size)
            ? (current - entry) * size * sideSign
            : NaN;

    const leverageColor = side === "LONG" ? "text-[#54a665]" : "text-[#a84441]";
    const collateral = row.position.collateralAmountRaw;

    return (
        <tr className="border-b border-gray-800 hover:bg-gray-900/50">
            <td className="px-3 py-2 whitespace-nowrap text-sm flex items-center">
                <div className="flex items-center mr-2">
                    <img
                        src={row.market.pair.baseToken.imageUrl}
                        alt=""
                        className="h-6 w-6 rounded-full ring-2 ring-[#0c0e13] relative z-1"
                    />

                    <img
                        src={row.market.pair.quoteToken.imageUrl}
                        alt=""
                        className="h-6 w-6 rounded-full ring-2 ring-[#0c0e13] -ml-1.5"
                    />
                </div>
                <div className="flex flex-col">
                    <div className={leverageColor}>
                        {leverage}x {side}
                    </div>
                    <div className="flex items-center">
                        <div className="text-white ">
                            {row.market.pair.baseToken.symbol}
                        </div>
                        <div className=" text-gray-400">
                            -{row.market.pair.quoteToken.symbol}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-3 py-2 whitespace-nowrap text-sm">
                {formatStat(
                    Number(
                        formatUnits(
                            netValue,
                            row.market.pair.quoteToken.decimals
                        )
                    ),
                    row.market.pair.quoteToken.symbol
                )}
            </td>
            <td className="px-3 py-2 whitespace-nowrap text-sm">
                {formatStat(entry, row.market.pair.quoteToken.symbol)} /{" "}
                {formatStat(current, row.market.pair.quoteToken.symbol)}
            </td>
            <td className="px-3 py-2 whitespace-nowrap text-sm">
                {formatStat(
                    liquidationPrice,
                    row.market.pair.quoteToken.symbol
                )}
            </td>
            <td className="px-3 py-2 whitespace-nowrap text-sm">
                {" "}
                {Number(
                    formatUnits(collateral, row.market.pair.baseToken.decimals)
                ).toLocaleString("de-DE", {
                    maximumFractionDigits: 4,
                })}{" "}
                {row.market.pair.baseToken.symbol}
            </td>
        </tr>
    );
});

const MobileRow = React.memo(function MobileRow({
    row,
}: {
    row: PositionStatus;
}) {
    const side = row.position.side.toUpperCase();
    const entry = row.position.entryPrice;
    const current = row.markPrice;
    const leverage = row.position.leverage;
    const netValue = row.netValue;
    const liquidationPrice = row.liquidationPrice;
    const collateral = row.position.collateralAmountRaw;
    const leverageColor = side === "LONG" ? "text-[#54a665]" : "text-[#a84441]";

    return (
        <div className="border border-gray-800 rounded-md p-3 mb-2 ">
            <div className="flex items-center">
                <div className="flex items-center mr-2">
                    <img
                        src={row.market.pair.baseToken.imageUrl}
                        alt=""
                        className="h-6 w-6 rounded-full ring-2 ring-[#0c0e13] relative z-1"
                    />
                    <img
                        src={row.market.pair.quoteToken.imageUrl}
                        alt=""
                        className="h-6 w-6 rounded-full ring-2 ring-[#0c0e13] -ml-1.5"
                    />
                </div>
                <div className="flex flex-col">
                    <div className={leverageColor}>
                        {leverage}x {side}
                    </div>
                    <div className="flex items-center">
                        <div className="text-white ">
                            {row.market.pair.baseToken.symbol}
                        </div>
                        <div className=" text-gray-400">
                            -{row.market.pair.quoteToken.symbol}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs ">
                <div className="flex justify-between col-span-2">
                    <span className="text-gray-400">Value</span>
                    <span className="text-right">
                        {formatStat(
                            Number(
                                formatUnits(
                                    netValue,
                                    row.market.pair.quoteToken.decimals
                                )
                            ),
                            row.market.pair.quoteToken.symbol
                        )}
                    </span>
                </div>
                <div className="flex justify-between col-span-2 ">
                    <span className="text-gray-400">Entry / Mark Price</span>
                    <span className="text-right">
                        {formatStat(entry, row.market.pair.quoteToken.symbol)} /{" "}
                        {formatStat(current, row.market.pair.quoteToken.symbol)}
                    </span>
                </div>
                <div className="flex justify-between col-span-2">
                    <span className="text-gray-400">Liq Price</span>
                    <span className="text-right">
                        {formatStat(
                            liquidationPrice,
                            row.market.pair.quoteToken.symbol
                        )}
                    </span>
                </div>
                <div className="flex justify-between col-span-2">
                    <span className="text-gray-400">Size</span>
                    <span className="text-right">
                        {Number(
                            formatUnits(
                                collateral,
                                row.market.pair.baseToken.decimals
                            )
                        ).toLocaleString("de-DE", {
                            maximumFractionDigits: 4,
                        })}{" "}
                        {row.market.pair.baseToken.symbol}
                    </span>
                </div>
            </div>
        </div>
    );
});

export default function PositionsTable({ refetchIntervalMs }: Props) {
    const chainId = useChainId();
    const { data, isLoading, isError, refetch, isRefetching } = usePositions({
        refetchIntervalMs: refetchIntervalMs ?? 3000,
        markPriceForPnl: true,
    });

    console.log("data mı ", data);
    const [modal, setModal] = useState<ModalState>({ type: "none" });

    const items = useMemo(() => data?.items ?? [], [data?.items]);

    const onClose = useCallback((r: PositionStatus) => {
        setModal({ type: "close", row: r });
    }, []);
    const onModify = useCallback((r: PositionStatus) => {
        setModal({ type: "modify", row: r });
    }, []);

    return (
        <div className="w-full">
            {isError && (
                <div className="text-sm text-red-400 border border-red-800 bg-red-950/20 rounded p-2">
                    Failed to load positions.
                </div>
            )}

            {isLoading && !data && (
                <div className="text-sm text-gray-400">Loading positions…</div>
            )}

            {!isLoading && items.length === 0 && (
                <div className="text-sm text-gray-400">No open positions.</div>
            )}

            {/* Desktop table */}
            {items.length > 0 && (
                <div className="hidden md:block border border-gray-800 rounded-lg max-h-[60vh] overflow-auto">
                    <table className="min-w-full text-left text-white">
                        <thead className="bg-gray-900/60">
                            <tr>
                                <th className="px-3 py-2 text-xs font-medium text-gray-400">
                                    Position
                                </th>
                                <th className="px-3 py-2 text-xs font-medium text-gray-400">
                                    Value
                                </th>
                                <th className="px-3 py-2 text-xs font-medium text-gray-400">
                                    Entry / Mark Price
                                </th>
                                <th className="px-3 py-2 text-xs font-medium text-gray-400">
                                    Liq Price
                                </th>
                                <th className="px-3 py-2 text-xs font-medium text-gray-400">
                                    Size
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((r) => (
                                <Row
                                    key={`${r.position.id}`}
                                    row={r}
                                    onClose={onClose}
                                    onModify={onModify}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Mobile cards */}
            {items.length > 0 && (
                <div className="md:hidden  overflow-auto pr-1 pb-16">
                    {items.map((r) => (
                        <MobileRow key={`${r.position.id}`} row={r} />
                    ))}
                </div>
            )}

            {/* Modals */}
            {modal.type !== "none" && (
                <ConfirmModal
                    state={modal}
                    onCancel={() => setModal({ type: "none" })}
                    chainId={chainId}
                />
            )}
        </div>
    );
}

const ConfirmModal: React.FC<{
    state: ModalState;
    onCancel: () => void;
    chainId?: number;
}> = ({ state, onCancel, chainId }) => {
    const isClose = state.type === "close";
    const row = state.type === "none" ? undefined : state.row;
    const [txState, setTxState] = useState<
        "idle" | "active" | "success" | "error"
    >("idle");

    const onConfirm = async () => {
        try {
            setTxState("active");
            await new Promise((r) => setTimeout(r, 1500));
            setTxState("success");
            notify.success(isClose ? "Position closed" : "Position modified");
            setTimeout(onCancel, 600);
        } catch (e) {
            setTxState("error");
            notify.error(
                isClose
                    ? "Failed to close position"
                    : "Failed to modify position"
            );
        }
    };

    if (!row) return null;
    const title = isClose ? "Close Position" : "Modify Position";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
            <div className="relative z-10 w-[92%] max-w-md rounded-lg border border-gray-800 bg-[#0b0b0b] p-4">
                <div className="text-lg font-semibold mb-1">{title}</div>
                <div className="text-xs text-gray-400 mb-3">
                    {row.market.name} • {row.position.side.toUpperCase()} • Size{" "}
                    {numberOrDash(row.position.principal)}
                </div>
                <div className="text-sm text-gray-300 mb-4">
                    Are you sure you want to {isClose ? "close" : "modify"} this
                    position?
                </div>

                <TxProgress approval="idle" trade={txState} />

                <div className="mt-4 flex gap-2">
                    <button
                        className="flex-1 px-3 py-2 rounded border border-gray-700 hover:border-white text-sm"
                        onClick={onCancel}
                        disabled={txState === "active"}
                    >
                        Cancel
                    </button>
                    <button
                        className="flex-1 px-3 py-2 rounded border border-[#94ff0b] text-black bg-[#94ff0b] hover:opacity-90 text-sm disabled:opacity-60"
                        onClick={onConfirm}
                        disabled={txState === "active"}
                    >
                        Confirm
                    </button>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                    {row.position.poolAddress && (
                        <a
                            href={getAddressUrl(
                                chainId,
                                row.position.poolAddress as any
                            )}
                            target="_blank"
                            rel="noreferrer"
                            className="underline hover:opacity-80"
                        >
                            View pool on explorer
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};
