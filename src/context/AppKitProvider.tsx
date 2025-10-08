import React from "react";
import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config, networks, projectId, wagmiAdapter } from "../config";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
        },
    },
});

const metadata = {
    name: "Wasab Test",
    description: "Wallet connection via Reown AppKit",
    url:
        typeof window !== "undefined"
            ? window.location.origin
            : "http://localhost:3000",
    icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

createAppKit({
    adapters: [wagmiAdapter],
    projectId: projectId!,
    networks,
    metadata,
    features: { analytics: true },
});

export function AppKitProvider({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
