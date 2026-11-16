import React, { useState, useEffect } from "react";
import { Copy, Check, ExternalLink, Activity, ShieldCheck, Database, Layers } from "lucide-react";
import { createPublicClient, http } from "viem";
import {
  AMMORA_CONTRACTS,
  GIWA_SEPOLIA_CHAIN_ID,
  GIWA_SEPOLIA_EXPLORER,
  GIWA_SEPOLIA_RPC,
} from "../config/constants";

export const ExplorerTab: React.FC = () => {
  const [currentBlock, setCurrentBlock] = useState<bigint | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isLoadingBlock, setIsLoadingBlock] = useState(false);

  useEffect(() => {
    const client = createPublicClient({
      transport: http(GIWA_SEPOLIA_RPC),
    });

    const fetchBlock = async () => {
      try {
        setIsLoadingBlock(true);
        const block = await client.getBlockNumber();
        setCurrentBlock(block);
      } catch (e) {
        console.error("Failed to fetch block number", e);
      } finally {
        setIsLoadingBlock(false);
      }
    };

    fetchBlock();
    const interval = setInterval(fetchBlock, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const contractList = [
    {
      name: "Launch Factory (ALC V3)",
      address: AMMORA_CONTRACTS.launchFactory,
      desc: "Membuat token ERC-20 dan kurva bonding curve tersegmentasi.",
      role: "Core Factory",
    },
    {
      name: "Config Registry",
      address: AMMORA_CONTRACTS.configRegistry,
      desc: "Menyimpan konfigurasi parameter peluncuran resmi (Config #1).",
      role: "Registry",
    },
    {
      name: "DLMM / ALMM Pool Factory",
      address: AMMORA_CONTRACTS.dlmmFactory,
      desc: "Pusat pool likuiditas berbasis bin untuk pasar terdesentralisasi.",
      role: "AMM Engine",
    },
    {
      name: "DLMM Position Manager",
      address: AMMORA_CONTRACTS.dlmmPositionManager,
      desc: "Pengelola posisi likuiditas NFT, klaim fee, dan rebalancing.",
      role: "Liquidity",
    },
    {
      name: "Ammora Native Router",
      address: AMMORA_CONTRACTS.nativeRouter,
      desc: "Router swap multi-path untuk eksekusi swap dengan Native ETH.",
      role: "Router",
    },
    {
      name: "Wrapped Native (WETH)",
      address: AMMORA_CONTRACTS.wrappedNative,
      desc: "Aset dasar quote token pada pool Ammora di GIWA Sepolia.",
      role: "Asset",
    },
  ];

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", padding: "30px 20px" }}>
      {/* Network Live Monitor */}
      <div className="glass-panel" style={{ padding: "24px 28px", marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-emerald)",
          }}>
            <Activity size={24} className={isLoadingBlock ? "animate-pulse" : ""} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>GIWA Sepolia Testnet</h2>
              <span className="badge badge-emerald" style={{ fontSize: "0.7rem" }}>Live Node</span>
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "2px" }}>
              Chain ID: <code className="font-mono">{GIWA_SEPOLIA_CHAIN_ID}</code> • RPC: <code className="font-mono">{GIWA_SEPOLIA_RPC}</code>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.05em" }}>
            Block Height Terbaru
          </span>
          <div className="font-mono" style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--accent-emerald)" }}>
            {currentBlock ? `#${currentBlock.toLocaleString()}` : "Memuat..."}
          </div>
        </div>
      </div>

      {/* Contract Registry Section */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <Database size={20} color="var(--accent-purple)" />
          <h3 style={{ fontSize: "1.3rem", fontWeight: 700 }}>Katalog Kontrak Resmi Ammora Protocol</h3>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Daftar alamat smart contract resmi yang terverifikasi dan diakses secara langsung oleh aplikasi ini via SDK.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "18px" }}>
        {contractList.map((contract) => (
          <div key={contract.name} className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{contract.name}</h4>
                <span className="badge badge-purple" style={{ fontSize: "0.65rem" }}>{contract.role}</span>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: "1.4", marginBottom: "16px" }}>
                {contract.desc}
              </p>
            </div>

            <div className="glass-panel-subtle" style={{ padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="font-mono" style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {contract.address.slice(0, 10)}...{contract.address.slice(-8)}
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => copyToClipboard(contract.address, contract.name)}
                  className="btn btn-secondary"
                  style={{ padding: "6px 8px", fontSize: "0.75rem" }}
                  title="Salin Alamat"
                >
                  {copiedKey === contract.name ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                </button>
                <a
                  href={`${GIWA_SEPOLIA_EXPLORER}/address/${contract.address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ padding: "6px 8px", fontSize: "0.75rem", textDecoration: "none" }}
                  title="Lihat di Explorer"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
