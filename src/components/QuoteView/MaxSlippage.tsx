import React, { useState } from "react";
import { BsQuestionCircle } from "react-icons/bs";
import Tippy from "@tippyjs/react";

type Props = {
    slippage: number;
    setSlippage: (value: number) => void;
};

function MaxSlippage({ slippage, setSlippage }: Props) {
    const presets = [0.01, 0.05, 0.1, 0.5, 1, 2.5, 5];

    const slippageValue = slippage;
    const isInvalid =
        slippage !== 0 && (slippageValue > 10 || slippageValue < 0);

    const warningMessage = slippageValue >= 5 && slippageValue < 10;

    const inputBorderClass = isInvalid
        ? "border-red-500"
        : "border-gray-600 focus-within:border-[#94ff0b]";

    return (
        <div className="w-full  rounded-xl b font-sans text-white ">
            <h2 className="text-xl font-semibold mb-4">Slippage</h2>

            <div className="grid grid-cols-7 gap-2 mb-6">
                {presets.map((preset) => (
                    <button
                        key={preset}
                        onClick={() => setSlippage(preset as number)}
                        className={`min-w-12 py-1 text-[12px] font-medium rounded-full transition-colors duration-200 
                            ${
                                slippage === (preset as number)
                                    ? "bg-gray-700 text-white border border-transparent"
                                    : "bg-transparent border border-gray-600 text-gray-400 hover:bg-gray-800"
                            }`}
                    >
                        {preset}%
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-between">
                <label
                    htmlFor="max-slippage"
                    className="flex items-center gap-2 text-gray-300"
                >
                    Max. Slippage
                    <Tippy content="Your transaction will revert if the price changes unfavorably by more than this percentage.">
                        <span className="cursor-help">
                            <BsQuestionCircle className="text-gray-500 w-4 h-4" />
                        </span>
                    </Tippy>
                </label>
                <div className="relative w-32">
                    <input
                        id="max-slippage"
                        type="number"
                        step="0.01"
                        placeholder="1.00"
                        value={slippage}
                        onChange={(e) =>
                            setSlippage(parseFloat(e.target.value))
                        }
                        className={`h-10 w-full rounded-md bg-transparent border pl-3 pr-7 text-right text-white outline-none transition-colors hide-number-spinners ${inputBorderClass}`}
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        %
                    </span>
                </div>
            </div>
            {isInvalid && (
                <p className="text-center text-red-500 text-[12px] mt-1">
                    Maximum allowed slippage is 10%
                </p>
            )}
            {warningMessage && (
                <p className="text-center text-red-500 text-[12px] mt-1">
                    A higher slippage could result in an undesirable entry
                    price.
                </p>
            )}
        </div>
    );
}

export default MaxSlippage;
