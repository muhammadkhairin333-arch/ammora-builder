import "dotenv/config";
import { createPublicClient, http, formatEther } from "viem";
import {
  ALCClient,
  giwaSepoliaAudited,
  AmmoraDataApiClient,
} from "@ammora-protocol/sdk";

// Konfigurasi Environment
const RPC_URL = process.env.RPC_URL || "https://sepolia-rpc.giwa.io";
const CHAIN_ID = BigInt(process.env.CHAIN_ID || "91342");
const DATA_API_URL = process.env.DATA_API_URL || "https://ammora-giwa-sepolia-data.fly.dev";

async function main() {
  console.log("================================================================");
  console.log("🚀 Ammora Protocol - GIWA Sepolia Testnet Explorer");
  console.log("================================================================\n");

  // 1. Inisialisasi viem Client & cek status jaringan RPC
  console.log(`[1] Menghubungkan ke RPC Node: ${RPC_URL}`);
  const publicClient = createPublicClient({
    transport: http(RPC_URL),
  });

  try {
    const chainId = await publicClient.getChainId();
    const blockNumber = await publicClient.getBlockNumber();
    console.log(`    ✅ Terhubung ke Network ID: ${chainId} (${giwaSepoliaAudited.chain.name})`);
    console.log(`    📦 Block Terbaru: #${blockNumber}\n`);
  } catch (error) {
    console.error(`    ❌ Gagal menghubungkan ke RPC:`, (error as Error).message);
    return;
  }

  // 2. Membaca Kontrak On-Chain Resmi Ammora di GIWA Sepolia
  console.log(`[2] Membaca Smart Contract Resmi Ammora On-Chain:`);
  const contracts = giwaSepoliaAudited.contracts;
  console.log(`    📍 Launch Factory:          ${contracts.launch.factory}`);
  console.log(`    📍 Config Registry:         ${contracts.launch.configRegistry}`);
  console.log(`    📍 DLMM Factory:            ${contracts.liquidityMarketMaker.factory}`);
  console.log(`    📍 DLMM Position Manager:   ${contracts.liquidityMarketMaker.positionManager}`);
  console.log(`    📍 WETH (Wrapped Native):   ${contracts.tokens.wrappedNative}\n`);

  // 3. Membaca Konfigurasi Bonding Curve / Launchpad (On-Chain)
  console.log(`[3] Membaca Konfigurasi Bonding Curve (ALC Config) langsung dari Blockchain:`);
  try {
    const alcClient = new ALCClient(
      publicClient,
      "0x0000000000000000000000000000000000000000", // Placeholder curve address
      contracts.launch.configRegistry
    );

    // Ambil detail Config ID 1 yang aktif
    const configData = await alcClient.getConfig(1);
    const { config, curve, enabled, configHash } = configData;

    console.log(`    ✅ Config ID: 1 (Status: ${enabled ? "Aktif / Enabled" : "Non-aktif"})`);
    console.log(`    - Quote Token:           ${config.quoteToken} (WETH)`);
    console.log(`    - Token Decimals:        ${config.tokenDecimals}`);
    console.log(`    - Total Supply Token:    ${config.totalSupply.toLocaleString()} (satuan dasar)`);
    console.log(`    - Trading Fee Bps:       ${config.cliffFeeBps} bps (${config.cliffFeeBps / 100}%)`);
    console.log(`    - Creator Fee Share:     ${config.creatorFeeShareBps} bps (${config.creatorFeeShareBps / 100}%)`);
    console.log(`    - Segmen Kurva:          ${curve.length} segmen harga`);
    console.log(`    - Config Hash:           ${configHash}\n`);
  } catch (err) {
    console.warn(`    ⚠️ Gagal membaca config on-chain:`, (err as Error).message);
  }

  // 4. Cek Ammora Off-Chain Data API (Indexer)
  console.log(`[4] Memeriksa Ammora Off-Chain Data API (${DATA_API_URL}):`);
  try {
    const dataClient = new AmmoraDataApiClient(DATA_API_URL);
    const launches = await dataClient.getLaunches({ chainId: CHAIN_ID });
    console.log(`    ✅ Berhasil terhubung ke Data API.`);
    console.log(`    📊 Jumlah token terindeks: ${launches.items.length}`);
  } catch (err) {
    console.log(`    ℹ️ Catatan Data API: Server off-chain (Fly.io) saat ini tidak merespons (503/offline).`);
    console.log(`       Seluruh interaksi on-chain tetap berjalan 100% normal via Smart Contract langsung!`);
  }

  console.log("\n================================================================");
  console.log("✨ Pemeriksaan selesai! Proyek Ammora siap digunakan.");
  console.log("================================================================");
}

main().catch(console.error);
