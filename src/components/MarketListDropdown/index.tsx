import React, { useEffect, useMemo, useState, useCallback } from "react";
import { MarketStatsList } from "../../utils/types";
import { IoMdClose } from "react-icons/io";
import { useIsMobile } from "../../hooks/useMediaQuery";

import SearchInput from "./SearchInput";
import OpenListButton from "./OpenListButton";
import MarketList from "./MarketList";
import QuoteTabBar from "./QuoteTabBar";
import SelectedMarketStats from "./SelectedMarketStats";

type Props = {
    markets: MarketStatsList[] | undefined;
    isLoading: boolean;
    isError: boolean;
    selectedMarketId?: string;
    onChange: (id: string) => void;
};

export default function MarketListDropdown({
    markets,
    isLoading,
    isError,
    selectedMarketId,

    onChange,
}: Props) {
    const isMobile = useIsMobile();
    const [open, setOpen] = useState(false);
    const [closing, setClosing] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedQuote, setSelectedQuote] = useState("ALL");

    const openModal = useCallback(() => {
        setClosing(false);
        setOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        // Play closing animation before unmounting
        setClosing(true);
        const timeoutId = setTimeout(() => {
            setOpen(false);
            setClosing(false);
        }, 200);
        return () => clearTimeout(timeoutId);
    }, []);

    const filtered = useMemo(() => {
        const items = markets ?? [];
        const q = query.trim().toLowerCase();

        const quoteFiltered =
            selectedQuote === "ALL"
                ? items
                : items.filter((m) =>
                      m.market.pair.quoteToken.symbol
                          .toLowerCase()
                          .includes(selectedQuote.toLowerCase())
                  );

        if (!q) return quoteFiltered;

        return quoteFiltered.filter((m) =>
            m.market.pair.baseToken.symbol.toLowerCase().includes(q)
        );
    }, [markets, query, selectedQuote]);

    const selectedMarket = useMemo(() => {
        const items = markets ?? [];
        const idNum = Number(selectedMarketId);
        return items.find((m) => m.market.id === idNum);
    }, [markets, selectedMarketId]);

    // Close on Escape and lock scroll when modal is open
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeModal();
            }
        };
        document.addEventListener("keydown", onKeyDown);
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = originalOverflow;
        };
    }, [open, closeModal]);

    return (
        <div>
            <div className="flex justify-between  mx-auto  px-2 py-6">
                <OpenListButton
                    onClick={openModal}
                    selectedMarket={selectedMarket?.market}
                />
                <SelectedMarketStats
                    marketStats={selectedMarket?.tokenStats}
                    symbol={selectedMarket?.market.pair.quoteToken.symbol}
                    isMobile={isMobile}
                />
            </div>

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="markets-title"
                >
                    <div
                        className={`absolute inset-0 backdrop-blur-sm transition-opacity duration-200 ${
                            closing ? "opacity-0" : "opacity-100"
                        }`}
                        onClick={closeModal}
                        aria-hidden="true"
                    />
                    <div
                        className={
                            isMobile
                                ? `relative z-10 w-screen h-screen max-w-none rounded-none border-0 bg-black p-4 shadow-none flex flex-col transition-all duration-200 ease-out ${
                                      closing
                                          ? "opacity-0 translate-y-2"
                                          : "opacity-100 translate-y-0"
                                  }`
                                : `relative z-10 w-full max-w-4xl h-[85vh] max-h-[85vh] rounded-lg border border-[#62666a] bg-black p-4 shadow-xl flex flex-col transition-all duration-200 ease-out ${
                                      closing
                                          ? "opacity-0 translate-y-2 scale-[0.98]"
                                          : "opacity-100 translate-y-0 scale-100"
                                  }`
                        }
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <h2
                                id="markets-title"
                                className="text-lg font-semibold"
                            >
                                Markets
                            </h2>
                            <button
                                className="rounded text-gray-500 hover:cursor-pointer p-1 transition-colors"
                                aria-label="Close"
                                onClick={closeModal}
                            >
                                <IoMdClose className="h-5 w-5 text-gray-500 hover:text-white" />
                            </button>
                        </div>
                        <div className="flex flex-row justify-center  gap-2">
                            <SearchInput
                                query={query}
                                setQuery={setQuery}
                                autoFocus={true}
                            />
                            <div className="h-full">
                                <QuoteTabBar
                                    selectedQuote={selectedQuote}
                                    setSelectedQuote={setSelectedQuote}
                                />
                            </div>
                        </div>
                        <div className="flex-1 min-h-0">
                            <MarketList
                                markets={filtered}
                                isLoading={isLoading}
                                isError={isError}
                                onChange={(id) => {
                                    onChange(id);
                                    closeModal();
                                }}
                            />
                            {filtered?.length === 0 && (
                                <div className="p-6 text-center text-sm text-gray-500">
                                    No results
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
