import React from "react";
import { MarketStatsList } from "../../utils/types";
import {
    formatCompactCurrency,
    formatPercent,
    formatUsd,
} from "../../utils/formatNumber";

type Props = {
    selectedMarket: MarketStatsList | undefined;
    isMobile: boolean;
};

export default function SelectedMarketStats({
    selectedMarket,
    isMobile,
}: Props) {
    if (!selectedMarket) {
        return null;
    }

    if (!isMobile) {
        return (
            <div className="flex gap-4 ">
                <div className="flex-col justify-center items-center">
                    <div className="text-[12px] text-gray-500">Price</div>
                    <div className="text-sm text-right text-white">
                        {formatUsd(selectedMarket.tokenStats.priceUsd ?? 0)}
                    </div>
                </div>
                <div className="flex-col justify-center items-center">
                    <div className="text-[12px] text-gray-500">Market Cap</div>
                    <div className="text-sm text-right text-white">
                        {formatCompactCurrency(
                            selectedMarket.tokenStats.marketCap ?? 0
                        )}
                    </div>
                </div>
                <div className="flex-col justify-center items-center">
                    <div className="text-[12px] text-gray-500">24h Change</div>
                    <div className="text-sm text-right text-white">
                        {formatPercent(
                            selectedMarket.tokenStats.oneDayChange ?? 0
                        )}
                    </div>
                </div>
                <div className="flex-col justify-center items-center">
                    <div className="text-[12px] text-gray-500">24h Volume</div>
                    <div className="text-sm text-right text-white">
                        {formatCompactCurrency(
                            selectedMarket.tokenStats.oneDayVolumeUsd ?? 0
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-col justify-center items-center">
            <div className="text-sm text-right text-white">
                {formatUsd(selectedMarket.tokenStats.priceUsd ?? 0)}
            </div>
            <div className="text-sm text-right text-white">
                {formatPercent(selectedMarket.tokenStats.oneDayChange ?? 0)}
            </div>
        </div>
    );
}
