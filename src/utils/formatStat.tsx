import React, { ReactNode } from "react";
import { FaEthereum } from "react-icons/fa";
import { SiSolana } from "react-icons/si";

export function formatCompactCurrency(value: number): string {
    if (!isFinite(value)) return "-";
    const abs = Math.abs(value);
    if (abs >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (abs >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(value);
}

export function formatPercent(value: number): string {
    if (!isFinite(value)) return "-";
    const sign = value > 0 ? "+" : value < 0 ? "" : "";
    return `${sign}${value.toFixed(2)}%`;
}

const SOL_ICON = <SiSolana className="w-3 h-3" />;
const ETH_ICON = <FaEthereum className="w-3 h-3" />;

export function formatStat(value: number, quoteToken: string): ReactNode {
    if (!isFinite(value)) return "-";

    const formattedNumber = new Intl.NumberFormat(undefined, {
        maximumSignificantDigits: 4,
    }).format(value);

    if (quoteToken.includes("SOL")) {
        return (
            <span className="inline-flex items-center">
                {SOL_ICON}
                {formattedNumber}
            </span>
        );
    }
    if (quoteToken.includes("ETH")) {
        return (
            <span className="inline-flex items-center">
                {ETH_ICON}
                {formattedNumber}
            </span>
        );
    }
    if (quoteToken.includes("USD")) {
        return `$${formattedNumber}`;
    }

    return formattedNumber;
}
