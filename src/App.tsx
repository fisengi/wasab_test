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
            <div className="mx-auto max-w-5xl px-4 py-6">
                <MarketListDropdown
                    markets={data?.items}
                    isLoading={isLoading}
                    isError={isError}
                    selectedMarketId={selectedMarketId}
                    onChange={setSelectedMarketId}
                />

                {selectedMarket && <QuoteView marketStats={selectedMarket} />}
            </div>
        </div>
    );
};

export default App;
