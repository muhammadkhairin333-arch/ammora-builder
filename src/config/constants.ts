import { giwaSepoliaAudited } from "@ammora-protocol/sdk";
import { defineChain } from "viem";

export const GIWA_SEPOLIA_CHAIN_ID = 91342;
export const GIWA_SEPOLIA_HEX_CHAIN_ID = "0x164ce"; // 91342 in hex
export const GIWA_SEPOLIA_RPC = "https://sepolia-rpc.giwa.io";
export const GIWA_SEPOLIA_EXPLORER = "https://sepolia-explorer.giwa.io";
export const GIWA_FAUCET_URL = "https://faucet.giwa.io";
export const NODIT_FAUCET_URL = "https://faucet.nodit.io";
export const AMMORA_APP_URL = "https://ammora.org";

export const giwaSepoliaChain = defineChain({
  id: GIWA_SEPOLIA_CHAIN_ID,
  name: "GIWA Sepolia",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [GIWA_SEPOLIA_RPC],
    },
  },
  blockExplorers: {
    default: {
      name: "GIWA Explorer",
      url: GIWA_SEPOLIA_EXPLORER,
    },
  },
  testnet: true,
});

export const AMMORA_CONTRACTS = {
  launchFactory: giwaSepoliaAudited.contracts.launch.factory,
  configRegistry: giwaSepoliaAudited.contracts.launch.configRegistry,
  firstBuyExecutor: giwaSepoliaAudited.contracts.launch.firstBuyExecutor,
  metadataRegistry: giwaSepoliaAudited.contracts.launch.metadataRegistry,
  dlmmFactory: giwaSepoliaAudited.contracts.liquidityMarketMaker.factory,
  dlmmPositionManager: giwaSepoliaAudited.contracts.liquidityMarketMaker.positionManager,
  nativeRouter: giwaSepoliaAudited.contracts.routers.native,
  wrappedNative: giwaSepoliaAudited.contracts.tokens.wrappedNative,
};

// Ammora DBC Config 1 Parameters
export const DEFAULT_CONFIG_ID = 1n;
export const DEFAULT_TOKEN_DECIMALS = 9;
export const DEFAULT_TOTAL_SUPPLY = 7_500_000_000;
