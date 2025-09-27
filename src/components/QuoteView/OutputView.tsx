import React from "react";
import { PerpQuoteResponseV2, PerpSide, Token } from "../../utils/types";
import { formatUnits } from "viem";

type Props = {
    CARD_MIN_H: string;
    side: PerpSide;
    quoteToken: Token;
    quote: PerpQuoteResponseV2;
    isLoading: boolean;
    error?: string;
    baseToken: Token;
};
export default function OutputView({
    CARD_MIN_H,
    side,
    quoteToken: _quoteToken,
    quote,
    baseToken,
    isLoading,
    error,
}: Props) {
    const baseTokenUsdPrice =
        quote?.swapResponse.tokenToUsdPrice[baseToken.address];
    const outputBaseAmountStr = quote
        ? formatUnits(quote.outputSize, baseToken.decimals)
        : "0";
    const outputBaseAmount = Number.parseFloat(outputBaseAmountStr);

    const formattedOutputBaseAmount = new Intl.NumberFormat(undefined, {
        maximumSignificantDigits: 2,
    }).format(outputBaseAmount);
    const outputUsd =
        !Number.isNaN(outputBaseAmount) && baseTokenUsdPrice !== undefined
            ? outputBaseAmount * baseTokenUsdPrice
            : undefined;
    const outputUsdFormatted =
        outputUsd !== undefined
            ? new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 3,
              }).format(outputUsd)
            : "";

    return (
        <label
            className={`flex justify-between items-center ${CARD_MIN_H} rounded-md border border-[#62666a] p-3`}
        >
            <div className="flex flex-col justify-between">
                <span className="text-gray-300 text-lg">
                    {side === "long" ? "Long" : "Short"}
                </span>

                <span className="text-gray-300 h-14 text-3xl items-center flex">
                    <span className={isLoading ? "blur-sm" : ""}>
                        {formattedOutputBaseAmount}
                    </span>
                </span>

                <span
                    className={`text-gray-300 text-sm ${
                        isLoading ? "blur-sm" : ""
                    }`}
                >
                    {quote ? outputUsdFormatted : "$0.00"}
                </span>
            </div>
            <div className="font-medium flex items-center border border-[#62666a] rounded-full px-2 py-1">
                <div className="flex items-center mr-2">
                    <img
                        src={baseToken.imageUrl}
                        alt=""
                        className="h-6 w-6 rounded-full ring-2 ring-[#0c0e13] relative z-1"
                    />
                </div>
                <div className=" text-white ">{baseToken.symbol}</div>
            </div>
        </label>
    );
}
