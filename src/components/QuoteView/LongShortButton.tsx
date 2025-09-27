import React from "react";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { PerpSide } from "../../utils/types";

type Props = {
    side: PerpSide;
    setSide: (side: PerpSide) => void;
};

export default function LongShortButton({ side, setSide }: Props) {
    return (
        <div className="inline-flex overflow-hidden rounded-md border border-[#62666a]">
            <button
                className={`px-8 py-2 text-[16px] hover:bg-[#54a665] flex items-center gap-2 ${
                    side === "long"
                        ? "bg-[#54a665] text-white"
                        : "bg-[#0c0e13] text-gray-200"
                }`}
                onClick={() => setSide("long")}
            >
                <FaArrowTrendUp className="h-4 w-4" /> Long
            </button>
            <button
                className={`px-8 py-2 text-[16px]  hover:bg-[#a84441] flex items-center gap-2 ${
                    side === "short"
                        ? "bg-[#a84441] text-white"
                        : "bg-[#0c0e13] text-gray-200"
                }`}
                onClick={() => setSide("short")}
            >
                <FaArrowTrendDown className="h-4 w-4" /> Short
            </button>
        </div>
    );
}
