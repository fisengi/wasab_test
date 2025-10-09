import type { Address, Hash } from "viem";

type Explorer = {
    name: string;
    baseUrl: string; // example: https://etherscan.io
};

// Extend as needed; fall back to Etherscan-style if unknown.
const CHAIN_ID_TO_EXPLORER: Record<number, Explorer> = {
    1: { name: "Etherscan", baseUrl: "https://etherscan.io" },
    10: {
        name: "Optimistic Etherscan",
        baseUrl: "https://optimistic.etherscan.io",
    },
    56: { name: "BscScan", baseUrl: "https://bscscan.com" },
    137: { name: "Polygonscan", baseUrl: "https://polygonscan.com" },
    42161: { name: "Arbiscan", baseUrl: "https://arbiscan.io" },
    8453: { name: "BaseScan", baseUrl: "https://basescan.org" },
    11155111: {
        name: "Sepolia Etherscan",
        baseUrl: "https://sepolia.etherscan.io",
    },
    421614: {
        name: "Arbiscan (Sepolia)",
        baseUrl: "https://sepolia.arbiscan.io",
    },
};

export function getExplorer(chainId?: number): Explorer | undefined {
    if (!chainId) return undefined;
    return CHAIN_ID_TO_EXPLORER[chainId];
}

export function getTxUrl(
    chainId: number | undefined,
    hash: Hash | undefined
): string | undefined {
    if (!chainId || !hash) return undefined;
    const ex = getExplorer(chainId);
    if (!ex) return undefined;
    return `${ex.baseUrl}/tx/${hash}`;
}

export function getAddressUrl(
    chainId: number | undefined,
    address: Address | undefined
): string | undefined {
    if (!chainId || !address) return undefined;
    const ex = getExplorer(chainId);
    if (!ex) return undefined;
    return `${ex.baseUrl}/address/${address}`;
}
