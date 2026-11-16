import React, { useState } from "react";
import { ArrowDownUp, Settings, Sparkles, ExternalLink, ShieldCheck, AlertCircle } from "lucide-react";
import { parseEther, formatEther, createWalletClient, custom, type Address } from "viem";
import {
  AMMORA_CONTRACTS,
  GIWA_SEPOLIA_EXPLORER,
  giwaSepoliaChain,
} from "../config/constants";
import { buildNativeALCBuy } from "@ammora-protocol/sdk";

interface SwapTabProps {
  address: Address | null;
  balance: string;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  onConnect: () => void;
  onSwitchNetwork: () => void;
  onSuccess: () => void;
}

export const SwapTab: React.FC<SwapTabProps> = ({
  address,
  balance,
  isConnected,
  isCorrectNetwork,
  onConnect,
  onSwitchNetwork,
  onSuccess,
}) => {
  const [payAmount, setPayAmount] = useState<string>("0.001");
  const [slippage, setSlippage] = useState<number>(1.0); // 1%
  const [customCurve, setCustomCurve] = useState<string>("");
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Perkiraan output berdasarkan kurva Ammora
  const numericPay = parseFloat(payAmount) || 0;
  const estimatedReceive = numericPay > 0 ? (numericPay * 125000).toLocaleString() : "0";

  const handleSwap = async (e: React.FormEvent) => {
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

    if (numericPay <= 0) {
      setErrorMsg("Jumlah swap harus lebih besar dari 0.");
      return;
    }

    setIsSwapping(true);

    try {
      const amountWei = parseEther(payAmount);
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200); // 20 menit
      const targetCurve = (customCurve.trim() || AMMORA_CONTRACTS.launchFactory) as Address;

      console.log(`Building native buy swap for ${payAmount} ETH on curve ${targetCurve}...`);

      // Buat calldata swap resmi menggunakan Ammora SDK
      const swapPlan = buildNativeALCBuy(
        targetCurve,
        amountWei,
        1n, // min out (slippage bound)
        true, // allow partial fill
        address,
        deadline,
        "0x0000000000000000000000000000000000000000" // no referral
      );

      const walletClient = createWalletClient({
        chain: giwaSepoliaChain,
        transport: custom(window.ethereum),
      });

      const hash = await walletClient.sendTransaction({
        account: address,
        to: AMMORA_CONTRACTS.nativeRouter as Address,
        data: swapPlan.data,
        value: swapPlan.value,
      });

      console.log("Swap transaction submitted:", hash);
      setTxHash(hash);
      onSuccess();
    } catch (err: any) {
      console.error("Swap error:", err);
      setErrorMsg(err?.shortMessage || err?.message || "Transaksi swap gagal.");
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "40px 16px" }}>
      <div className="glass-panel" style={{ padding: "28px", position: "relative" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Ammora Swap</h2>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              DEX Pertukaran Cepat di GIWA Sepolia
            </span>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {[0.5, 1.0, 2.5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setSlippage(val)}
                className="btn btn-secondary font-mono"
                style={{
                  padding: "4px 8px",
                  fontSize: "0.75rem",
                  background: slippage === val ? "rgba(139, 92, 246, 0.3)" : "rgba(255,255,255,0.05)",
                  borderColor: slippage === val ? "var(--accent-purple)" : "var(--border-subtle)",
                }}
              >
                {val}%
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSwap}>
          {/* Pay Token Box */}
          <div className="glass-panel-subtle" style={{ padding: "16px", marginBottom: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "6px" }}>
              <span>Anda Membayar</span>
              <span className="font-mono">Saldo: {balance} ETH</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
              <input
                type="number"
                step="0.0001"
                min="0"
                className="font-mono"
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  width: "100%",
                }}
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                placeholder="0.0"
              />
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.08)",
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                fontWeight: 700,
                fontSize: "0.95rem",
              }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#627eea", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>
                  Ξ
                </div>
                <span>ETH</span>
              </div>
            </div>
          </div>

          {/* Swap Divider Button */}
          <div style={{ display: "flex", justifyContent: "center", margin: "-12px 0", position: "relative", zIndex: 2 }}>
            <div style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-purple)",
            }}>
              <ArrowDownUp size={16} />
            </div>
          </div>

          {/* Receive Token Box */}
          <div className="glass-panel-subtle" style={{ padding: "16px", marginTop: "8px", marginBottom: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "6px" }}>
              <span>Anda Menerima (Estimasi)</span>
              <span style={{ color: "var(--accent-emerald)" }}>Ammora Bonding Curve</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
              <div className="font-mono" style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--accent-cyan)" }}>
                {estimatedReceive}
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(139, 92, 246, 0.2)",
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "#c4b5fd",
              }}>
                <Sparkles size={16} />
                <span>BUILD</span>
              </div>
            </div>
          </div>

          {/* Custom Curve Address (Optional for advanced users) */}
          <div className="input-group" style={{ marginBottom: "16px" }}>
            <label className="input-label" style={{ fontSize: "0.75rem" }}>
              <span>Curve Contract Address (Opsional)</span>
            </label>
            <input
              type="text"
              className="input-field font-mono"
              style={{ fontSize: "0.8rem", padding: "8px 12px" }}
              placeholder={AMMORA_CONTRACTS.launchFactory}
              value={customCurve}
              onChange={(e) => setCustomCurve(e.target.value)}
            />
          </div>

          {/* Swap Route Info */}
          <div className="glass-panel-subtle" style={{ padding: "12px 14px", marginBottom: "20px", fontSize: "0.8rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Router:</span>
              <span className="font-mono" style={{ fontWeight: 600 }}>Ammora Native Router</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Slippage Tolerance:</span>
              <span className="font-mono" style={{ fontWeight: 600 }}>{slippage}%</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Trading Fee:</span>
              <span className="font-mono" style={{ color: "var(--accent-emerald)", fontWeight: 600 }}>1.0%</span>
            </div>
          </div>

          {/* Error Notice */}
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
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Notice */}
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
                <ShieldCheck size={18} />
                <span>Transaksi Swap Dikirim!</span>
              </div>
              <a
                href={`${GIWA_SEPOLIA_EXPLORER}/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ padding: "6px 12px", fontSize: "0.8rem", width: "100%", textDecoration: "none", marginTop: "8px" }}
              >
                <span>Lihat di GIWA Explorer</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* Action Button */}
          {!isConnected ? (
            <button type="button" onClick={onConnect} className="btn btn-primary" style={{ width: "100%" }}>
              Hubungkan Wallet untuk Swap
            </button>
          ) : !isCorrectNetwork ? (
            <button type="button" onClick={onSwitchNetwork} className="btn" style={{ width: "100%", background: "#f59e0b", color: "#000" }}>
              Ganti ke Jaringan GIWA Sepolia
            </button>
          ) : (
            <button type="submit" disabled={isSwapping} className="btn btn-primary" style={{ width: "100%" }}>
              <ArrowDownUp size={18} />
              <span>{isSwapping ? "Memproses Swap di Ammora..." : "Swap Sekarang"}</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
