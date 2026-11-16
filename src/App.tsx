import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { LaunchpadTab } from "./components/LaunchpadTab";
import { SwapTab } from "./components/SwapTab";
import { ExplorerTab } from "./components/ExplorerTab";
import { useWallet } from "./hooks/useWallet";
import { Rocket, ArrowDownUp, Layers, Sparkles, ExternalLink, Code2 } from "lucide-react";
import { AMMORA_APP_URL, GIWA_SEPOLIA_EXPLORER } from "./config/constants";

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"launchpad" | "swap" | "explorer">("launchpad");
  const wallet = useWallet();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Navbar */}
      <Navbar
        address={wallet.address}
        chainId={wallet.chainId}
        balance={wallet.balance}
        isConnected={wallet.isConnected}
        isCorrectNetwork={wallet.isCorrectNetwork}
        isConnecting={wallet.isConnecting}
        onConnect={wallet.connectWallet}
        onSwitchNetwork={wallet.switchToGiwaSepolia}
        onDisconnect={wallet.disconnect}
      />

      {/* Hero / Navigation Tabs */}
      <main style={{ flex: 1, paddingBottom: "60px" }}>
        {/* Navigation Switcher Pills */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "32px", padding: "0 16px" }}>
          <div
            className="glass-panel"
            style={{
              padding: "6px",
              display: "inline-flex",
              gap: "6px",
              borderRadius: "14px",
            }}
          >
            <button
              onClick={() => setActiveTab("launchpad")}
              className="btn"
              style={{
                padding: "10px 20px",
                fontSize: "0.9rem",
                borderRadius: "10px",
                background: activeTab === "launchpad" ? "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)" : "transparent",
                color: activeTab === "launchpad" ? "#fff" : "var(--text-secondary)",
                boxShadow: activeTab === "launchpad" ? "0 4px 15px rgba(139, 92, 246, 0.3)" : "none",
              }}
            >
              <Rocket size={17} />
              <span>Launchpad</span>
            </button>

            <button
              onClick={() => setActiveTab("swap")}
              className="btn"
              style={{
                padding: "10px 20px",
                fontSize: "0.9rem",
                borderRadius: "10px",
                background: activeTab === "swap" ? "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)" : "transparent",
                color: activeTab === "swap" ? "#fff" : "var(--text-secondary)",
                boxShadow: activeTab === "swap" ? "0 4px 15px rgba(6, 182, 212, 0.3)" : "none",
              }}
            >
              <ArrowDownUp size={17} />
              <span>Swap / DEX</span>
            </button>

            <button
              onClick={() => setActiveTab("explorer")}
              className="btn"
              style={{
                padding: "10px 20px",
                fontSize: "0.9rem",
                borderRadius: "10px",
                background: activeTab === "explorer" ? "rgba(255, 255, 255, 0.12)" : "transparent",
                color: activeTab === "explorer" ? "#fff" : "var(--text-secondary)",
              }}
            >
              <Layers size={17} />
              <span>Kontrak & Info</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "launchpad" && (
          <LaunchpadTab
            address={wallet.address}
            isConnected={wallet.isConnected}
            isCorrectNetwork={wallet.isCorrectNetwork}
            onConnect={wallet.connectWallet}
            onSwitchNetwork={wallet.switchToGiwaSepolia}
            onSuccess={wallet.refreshBalance}
          />
        )}

        {activeTab === "swap" && (
          <SwapTab
            address={wallet.address}
            balance={wallet.balance}
            isConnected={wallet.isConnected}
            isCorrectNetwork={wallet.isCorrectNetwork}
            onConnect={wallet.connectWallet}
            onSwitchNetwork={wallet.switchToGiwaSepolia}
            onSuccess={wallet.refreshBalance}
          />
        )}

        {activeTab === "explorer" && <ExplorerTab />}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border-subtle)",
        background: "rgba(7, 9, 14, 0.95)",
        padding: "24px 20px",
        marginTop: "auto",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            <Sparkles size={16} color="var(--accent-purple)" />
            <span>Built for <strong>Ammora Season 2 Builder Mission</strong> on GIWA Sepolia</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "0.85rem" }}>
            <a
              href={AMMORA_APP_URL}
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--text-secondary)", textDecoration: "none" }}
            >
              Ammora Official
            </a>
            <a
              href={GIWA_SEPOLIA_EXPLORER}
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--text-secondary)", textDecoration: "none" }}
            >
              GIWA Explorer
            </a>
            <a
              href="https://github.com/ammora-labs/ammora-protocol"
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--text-secondary)", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}
            >
              <Code2 size={14} />
              <span>Ammora SDK</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
