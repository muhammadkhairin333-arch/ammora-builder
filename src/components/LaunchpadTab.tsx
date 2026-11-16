import React, { useState } from "react";
import { Rocket, Sparkles, ExternalLink, CheckCircle, ShieldAlert, Coins } from "lucide-react";
import {
  buildCreateALCSegmentedV3LaunchWithTokenConfig,
} from "@ammora-protocol/sdk";
import { createWalletClient, custom, type Address } from "viem";
import {
  AMMORA_CONTRACTS,
  DEFAULT_CONFIG_ID,
  DEFAULT_TOKEN_DECIMALS,
  DEFAULT_TOTAL_SUPPLY,
  GIWA_SEPOLIA_EXPLORER,
  giwaSepoliaChain,
} from "../config/constants";

interface LaunchpadTabProps {
  address: Address | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  onConnect: () => void;
  onSwitchNetwork: () => void;
  onSuccess: () => void;
}

export const LaunchpadTab: React.FC<LaunchpadTabProps> = ({
  address,
  isConnected,
  isCorrectNetwork,
  onConnect,
  onSwitchNetwork,
  onSuccess,
}) => {
  const [name, setName] = useState("Ammora Builder Token");
  const [symbol, setSymbol] = useState("BUILD");
  const [description, setDescription] = useState("Official token launched for Ammora Season 2 Builder Mission on GIWA Sepolia.");
  const [logoUri, setLogoUri] = useState("https://api.dicebear.com/7.x/identicon/svg?seed=AmmoraBuild");
  const [isLaunching, setIsLaunching] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setTxHash(null);

    if (!isConnected || !address) {
      onConnect();
      return;
    }

    if (!isCorrectNetwork) {
      onSwitchNetwork();
      return;
    }

    if (!name.trim() || !symbol.trim()) {
      setErrorMsg("Nama dan simbol token wajib diisi.");
      return;
    }

    setIsLaunching(true);

    try {
      // 1. Buat metadata token URI
      const metadataUri = JSON.stringify({
        name,
        symbol,
        description,
        image: logoUri,
      });

      // 2. Siapkan calldata pembuatan token melalui Ammora SDK
      console.log("Building launch transaction with Ammora SDK...");
      const launchTx = buildCreateALCSegmentedV3LaunchWithTokenConfig(
        name,
        symbol,
        metadataUri,
        "", // creator metadata URI
        DEFAULT_CONFIG_ID, // Config ID 1 (Official GIWA Sepolia Config)
        DEFAULT_TOKEN_DECIMALS, // 9 decimals
        0n // pool creation fee (0 ETH)
      );

      console.log("Calldata generated:", launchTx.data.slice(0, 32) + "...");

      // 3. Kirim transaksi melalui wallet pengguna
      const walletClient = createWalletClient({
        chain: giwaSepoliaChain,
        transport: custom(window.ethereum),
      });

      const hash = await walletClient.sendTransaction({
        account: address,
        to: AMMORA_CONTRACTS.launchFactory as Address,
        data: launchTx.data,
        value: launchTx.value,
      });

      console.log("Transaction sent with hash:", hash);
      setTxHash(hash);
      onSuccess();
    } catch (err: any) {
      console.error("Launch error:", err);
      setErrorMsg(err?.shortMessage || err?.message || "Transaksi peluncuran token gagal.");
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", padding: "30px 20px" }}>
      {/* Intro Banner */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div className="badge badge-purple" style={{ marginBottom: "12px", gap: "8px" }}>
          <Sparkles size={14} color="var(--accent-purple)" />
          <span>Ammora Season 2 — Builder Mission</span>
        </div>
        <h1 style={{ fontSize: "2.4rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "10px" }}>
          Launchpad Token Ammora
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto" }}>
          Luncurkan token ERC-20 dengan Segmented Dynamic Bonding Curve otomatis di GIWA Sepolia menggunakan <code className="font-mono" style={{ color: "var(--accent-cyan)" }}>@ammora-protocol/sdk</code>.
        </p>
      </div>

      {/* Main Grid: Form + Live Preview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
        {/* Form Panel */}
        <div className="glass-panel" style={{ padding: "28px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Rocket size={20} color="var(--accent-purple)" />
            <span>Detail Peluncuran Token</span>
          </h2>

          <form onSubmit={handleLaunch}>
            <div className="input-group">
              <label className="input-label">Nama Token</label>
              <input
                type="text"
                className="input-field"
                placeholder="misal: Ammora Builder Token"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setLogoUri(`https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(e.target.value || "Ammora")}`);
                }}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Simbol Token (Ticker)</label>
              <input
                type="text"
                className="input-field font-mono"
                placeholder="misal: BUILD"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                maxLength={8}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Deskripsi Token</label>
              <textarea
                className="input-field"
                style={{ resize: "vertical", minHeight: "80px", fontFamily: "inherit" }}
                placeholder="Tuliskan tujuan atau roadmap singkat token..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Parameter Bawaan Ammora Protocol */}
            <div className="glass-panel-subtle" style={{ padding: "14px 16px", marginBottom: "22px" }}>
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.05em" }}>
                Parameter Protokol (Config ID #1)
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px", fontSize: "0.85rem" }}>
                <div>
                  <span style={{ color: "var(--text-secondary)" }}>Total Supply:</span>
                  <div className="font-mono" style={{ fontWeight: 600 }}>{DEFAULT_TOTAL_SUPPLY.toLocaleString()}</div>
                </div>
                <div>
                  <span style={{ color: "var(--text-secondary)" }}>Token Decimals:</span>
                  <div className="font-mono" style={{ fontWeight: 600 }}>{DEFAULT_TOKEN_DECIMALS}</div>
                </div>
                <div>
                  <span style={{ color: "var(--text-secondary)" }}>Creator Fee Share:</span>
                  <div className="font-mono" style={{ color: "var(--accent-emerald)", fontWeight: 600 }}>20%</div>
                </div>
                <div>
                  <span style={{ color: "var(--text-secondary)" }}>Creation Fee:</span>
                  <div className="font-mono" style={{ color: "var(--accent-cyan)", fontWeight: 600 }}>0 ETH</div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div style={{
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "var(--radius-md)",
                padding: "12px 14px",
                marginBottom: "18px",
                display: "flex",
                gap: "10px",
                color: "#fca5a5",
                fontSize: "0.85rem",
              }}>
                <ShieldAlert size={18} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Message */}
            {txHash && (
              <div style={{
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "var(--radius-md)",
                padding: "14px 16px",
                marginBottom: "20px",
                color: "#6ee7b7",
                fontSize: "0.85rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, marginBottom: "6px" }}>
                  <CheckCircle size={18} />
                  <span>Token Berhasil Diluncurkan!</span>
                </div>
                <p style={{ color: "var(--text-secondary)", marginBottom: "10px" }}>
                  Transaksi telah dikirim ke GIWA Sepolia dan sedang diproses oleh validator.
                </p>
                <a
                  href={`${GIWA_SEPOLIA_EXPLORER}/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ padding: "6px 12px", fontSize: "0.8rem", width: "100%", textDecoration: "none" }}
                >
                  <span>Lihat Transaksi di GIWA Explorer</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            )}

            {/* Launch Button */}
            {!isConnected ? (
              <button type="button" onClick={onConnect} className="btn btn-primary" style={{ width: "100%" }}>
                Hubungkan Wallet untuk Launch
              </button>
            ) : !isCorrectNetwork ? (
              <button type="button" onClick={onSwitchNetwork} className="btn" style={{ width: "100%", background: "#f59e0b", color: "#000" }}>
                Ganti Jaringan ke GIWA Sepolia
              </button>
            ) : (
              <button type="submit" disabled={isLaunching} className="btn btn-primary" style={{ width: "100%" }}>
                <Rocket size={18} />
                <span>{isLaunching ? "Membuat Token di Ammora..." : "Luncurkan Token Sekarang"}</span>
              </button>
            )}
          </form>
        </div>

        {/* Live Token Preview Card */}
        <div>
          <div className="glass-panel" style={{ padding: "28px", position: "sticky", top: "90px" }}>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.05em" }}>
              Pratinjau Token (Live Card)
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "20px 0" }}>
              <img
                src={logoUri}
                alt="Token Logo"
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  border: "2px solid var(--border-subtle)",
                  background: "rgba(255,255,255,0.05)",
                }}
              />
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>{name || "Token Baru"}</h3>
                <span className="badge badge-purple font-mono" style={{ fontSize: "0.75rem", marginTop: "4px" }}>
                  ${symbol || "TICKER"}
                </span>
              </div>
            </div>

            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5", marginBottom: "20px" }}>
              {description || "Deskripsi token akan muncul di sini..."}
            </p>

            <div className="glass-panel-subtle" style={{ padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>Tipe Kurva:</span>
                <span style={{ fontWeight: 600 }}>Segmented DBC V3</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>Pasangan Trading:</span>
                <span className="font-mono" style={{ fontWeight: 600 }}>${symbol || "TICKER"} / WETH</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>Graduation Target:</span>
                <span style={{ color: "var(--accent-cyan)", fontWeight: 600 }}>Auto-Migrate to ALMM</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>Verified Target:</span>
                <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {AMMORA_CONTRACTS.launchFactory.slice(0, 10)}...
                </span>
              </div>
            </div>

            <div style={{ marginTop: "20px", padding: "12px", borderRadius: "var(--radius-md)", background: "rgba(139, 92, 246, 0.08)", border: "1px dashed rgba(139, 92, 246, 0.3)" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <Coins size={16} color="var(--accent-purple)" style={{ marginTop: "2px", flexShrink: 0 }} />
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                  Misi Builder Ammora terpenuhi ketika Anda meluncurkan aplikasi ini dan melakukan transaksi via Ammora SDK!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
