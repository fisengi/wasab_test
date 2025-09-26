import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchQuote } from "../utils/fetcher";
import { MarketStatsList, PerpQuoteResponseV2, PerpSide } from "../utils/types";

type Props = {
    marketStats: MarketStatsList;
};

function bigIntPow10(exponent: number): bigint {
    let result = BigInt(1);
    const ten = BigInt(10);
    for (let i = 0; i < exponent; i++) {
        result = result * ten;
    }
    return result;
}

function parseAmountToBigInt(amountInput: string, decimals: number): bigint {
    const trimmed = amountInput.trim();
    if (!trimmed) return BigInt(0);
    if (!/^\d*(?:\.\d*)?$/.test(trimmed)) return BigInt(0);
    const [whole, frac = ""] = trimmed.split(".");
    const fracPadded = (frac + "0".repeat(decimals)).slice(0, decimals);
    const normalized = `${whole || "0"}${fracPadded}`.replace(/^0+/, "") || "0";
    return BigInt(normalized);
}

function formatAmountFromBigInt(
    value: bigint,
    decimals: number,
    maxFractionDigits = 6
): string {
    const negative = value < BigInt(0);
    const abs = negative ? value * BigInt(-1) : value;
    const base = bigIntPow10(decimals);
    const whole = abs / base;
    const frac = abs % base;
    const fracStr = frac.toString().padStart(decimals, "0").replace(/0+$/, "");
    const truncatedFrac = fracStr.slice(0, maxFractionDigits);
    const joined = truncatedFrac
        ? `${whole.toString()}.${truncatedFrac}`
        : whole.toString();
    return negative ? `-${joined}` : joined;
}

export default function QuoteView({ marketStats }: Props) {
    const { market, tokenStats } = marketStats;
    const quoteToken = market.pair.quoteToken;
    const baseToken = market.pair.baseToken;

    const [side, setSide] = useState<PerpSide>("long");
    const [amountInput, setAmountInput] = useState<string>("");
    const [leverage, setLeverage] = useState<number>(3);
    const [maxSlippage, setMaxSlippage] = useState<number>(1); // percent
    const [speedUp, setSpeedUp] = useState<boolean>(false);

    const downPayment = useMemo(
        () => parseAmountToBigInt(amountInput, quoteToken.decimals),
        [amountInput, quoteToken.decimals]
    );

    const quotingEnabled = useMemo(() => {
        return market?.id != null && downPayment > BigInt(0) && leverage >= 1;
    }, [market?.id, downPayment, leverage]);

    const { data, isFetching, isError, error } = useQuery<PerpQuoteResponseV2>({
        queryKey: [
            "quote",
            market.id,
            side,
            downPayment.toString(),
            leverage,
            maxSlippage,
            speedUp,
            market.chainId,
        ],
        queryFn: () =>
            fetchQuote(
                market.id,
                side,
                downPayment,
                leverage,
                maxSlippage,
                speedUp,
                market.chainId
            ),
        enabled: quotingEnabled,
        staleTime: 5_000,
    });

    const outputBase = data?.outputSize ?? BigInt(0);
    const outputQuote = data?.outputSizeInQuote ?? BigInt(0);

    return (
        <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img
                        src={baseToken.imageUrl}
                        alt=""
                        className="h-6 w-6 rounded-full"
                    />
                    <h2 className="text-lg font-medium">
                        {baseToken.symbol}/{quoteToken.symbol}
                    </h2>
                    <span className="text-sm text-gray-500">
                        • Price: {tokenStats.price.toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-4">
                    <div className="inline-flex overflow-hidden rounded-md border border-gray-300">
                        <button
                            className={`px-4 py-2 text-sm ${
                                side === "long"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-white text-gray-700"
                            }`}
                            onClick={() => setSide("long")}
                        >
                            Long
                        </button>
                        <button
                            className={`px-4 py-2 text-sm border-l border-gray-300 ${
                                side === "short"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-white text-gray-700"
                            }`}
                            onClick={() => setSide("short")}
                        >
                            Short
                        </button>
                    </div>

                    <label className="block text-sm">
                        <span className="mb-1 block text-gray-600">
                            Pay (in {quoteToken.symbol})
                        </span>
                        <div className="relative">
                            <input
                                inputMode="decimal"
                                placeholder="0.00"
                                className="h-12 w-full rounded border border-gray-300 px-3 pr-16 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={amountInput}
                                onChange={(e) => setAmountInput(e.target.value)}
                            />
                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                                {quoteToken.symbol}
                            </span>
                        </div>
                    </label>

                    <label className="block text-sm">
                        <div className="mb-1 flex items-center justify-between text-gray-600">
                            <span>Leverage</span>
                            <span className="font-medium">{leverage}x</span>
                        </div>
                        <input
                            type="range"
                            min={1}
                            max={10}
                            step={1}
                            value={leverage}
                            onChange={(e) =>
                                setLeverage(Number(e.target.value))
                            }
                            className="w-full accent-indigo-600"
                        />
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                        <label className="block text-sm">
                            <span className="mb-1 block text-gray-600">
                                Max slippage (%)
                            </span>
                            <input
                                type="number"
                                className="h-10 w-full rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                min={0}
                                step={0.1}
                                value={maxSlippage}
                                onChange={(e) =>
                                    setMaxSlippage(Number(e.target.value))
                                }
                            />
                        </label>
                        <label className="flex items-end gap-2 text-sm">
                            <input
                                type="checkbox"
                                className="h-4 w-4"
                                checked={speedUp}
                                onChange={(e) => setSpeedUp(e.target.checked)}
                            />
                            <span>Speed up routing</span>
                        </label>
                    </div>
                </div>

                <div className="space-y-3 rounded-md border border-gray-200 p-4">
                    <h3 className="text-sm font-semibold text-gray-700">
                        Quote
                    </h3>
                    {!quotingEnabled && (
                        <p className="text-sm text-gray-500">
                            Enter an amount to see a quote.
                        </p>
                    )}
                    {isFetching && quotingEnabled && (
                        <div className="animate-pulse text-sm text-gray-500">
                            Fetching quote…
                        </div>
                    )}
                    {isError && (
                        <div className="text-sm text-red-600">
                            {(error as Error)?.message ||
                                "Failed to fetch quote."}
                        </div>
                    )}
                    {data && !isFetching && (
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">
                                    You receive (base)
                                </span>
                                <span className="font-medium">
                                    {formatAmountFromBigInt(
                                        outputBase,
                                        baseToken.decimals
                                    )}{" "}
                                    {baseToken.symbol}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">
                                    In quote value
                                </span>
                                <span className="font-medium">
                                    {formatAmountFromBigInt(
                                        outputQuote,
                                        quoteToken.decimals
                                    )}{" "}
                                    {quoteToken.symbol}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">
                                    Entry price
                                </span>
                                <span className="font-medium">
                                    {data.entryPrice.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">
                                    Liquidation price
                                </span>
                                <span className="font-medium">
                                    {data.liquidationPrice.toLocaleString()}
                                </span>
                            </div>
                            {data.errorMessage && (
                                <div className="text-xs text-orange-600">
                                    {data.errorMessage}
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        disabled={!data || isFetching}
                        className={`mt-2 h-12 w-full rounded-md text-white transition ${
                            side === "long"
                                ? "bg-green-600 hover:bg-green-700 disabled:bg-green-300"
                                : "bg-red-600 hover:bg-red-700 disabled:bg-red-300"
                        }`}
                        onClick={() => {
                            // In a real app, this would create an order using a POST endpoint.
                            // Here we just no-op to keep the demo simple.
                            alert("Order simulation only - not implemented");
                        }}
                    >
                        {side === "long" ? "Open Long" : "Open Short"}
                    </button>
                </div>
            </div>
        </section>
    );
}
