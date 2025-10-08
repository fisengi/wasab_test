import React, { useEffect, useMemo, useState } from "react";
import MarketsDropdown from "./components/MarketListDropdown";
import { useMarketStatsList } from "./hooks/useMarkets";
import QuoteView from "./components/QuoteView";
import MarketListDropdown from "./components/MarketListDropdown";
import "./index.css";
import {
    getMarketNameFromUrl,
    subscribeToMarketInUrlChange,
} from "./utils/url";
import ConnectButton from "./components/Wallet/ConnectButton";

const App: React.FC = () => {
    const { data, isLoading, isError } = useMarketStatsList();

    console.log(data);
    const [selectedMarketId, setSelectedMarketId] = useState<string>("");
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
        <div className="min-h-screen bg-black text-white overflow-y-hidden">
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
                <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1">
                    <div className="md:col-span-1 lg:col-span-2 sm:col-span-1 "></div>
                    {selectedMarket && (
                        <QuoteView marketStats={selectedMarket} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
