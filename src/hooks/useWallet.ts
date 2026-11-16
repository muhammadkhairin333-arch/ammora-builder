import { useState, useEffect, useCallback } from "react";
import { createPublicClient, custom, formatEther, type Address } from "viem";
import {
  GIWA_SEPOLIA_CHAIN_ID,
  GIWA_SEPOLIA_HEX_CHAIN_ID,
  GIWA_SEPOLIA_RPC,
  GIWA_SEPOLIA_EXPLORER,
  giwaSepoliaChain,
} from "../config/constants";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useWallet() {
  const [address, setAddress] = useState<Address | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCorrectNetwork = chainId === GIWA_SEPOLIA_CHAIN_ID;

  // Refresh balance
  const refreshBalance = useCallback(async (walletAddress: Address) => {
    try {
      const publicClient = createPublicClient({
        chain: giwaSepoliaChain,
        transport: custom(window.ethereum),
      });
      const bal = await publicClient.getBalance({ address: walletAddress });
      setBalance(Number(formatEther(bal)).toFixed(4));
    } catch {
      try {
        const publicClient = createPublicClient({
          chain: giwaSepoliaChain,
          transport: custom(window.ethereum),
        });
        const bal = await publicClient.getBalance({ address: walletAddress });
        setBalance(Number(formatEther(bal)).toFixed(4));
      } catch (e) {
        console.error("Failed to fetch balance", e);
      }
    }
  }, []);

  // Connect Wallet
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError("Wallet (MetaMask/Rabby) tidak ditemukan. Silakan pasang wallet extension.");
      return;
    }

    setIsConnecting(true);
    setError(null);
    localStorage.removeItem("ammora_disconnected");

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts[0]) {
        const userAddress = accounts[0] as Address;
        setAddress(userAddress);

        const currentChainHex = await window.ethereum.request({
          method: "eth_chainId",
        });
        const currentChain = parseInt(currentChainHex, 16);
        setChainId(currentChain);

        if (currentChain === GIWA_SEPOLIA_CHAIN_ID) {
          await refreshBalance(userAddress);
        }
      }
    } catch (err: any) {
      console.error("Connection error:", err);
      setError(err?.message || "Gagal menghubungkan wallet.");
    } finally {
      setIsConnecting(false);
    }
  }, [refreshBalance]);

  // Switch / Add GIWA Sepolia
  const switchToGiwaSepolia = useCallback(async () => {
    if (!window.ethereum) return;
    setError(null);

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: GIWA_SEPOLIA_HEX_CHAIN_ID }],
      });
      setChainId(GIWA_SEPOLIA_CHAIN_ID);
      if (address) {
        await refreshBalance(address);
      }
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: GIWA_SEPOLIA_HEX_CHAIN_ID,
                chainName: "GIWA Sepolia",
                nativeCurrency: {
                  name: "Ether",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: [GIWA_SEPOLIA_RPC],
                blockExplorerUrls: [GIWA_SEPOLIA_EXPLORER],
              },
            ],
          });
          setChainId(GIWA_SEPOLIA_CHAIN_ID);
          if (address) {
            await refreshBalance(address);
          }
        } catch (addError: any) {
          setError(addError?.message || "Gagal menambahkan jaringan GIWA Sepolia.");
        }
      } else {
        setError(switchError?.message || "Gagal beralih jaringan.");
      }
    }
  }, [address, refreshBalance]);

  // Disconnect & Revoke Permission in Rabby / MetaMask
  const disconnect = useCallback(async () => {
    localStorage.setItem("ammora_disconnected", "true");
    setAddress(null);
    setChainId(null);
    setBalance("0");

    try {
      if (window.ethereum?.request) {
        // Minta Rabby / MetaMask mencabut permission situs ini
        await window.ethereum.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }],
        });
      }
    } catch (e) {
      console.log("wallet_revokePermissions selesai atau dilewati", e);
    }
  }, []);

  // Listen for wallet events
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      const manuallyDisconnected = localStorage.getItem("ammora_disconnected") === "true";
      if (manuallyDisconnected) return;

      if (accounts.length > 0) {
        const newAddress = accounts[0] as Address;
        setAddress(newAddress);
        refreshBalance(newAddress);
      } else {
        setAddress(null);
        setChainId(null);
        setBalance("0");
      }
    };

    const handleChainChanged = (hexChain: string) => {
      const newChain = parseInt(hexChain, 16);
      setChainId(newChain);
      if (address && newChain === GIWA_SEPOLIA_CHAIN_ID) {
        refreshBalance(address);
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    // Initial check (hanya jalan jika user belum klik disconnect)
    const manuallyDisconnected = localStorage.getItem("ammora_disconnected") === "true";
    if (!manuallyDisconnected) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            const userAddress = accounts[0] as Address;
            setAddress(userAddress);
            window.ethereum
              .request({ method: "eth_chainId" })
              .then((hex: string) => {
                const currentChain = parseInt(hex, 16);
                setChainId(currentChain);
                if (currentChain === GIWA_SEPOLIA_CHAIN_ID) {
                  refreshBalance(userAddress);
                }
              });
          }
        })
        .catch(console.error);
    }

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [address, refreshBalance]);

  return {
    address,
    chainId,
    balance,
    isConnected: !!address,
    isCorrectNetwork,
    isConnecting,
    error,
    connectWallet,
    switchToGiwaSepolia,
    disconnect,
    refreshBalance: () => address && refreshBalance(address),
  };
}
