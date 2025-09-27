import React, { useEffect, useState } from "react";
import { MarketStatsList, PerpSide } from "../../utils/types";
import { formatStat } from "../../utils/formatStat";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { useQuote } from "../../hooks/useQuote";

import InputView from "../QuoteView/InputView";
import OutputView from "../QuoteView/OutputView";
import LongShortButton from "../QuoteView/LongShortButton";
import LeverageSlider from "../QuoteView/LeverageSlider";
import MaxSlippage from "../QuoteView/MaxSlippage";
import SpeedUp from "../QuoteView/SpeedUp";

type Props = {
    marketStats: MarketStatsList;
};

export default function QuoteViewIndex({ marketStats }: Props) {
    const isMobile = useIsMobile();
    const CARD_MIN_H = "min-h-[140px]";
    const { market, tokenStats } = marketStats;
    const quoteToken = market.pair.quoteToken;
    const baseToken = market.pair.baseToken;

    const [side, setSide] = useState<PerpSide>("long");
    const [amountInput, setAmountInput] = useState<string>("");
    const [speedUp, setSpeedUp] = useState<boolean>(false);
    const [maxSlippage, setMaxSlippage] = useState<number>(1);
    const [leverage, setLeverage] = useState<number>(market.maxLeverage);

    // Reset local state when market changes
    useEffect(() => {
        setSide("long");
        setAmountInput("");
        setSpeedUp(false);
        setMaxSlippage(1);
        setLeverage(market.maxLeverage);
    }, [market.id]);

    useEffect(() => {
        if (amountInput) {
            const downPayment = BigInt(amountInput) * BigInt(leverage);
            const quote = useQuote(
                market.id,
                side,
                downPayment,
                leverage,
                maxSlippage,
                speedUp,
                market.chainId
            );
            console.log("alo", quote);
        }
    }, [market.id]);

    return (
        <section className="rounded-lg border border-[#62666a] p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between ">
                <LongShortButton side={side} setSide={setSide} />
                {!isMobile && (
                    <div className="font-medium flex items-center">
                        <div className="flex items-center mr-2">
                            <img
                                src={baseToken.imageUrl}
                                alt=""
                                className="h-6 w-6 rounded-full ring-2 ring-[#0c0e13] relative z-1"
                            />

                            <img
                                src={quoteToken.imageUrl}
                                alt=""
                                className="h-6 w-6 rounded-full ring-2 ring-[#0c0e13] -ml-1.5"
                            />
                        </div>
                        <div className="text-white">{baseToken.symbol}</div>
                        <div className=" text-gray-400">
                            -{quoteToken.symbol}
                        </div>
                    </div>
                )}
            </div>

            <div className="grid gap-4 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 ">
                <div className="space-y-4">
                    <InputView
                        CARD_MIN_H={CARD_MIN_H}
                        amountInput={amountInput}
                        setAmountInput={setAmountInput}
                        tokenStats={market.pair.baseToken}
                        tokenPrice={tokenStats.price}
                        quoteToken={quoteToken}
                        formatStat={formatStat}
                    />
                    <OutputView
                        CARD_MIN_H={CARD_MIN_H}
                        side={side}
                        quoteToken={quoteToken}
                    />

                    <div className="text-gray-300 text-[12px] ">
                        {side === "long"
                            ? `${baseToken.symbol}/${quoteToken.symbol} LONG: You benefit from ${baseToken.symbol} going up relative to ${quoteToken.symbol}.`
                            : `${baseToken.symbol}/${quoteToken.symbol} SHORT: You benefit from ${baseToken.symbol} going down relative to ${quoteToken.symbol}.`}
                    </div>

                    <LeverageSlider
                        leverage={leverage}
                        setLeverage={setLeverage}
                        maxLeverage={market.maxLeverage}
                    />
                    <MaxSlippage
                        slippage={maxSlippage}
                        setSlippage={setMaxSlippage}
                    />
                    <SpeedUp speedUp={speedUp} setSpeedUp={setSpeedUp} />
                </div>
            </div>
        </section>
    );
}
