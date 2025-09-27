import React from "react";
import { MarketStats } from "../../utils/types";
import {
    formatCompactCurrency,
    formatPercent,
    formatStat,
} from "../../utils/formatStat";

type Props = {
    marketStats: MarketStats | undefined;
    symbol: string | undefined;
    isMobile: boolean;
};

export default function SelectedMarketStats({
    marketStats,
    symbol,
    isMobile,
}: Props) {
    if (!marketStats) {
        return null;
    }

    if (!isMobile) {
        return (
            <div className="flex gap-4 ">
                <div className="flex-col justify-center items-center">
                    <div className="text-[12px] text-gray-500">Price</div>
                    <div className="text-sm text-right text-white">
                        {formatStat(marketStats.price, symbol ?? "")}
                    </div>
                </div>
                <div className="flex-col justify-center items-center">
                    <div className="text-[12px] text-gray-500">Market Cap</div>
                    <div className="text-sm text-right text-white">
                        {formatCompactCurrency(marketStats.marketCap ?? 0)}
                    </div>
                </div>
                <div className="flex-col justify-center items-center">
                    <div className="text-[12px] text-gray-500">24h Change</div>
                    <div className="text-sm text-right text-white">
                        {formatPercent(marketStats.oneDayChange ?? 0)}
                    </div>
                </div>
                <div className="flex-col justify-center items-center">
                    <div className="text-[12px] text-gray-500">24h Volume</div>
                    <div className="text-sm text-right text-white">
                        {formatCompactCurrency(
                            marketStats.oneDayVolumeUsd ?? 0
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-col justify-center items-center">
            <div className="text-sm text-right text-white">
                {formatStat(marketStats.price, symbol ?? "")}
            </div>
            <div className="text-sm text-right text-white">
                {formatPercent(marketStats.oneDayChange ?? 0)}
            </div>
        </div>
    );
}
