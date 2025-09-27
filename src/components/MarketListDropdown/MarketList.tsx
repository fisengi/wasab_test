import React, { useMemo } from "react";
import { TableVirtuoso } from "react-virtuoso";
import { MarketStatsList } from "../../utils/types";
import { useIsMobile } from "../../hooks/useMediaQuery";
import {
    formatCompactCurrency,
    formatPercent,
    formatStat,
} from "../../utils/formatStat";
import { setMarketNameInUrl } from "../../utils/url";

type Props = {
    markets: MarketStatsList[];
    isLoading: boolean;
    isError: boolean;

    onChange: (id: string) => void;
};

export default function MarketList({
    markets,
    isLoading,
    isError,
    onChange,
}: Props) {
    const isMobile = useIsMobile();
    const rows = useMemo(() => markets ?? [], [markets]);

    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center py-8">
                <div className="h-12 w-12 rounded-full border-2 border-[#94ff0b] border-t-[#0c0e13] animate-spin" />
            </div>
        );
    }
    if (isError) {
        return (
            <div className="p-6 text-center text-sm text-red-400">
                Failed to load markets.
            </div>
        );
    }

    return (
        <div className="w-full h-full overflow-x-hidden">
            <TableVirtuoso
                data={rows}
                style={{ height: "100%" }}
                components={{
                    Table: (props) => (
                        <table {...props} className="w-full table-fixed " />
                    ),
                    TableHead: React.forwardRef((props, ref) => (
                        <thead
                            {...props}
                            ref={ref}
                            className="z-10 shadow-[0_1px_0_#62666a]"
                        />
                    )),
                    Scroller: (props) => (
                        <div {...props} className="scrollbar-hide">
                            {props.children}
                        </div>
                    ),
                }}
                fixedHeaderContent={() => (
                    <tr className="text-left text-[12px] text-gray-400 bg-black ">
                        <th className="px-3 py-2 font-extralight w-7/12 sm:w-5/12">
                            Market
                        </th>
                        <th className="hidden sm:table-cell px-3 py-2 font-light w-2/12">
                            Market Cap
                        </th>
                        <th className="hidden sm:table-cell px-3 py-2 font-light w-2/12">
                            24h Volume
                        </th>
                        <th className="hidden sm:table-cell px-3 py-2 font-light w-2/12">
                            24h Change
                        </th>
                        <th className="px-3 py-2 font-light w-5/12 sm:w-2/12 flex-1 text-right ">
                            Price {isMobile && "24h %"}
                        </th>
                    </tr>
                )}
                itemContent={(index, item) => {
                    const id = String(item.market.id);

                    const oneDayChange = item.tokenStats.oneDayChange;

                    const changeColor =
                        oneDayChange > 0
                            ? "text-green-400"
                            : oneDayChange < 0
                            ? "text-red-400"
                            : "text-gray-300";

                    const borderClass =
                        index === 0 ? "" : "border-t border-[#62666a]";

                    return (
                        <>
                            <td
                                className={`px-3 py-3 text-sm align-middle cursor-pointer ${borderClass}  transition-colors`}
                                onClick={() => {
                                    setMarketNameInUrl(item.market.name);
                                    onChange(id);
                                }}
                            >
                                <div className="font-medium flex items-center">
                                    <div className="flex items-center mr-2">
                                        <img
                                            src={
                                                item.market.pair.baseToken
                                                    .imageUrl
                                            }
                                            alt={`${item.market.pair.baseToken.symbol} logo`}
                                            className="h-6 w-6 rounded-full ring-2 ring-[#0c0e13] relative z-1"
                                        />

                                        <img
                                            src={
                                                item.market.pair.quoteToken
                                                    .imageUrl
                                            }
                                            alt={`${item.market.pair.quoteToken.symbol} logo`}
                                            className="h-6 w-6 rounded-full ring-2 ring-[#0c0e13] -ml-1.5"
                                        />
                                    </div>
                                    <div className=" text-white ">
                                        {item.market.pair.baseToken.symbol}
                                    </div>
                                    <div className=" text-gray-400">
                                        -{item.market.pair.quoteToken.symbol}
                                    </div>
                                </div>
                            </td>
                            <td
                                className={`hidden sm:table-cell px-3 py-3 text-sm align-middle text-gray-200 cursor-pointer ${borderClass} transition-colors`}
                                onClick={() => {
                                    setMarketNameInUrl(item.market.name);
                                    onChange(id);
                                }}
                            >
                                {formatCompactCurrency(
                                    item.tokenStats.marketCap
                                )}
                            </td>
                            <td
                                className={`hidden sm:table-cell px-3 py-3 text-sm align-middle text-gray-200 cursor-pointer ${borderClass}  transition-colors`}
                                onClick={() => {
                                    setMarketNameInUrl(item.market.name);
                                    onChange(id);
                                }}
                            >
                                {formatCompactCurrency(
                                    item.tokenStats.oneDayVolumeUsd
                                )}
                            </td>
                            <td
                                className={`hidden sm:table-cell px-3 py-3 text-sm align-middle font-medium cursor-pointer ${borderClass} ${changeColor} transition-colors`}
                                onClick={() => {
                                    setMarketNameInUrl(item.market.name);
                                    onChange(id);
                                }}
                            >
                                {formatPercent(oneDayChange)}
                            </td>
                            <td
                                className={`px-3 py-3 text-sm align-middle text-gray-200 cursor-pointer  text-right ${borderClass} transition-colors`}
                                onClick={() => {
                                    setMarketNameInUrl(item.market.name);
                                    onChange(id);
                                }}
                            >
                                {formatStat(
                                    item.tokenStats.price,
                                    item.market.pair.quoteToken.symbol
                                )}
                                {isMobile && (
                                    <div className="text-gray-400 text-[10px]">
                                        {formatPercent(oneDayChange)}
                                    </div>
                                )}
                            </td>
                        </>
                    );
                }}
            />
        </div>
    );
}
