import React, { useEffect, useMemo, useState } from "react";
import MarketsDropdown from "./components/MarketListDropdown";
import { useMarketStatsList } from "./hooks/useMarkets";
import QuoteView from "./components/QuoteView";
import MarketListDropdown from "./components/MarketListDropdown";
import PositionsTable from "./components/Positions/PositionsTable";
import "./index.css";
import {
    getMarketNameFromUrl,
    subscribeToMarketInUrlChange,
} from "./utils/url";
import ConnectButton from "./components/Wallet/ConnectButton";
import { HiLightningBolt } from "react-icons/hi";
import { BiWalletAlt } from "react-icons/bi";

const App: React.FC = () => {
    const { data, isLoading, isError } = useMarketStatsList();

    console.log(data);
    const [selectedMarketId, setSelectedMarketId] = useState<string>("");
    const [mobileTab, setMobileTab] = useState<"trade" | "positions">("trade");
    console.log("selectedMarketId", selectedMarketId);

    const selectedMarket = useMemo(() => {
        const items = data?.items ?? [];
        const idNum = Number(selectedMarketId);
        return items.find((m) => m.market.id === idNum);
    }, [data, selectedMarketId]);

    useEffect(() => {
        if (!data?.items || data.items.length === 0) return;

        const urlMarketName = getMarketNameFromUrl();
        if (!urlMarketName) return;

        const byName = data.items.find(
            (m) => m.market.name.toLowerCase() === urlMarketName.toLowerCase()
        );
        if (byName) {
            setSelectedMarketId(String(byName.market.id));
        }
    }, [data?.items]);

    useEffect(() => {
        if (!data?.items) return;
        const unsubscribe = subscribeToMarketInUrlChange((name) => {
            if (!name) return;
            const match = data.items?.find(
                (m) => m.market.name.toLowerCase() === name.toLowerCase()
            );
            if (match) {
                setSelectedMarketId(String(match.market.id));
            }
        });
        return unsubscribe;
    }, [data?.items]);

    return (
        <div className="min-h-screen bg-black text-white overflow-y-auto">
            <div className="mx-auto p-2 border-b border-[#62666a]">
                <ConnectButton />
            </div>
            <div className="mx-auto px-2 py-2">
                <MarketListDropdown
                    markets={data?.items}
                    isLoading={isLoading}
                    isError={isError}
                    selectedMarketId={selectedMarketId}
                    onChange={setSelectedMarketId}
                />
                {/* Desktop / Tablet layout */}
                <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1 gap-4">
                    <div className="md:col-span-1 lg:col-span-2 sm:col-span-1 ">
                        <PositionsTable />
                    </div>
                    {selectedMarket && (
                        <QuoteView marketStats={selectedMarket} />
                    )}
                </div>

                {/* Mobile layout with bottom tab bar */}
                <div className="md:hidden pb-16">
                    {mobileTab === "trade" && selectedMarket && (
                        <QuoteView marketStats={selectedMarket} />
                    )}
                    {mobileTab === "positions" && <PositionsTable />}
                </div>
            </div>

            {/* Mobile bottom tab bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-[#62666a] bg-black z-10">
                <div className="grid grid-cols-2">
                    <button
                        className={`flex flex-col items-center justify-center py-2 text-sm ${
                            mobileTab === "trade"
                                ? "text-[#94ff0b]"
                                : "text-gray-300"
                        }`}
                        onClick={() => setMobileTab("trade")}
                        aria-pressed={mobileTab === "trade"}
                    >
                        <span className="text-lg">
                            <HiLightningBolt className="h-4 w-4" />
                        </span>
                        <span>Trade</span>
                    </button>
                    <button
                        className={`flex flex-col items-center justify-center py-2 text-sm ${
                            mobileTab === "positions"
                                ? "text-[#94ff0b]"
                                : "text-gray-300"
                        }`}
                        onClick={() => setMobileTab("positions")}
                        aria-pressed={mobileTab === "positions"}
                    >
                        <span className="text-lg">
                            <BiWalletAlt className="h-4 w-4" />
                        </span>
                        <span>Positions</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;
