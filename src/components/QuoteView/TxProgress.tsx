import React from "react";

type StepStatus = "idle" | "active" | "success" | "error";

export type TxProgressProps = {
    approval: StepStatus;
    trade: StepStatus;
    className?: string;
};

const Dot: React.FC<{ status: StepStatus }> = ({ status }) => {
    const color =
        status === "success"
            ? "bg-[#94ff0b]"
            : status === "error"
            ? "bg-red-500"
            : status === "active"
            ? "bg-white animate-pulse"
            : "bg-gray-600";
    return <div className={`h-2.5 w-2.5 rounded-full ${color}`} />;
};

const Label: React.FC<{ status: StepStatus; text: string }> = ({
    status,
    text,
}) => {
    const color =
        status === "success"
            ? "text-[#94ff0b]"
            : status === "error"
            ? "text-red-500"
            : status === "active"
            ? "text-white"
            : "text-gray-400";
    return <span className={`text-xs ${color}`}>{text}</span>;
};

const TxProgress: React.FC<TxProgressProps> = ({
    approval,
    trade,
    className,
}) => {
    return (
        <div className={`flex items-center gap-3 ${className ?? ""}`}>
            <div className="flex items-center gap-2">
                <Dot status={approval} />
                <Label status={approval} text="Approval" />
            </div>
            <div className="h-px flex-1 bg-gray-700" />
            <div className="flex items-center gap-2">
                <Dot status={trade} />
                <Label status={trade} text="Trade" />
            </div>
        </div>
    );
};

export default TxProgress;
