import React from "react";
import { Market } from "../../utils/types";
import { AiOutlineCaretDown } from "react-icons/ai";

type Props = {
    onClick: () => void;
    selectedMarket: Market | undefined;
};

export default function OpenListButton({ onClick, selectedMarket }: Props) {
    return (
        <button
            className="flex items-center gap-2 rounded-full bg-[#0c0e13] px-4 py-2 text-white shadow hover:bg-[#22272d]/80 border border-[#62666a] transition-colors"
            onClick={onClick}
        >
            {selectedMarket ? (
                <div className="font-medium flex items-center">
                    <div className="flex items-center mr-2">
                        <img
                            src={selectedMarket.pair.baseToken.imageUrl}
                            alt=""
                            className="h-6 w-6 rounded-full ring-2 ring-[#0c0e13] relative z-1"
                        />

                        <img
                            src={selectedMarket.pair.quoteToken.imageUrl}
                            alt=""
                            className="h-6 w-6 rounded-full ring-2 ring-[#0c0e13] -ml-1.5"
                        />
                    </div>
                    <div className=" text-white ">
                        {selectedMarket.pair.baseToken.symbol}
                    </div>
                    <div className=" text-gray-400">
                        -{selectedMarket.pair.quoteToken.symbol}
                    </div>
                </div>
            ) : (
                "Open Market List"
            )}
            <AiOutlineCaretDown className="h-4 w-4" />
        </button>
    );
}
