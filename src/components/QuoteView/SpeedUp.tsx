import React from "react";

type Props = {
    speedUp: boolean;
    setSpeedUp: (value: boolean) => void;
};

export default function SpeedUp({ speedUp, setSpeedUp }: Props) {
    return (
        <div className="flex items-center justify-between">
            <label
                htmlFor="max-slippage"
                className="flex items-center gap-2 text-gray-300"
            >
                Speed
            </label>
            <div className="inline-flex overflow-hidden rounded-2xl border border-[#62666a]">
                <button
                    className={`px-4 py-2 text-sm flex items-center justify-center flex-1 transition-colors cursor-pointer ${
                        !speedUp
                            ? "bg-gray-700 text-white"
                            : "bg-transparent text-gray-400 hover:bg-gray-800"
                    }`}
                    onClick={() => setSpeedUp(false)}
                >
                    Normal
                </button>
                <button
                    className={`px-4 py-2 text-sm flex items-center justify-center flex-1 transition-colors cursor-pointer ${
                        // Added justify-center and flex-1
                        speedUp
                            ? "bg-gray-700 text-white"
                            : "bg-transparent text-gray-400 hover:bg-gray-800"
                    }`}
                    onClick={() => setSpeedUp(true)}
                >
                    Fast
                </button>
            </div>
        </div>
    );
}
