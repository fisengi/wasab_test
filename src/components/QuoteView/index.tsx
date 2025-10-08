import React, { useEffect, useState, useMemo } from "react";
import { MarketStatsList, PerpSide } from "../../utils/types";

import { useIsMobile } from "../../hooks/useMediaQuery";
import { useQuote } from "../../hooks/useQuote";
import { parseUnits, formatUnits } from "viem";
import { formatPercent } from "../../utils/formatStat";
import InputView from "../QuoteView/InputView";
import OutputView from "../QuoteView/OutputView";
import LongShortButton from "../QuoteView/LongShortButton";
import LeverageSlider from "../QuoteView/LeverageSlider";
import MaxSlippage from "../QuoteView/MaxSlippage";
import SpeedUp from "../QuoteView/SpeedUp";
import QuoteButton from "../Wallet/QuoteButton";
import { WASABI_LONG_POOL, WASABI_SHORT_POOL } from "../../utils/constants";
import type { Address } from "viem";
import { useUsdcBalance } from "../../hooks/useUsdcBalance";

type Props = {
    marketStats: MarketStatsList;
};

export default function QuoteViewIndex({ marketStats }: Props) {
    const isMobile = useIsMobile();
    const CARD_MIN_H = "min-h-[100px]";
    const { market } = marketStats;
    const quoteToken = market.pair.quoteToken;
    const baseToken = market.pair.baseToken;

    const [side, setSide] = useState<PerpSide>("long");
    const [amountInput, setAmountInput] = useState<string>("");
    const [speedUp, setSpeedUp] = useState<boolean>(false);
    const [maxSlippage, setMaxSlippage] = useState<number>(1);
    const [leverage, setLeverage] = useState<number>(market.maxLeverage);

    const [isInsufficientBalance, setIsInsufficientBalance] =
        useState<boolean>(false);

    useEffect(() => {
        setSide("long");
        setAmountInput("");
        setSpeedUp(false);
        setMaxSlippage(1);
        setLeverage(market.maxLeverage);
    }, [market.id]);

    const { isFormValid, downPayment } = useMemo(() => {
        const downPaymentNum = Number.parseFloat(amountInput);
        const isFormValid = !Number.isNaN(downPaymentNum) && downPaymentNum > 0;
        const downPayment = isFormValid
            ? parseUnits(amountInput, market.pair.quoteToken.decimals)
            : undefined;
        return { isFormValid, downPayment };
    }, [amountInput, market]);

    const {
        data: quote,
        isLoading: isLoadingQuote,
        error: quoteError,
    } = useQuote(
        market.id,
        side,
        downPayment,
        leverage,
        maxSlippage,
        speedUp,
        market.chainId,
        isFormValid
    );

    return (
        <section className="rounded-lg border border-[#62666a] p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between ">
                <LongShortButton side={side} setSide={setSide} />
                {!isMobile && (
                    <div className="font-medium flex items-center flex-col">
                        <div className="flex items-center mr-2 w-full justify-end">
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
                        <div className="flex flex-row">
                            <div className="text-white">{baseToken.symbol}</div>
                            <div className=" text-gray-400">
                                -{quoteToken.symbol}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid gap-4 lg:grid-cols-1 md:grid-cols-1 sm:grid-cols-1 ">
                <div className="space-y-2">
                    <InputView
                        CARD_MIN_H={CARD_MIN_H}
                        setIsInsufficientBalance={setIsInsufficientBalance}
                        amountInput={amountInput}
                        setAmountInput={setAmountInput}
                        tokenStats={quoteToken}
                        quote={quote!}
                        isLoading={isLoadingQuote}
                    />
                    <OutputView
                        CARD_MIN_H={CARD_MIN_H}
                        side={side}
                        baseToken={baseToken}
                        quoteToken={quoteToken}
                        quote={quote!}
                        isLoading={isLoadingQuote}
                        error={quoteError?.message}
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
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-gray-300 text-sm">
                        <span>Price Impact</span>
                        <span className={isLoadingQuote ? "blur-sm" : ""}>
                            {quote
                                ? new Intl.NumberFormat(undefined, {
                                      maximumSignificantDigits: 2,
                                  }).format(quote.swapResponse.priceImpact) +
                                  "%"
                                : "-"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-300 text-sm">
                        <span>Entry Price</span>
                        <span className={isLoadingQuote ? "blur-sm" : ""}>
                            {quote
                                ? "$" +
                                  new Intl.NumberFormat(undefined, {
                                      maximumSignificantDigits: 4,
                                  }).format(quote.entryPrice)
                                : "-"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-300 text-sm">
                        <span>Liquidation Price</span>
                        <span className={isLoadingQuote ? "blur-sm" : ""}>
                            {quote
                                ? "$" +
                                  new Intl.NumberFormat(undefined, {
                                      maximumSignificantDigits: 3,
                                  }).format(quote.liquidationPrice)
                                : "-"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-300 text-sm">
                        <span>Borrow Rate</span>
                        <span className={isLoadingQuote ? "blur-sm" : ""}>
                            {quote
                                ? new Intl.NumberFormat(undefined, {
                                      maximumSignificantDigits: 2,
                                  }).format(quote.hourlyBorrowFee) + "% / 1h"
                                : "-"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-300 text-sm">
                        <span>Open Fees</span>
                        <span className={isLoadingQuote ? "blur-sm" : ""}>
                            {quote
                                ? "$" +
                                  formatUnits(quote.fee, quoteToken.decimals)
                                : "-"}
                        </span>
                    </div>
                    <QuoteButton
                        isReady={quote !== undefined}
                        tokenAddress={market.pair.quoteToken.address as Address}
                        tokenSymbol={market.pair.quoteToken.symbol}
                        spenderAddress={
                            (side === "long"
                                ? WASABI_LONG_POOL
                                : WASABI_SHORT_POOL) as Address
                        }
                        requiredAmount={downPayment}
                        insufficientBalance={isInsufficientBalance}
                    />
                </div>
            </div>
        </section>
    );
}
