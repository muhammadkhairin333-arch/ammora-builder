import React from "react";
import { Wallet, Globe, ExternalLink, AlertTriangle, CheckCircle2 } from "lucide-react";
import { GIWA_FAUCET_URL, GIWA_SEPOLIA_CHAIN_ID } from "../config/constants";

interface NavbarProps {
  address: string | null;
  chainId: number | null;
  balance: string;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  isConnecting: boolean;
  onConnect: () => void;
  onSwitchNetwork: () => void;
  onDisconnect: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  address,
  balance,
  isConnected,
  isCorrectNetwork,
  isConnecting,
  onConnect,
  onSwitchNetwork,
  onDisconnect,
}) => {
  return (
    <header style={{
      borderBottom: "1px solid var(--border-subtle)",
      background: "rgba(7, 9, 14, 0.8)",
      backdropFilter: "blur(12px)",
      position: "sticky",
      top: 0,
      zIndex: 50,
      padding: "16px 24px",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)",
          }}>
            <span style={{ fontWeight: 800, fontSize: "1.2rem", color: "#fff" }}>A</span>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.02em" }}>
                Ammora
              </span>
              <span className="badge badge-purple" style={{ fontSize: "0.65rem", padding: "2px 6px" }}>
                Builder Mission
              </span>
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Powered by @ammora-protocol/sdk
            </span>
          </div>
        </div>

        {/* Right actions: Faucet, Network & Wallet */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Faucet Link */}
          <a
            href={GIWA_FAUCET_URL}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
            style={{ padding: "8px 14px", fontSize: "0.85rem", textDecoration: "none" }}
          >
            <Globe size={15} color="var(--accent-cyan)" />
            <span>GIWA Faucet</span>
            <ExternalLink size={13} color="var(--text-muted)" />
          </a>

          {/* Network Pill */}
          {isConnected && (
            isCorrectNetwork ? (
              <div className="badge badge-emerald" style={{ padding: "8px 12px", fontSize: "0.8rem" }}>
                <CheckCircle2 size={14} />
                <span>GIWA Sepolia ({GIWA_SEPOLIA_CHAIN_ID})</span>
              </div>
            ) : (
              <button
                onClick={onSwitchNetwork}
                className="btn"
                style={{
                  background: "rgba(245, 158, 11, 0.2)",
                  color: "#fcd34d",
                  border: "1px solid rgba(245, 158, 11, 0.4)",
                  padding: "8px 14px",
                  fontSize: "0.85rem",
                }}
              >
                <AlertTriangle size={15} />
                <span>Ganti ke GIWA Sepolia</span>
              </button>
            )
          )}

          {/* Connect / User Button */}
          {isConnected && address ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                className="glass-panel-subtle"
                style={{
                  padding: "6px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span className="font-mono" style={{ fontSize: "0.85rem", color: "var(--accent-emerald)" }}>
                  {balance} ETH
                </span>
                <span style={{ color: "var(--border-subtle)" }}>|</span>
                <span className="font-mono" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </div>
              <button
                onClick={onDisconnect}
                className="btn btn-secondary"
                style={{ padding: "8px 12px", fontSize: "0.8rem", color: "var(--text-muted)" }}
                title="Disconnect"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="btn btn-primary"
              style={{ padding: "10px 18px", fontSize: "0.9rem" }}
            >
              <Wallet size={16} />
              <span>{isConnecting ? "Menghubungkan..." : "Connect Wallet"}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
