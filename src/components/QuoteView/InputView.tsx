import React from "react";
import { Token, MarketStats } from "../../utils/types";

type Props = {
    CARD_MIN_H: string;
    amountInput: string;
    setAmountInput: (amountInput: string) => void;
    tokenStats: Token;
    tokenPrice: number;
    quoteToken: Token;
    formatStat: (price: number, symbol: string) => React.ReactNode;
};

export default function InputView({
    CARD_MIN_H,
    amountInput,
    setAmountInput,
    tokenStats,
    tokenPrice,
    quoteToken,
    formatStat,
}: Props) {
    return (
        <label
            className={`text-red-500 flex flex-row justify-between items-center ${CARD_MIN_H} rounded-md border border-[#62666a] p-3 focus-within:border-[#94ff0b] focus-within:ring-2 focus-within:ring-[#94ff0b]/30`}
        >
            <div className="flex flex-col justify-between">
                <span className="text-gray-300 text-lg">Pay</span>
                <div className="relative flex-1">
                    <input
                        inputMode="decimal"
                        placeholder="0"
                        className="h-14 w-full text-3xl text-white
bg-transparent border-0 outline-none shadow-none
focus:outline-none focus:ring-0 focus:border-0 appearance-none
placeholder-gray-300 caret-white"
                        value={amountInput}
                        onChange={(e) => setAmountInput(e.target.value)}
                    />
                </div>
                <span className="text-gray-300 text-sm ">
                    {formatStat(tokenPrice, quoteToken.symbol ?? "")}
                </span>
            </div>
            <div className="font-medium flex items-center border border-[#62666a] rounded-full px-2 py-1">
                <div className="flex items-center mr-2">
                    <img
                        src={tokenStats.imageUrl}
                        alt=""
                        className="h-6 w-6 rounded-full ring-2 ring-[#0c0e13] relative z-1"
                    />
                </div>
                <div className=" text-white ">{tokenStats.symbol}</div>
            </div>
        </label>
    );
}
