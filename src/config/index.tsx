import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { arbitrum, mainnet, sepolia } from "@reown/appkit/networks";
import type { Chain } from "viem";

export const projectId = "2255b5100fcd803f70e8c8fb846d976e";

if (!projectId) {
    // Fail fast during build/runtime if env is missing
    throw new Error(
        "REACT_APP_REOWN_PROJECT_ID is not defined. Please set it in .env.local"
    );
}

export const networks: [Chain, ...Chain[]] = [sepolia, mainnet, arbitrum];

export const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId,
    ssr: true,
    // ssr is not needed for CRA/SPA; default false
});

export const config = wagmiAdapter.wagmiConfig;
