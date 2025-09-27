import React from "react";
import { PerpSide, Token } from "../../utils/types";

type Props = {
    CARD_MIN_H: string;
    side: PerpSide;
    quoteToken: Token;
};
export default function OutputView({ CARD_MIN_H, side, quoteToken }: Props) {
    return (
        <label
            className={`flex justify-between items-center ${CARD_MIN_H} rounded-md border border-[#62666a] p-3`}
        >
            <div className="flex flex-col justify-between">
                <span className="text-gray-300 text-lg">
                    {side === "long" ? "Long" : "Short"}
                </span>

                <span className="text-gray-300 h-14 text-3xl items-center flex">
                    $0.00
                </span>

                <span className="text-gray-300 text-sm ">$0.00</span>
            </div>
            <div className="font-medium flex items-center border border-[#62666a] rounded-full px-2 py-1">
                <div className="flex items-center mr-2">
                    <img
                        src={quoteToken.imageUrl}
                        alt=""
                        className="h-6 w-6 rounded-full ring-2 ring-[#0c0e13] relative z-1"
                    />
                </div>
                <div className=" text-white ">{quoteToken.symbol}</div>
            </div>
        </label>
    );
}
