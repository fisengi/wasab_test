import React, { useState } from "react";
import { FiFilter } from "react-icons/fi";
import { useIsMobile } from "../../hooks/useMediaQuery";

type Props = {
    selectedQuote: string;
    setSelectedQuote: (quoteType: string) => void;
};

function QuoteTabBar({ selectedQuote, setSelectedQuote }: Props) {
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);
    const isSelected = (quote: string) => selectedQuote === quote;
    const tabbarClasses =
        "h-full flex-1 text-gray-400 hover:cursor-pointer text-[12px] hover:text-white px-1 transition-colors";
    if (isMobile) {
        return (
            <div className="relative">
                <button
                    aria-label="Filter"
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-[#62666a] text-gray-300 hover:text-white transition-colors"
                    onClick={() => setOpen((v) => !v)}
                >
                    <FiFilter className="h-5 w-5" />
                </button>
                {open && (
                    <div className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-[#62666a] bg-black p-1 shadow-lg">
                        {["ALL", "ETH", "SOL", "USD"].map((q) => (
                            <button
                                key={q}
                                onClick={() => {
                                    setSelectedQuote(q);
                                    setOpen(false);
                                }}
                                className={`block w-full text-left rounded px-2 py-2 text-sm transition-colors ${
                                    isSelected(q)
                                        ? "bg-[#22272d] text-white"
                                        : "text-gray-300 hover:bg-[#1a1f24]"
                                }`}
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            className="mb-4 flex h-10 w-full items-center rounded-lg border border-[#62666a]
                 divide-x divide-[#62666a] "
        >
            <button
                onClick={() => setSelectedQuote("ALL")}
                className={`${tabbarClasses} rounded-l-lg ${
                    isSelected("ALL")
                        ? "text-white bg-[#22272d]"
                        : "text-gray-400"
                }`}
            >
                ALL
            </button>
            <button
                onClick={() => setSelectedQuote("ETH")}
                className={`${tabbarClasses} ${
                    isSelected("ETH")
                        ? "text-white bg-[#22272d]"
                        : "text-gray-400"
                }`}
            >
                ETH
            </button>
            <button
                onClick={() => setSelectedQuote("SOL")}
                className={`${tabbarClasses} ${
                    isSelected("SOL")
                        ? "text-white bg-[#22272d]"
                        : "text-gray-400"
                }`}
            >
                SOL
            </button>
            <button
                onClick={() => setSelectedQuote("USD")}
                className={`${tabbarClasses} rounded-r-lg ${
                    isSelected("USD")
                        ? "text-white bg-[#22272d]"
                        : "text-gray-400"
                }`}
            >
                USD
            </button>
        </div>
    );
}

export default QuoteTabBar;
