import React, { useMemo, useState } from "react";
import MarketsDropdown from "./components/MarketListDropdown";
import { useMarketStatsList } from "./hooks/useMarkets";
import QuoteView from "./components/QuoteView";
import MarketListDropdown from "./components/MarketListDropdown";
import "./index.css";

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
