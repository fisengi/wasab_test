import React, { useState } from "react";

type Props = {
    leverage: number;
    setLeverage: (value: number) => void;
    maxLeverage: number;
};

function LeverageSlider({ leverage, setLeverage, maxLeverage }: Props) {
    const min = 1.1;
    const max = maxLeverage;

    // Calculate the percentage of the slider's progress
    const getProgressPercent = () => {
        return ((leverage - min) / (max - min)) * 100;
    };

    // Create the dynamic background style for the track
    const sliderBackgroundStyle = {
        background: `linear-gradient(to right, #94ff0b ${getProgressPercent()}%, #1f2937 ${getProgressPercent()}%)`,
    };

    return (
        <label className="block text-sm">
            <div className="mb-1 flex items-center justify-between text-gray-200">
                <span>Set Leverage</span>
            </div>
            <div className="flex items-center gap-4">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step="0.1"
                    value={leverage}
                    onChange={(e) => setLeverage(parseFloat(e.target.value))}
                    style={sliderBackgroundStyle}
                    className="leverage-slider h-2 w-full cursor-pointer appearance-none rounded-full"
                />
                <span className="w-16 text-right text-lg font-semibold text-white">
                    {leverage.toFixed(1)}x
                </span>
            </div>
        </label>
    );
}

export default LeverageSlider;
