# 🚀 Ammora Launchpad & DEX — GIWA Sepolia

A decentralized Launchpad and Swap (DEX) web application built with **`@ammora-protocol/sdk`** and **`viem`** on the **GIWA Sepolia Testnet** (`chainId: 91342`).

This project was built to fulfill the **Ammora Season 2 Builder Mission**: *"Ship an exchange or launchpad with the Ammora SDK"*.

---

## ✨ Fitur Utama

1. **Token Launchpad (Segmented Bonding Curve):**
   - Meluncurkan token ERC-20 kustom secara instan di GIWA Sepolia.
   - Menggunakan calldata builder resmi Ammora (`buildCreateALCSegmentedV3LaunchWithTokenConfig`).
   - Terintegrasi dengan parameter kurva resmi Ammora (Config ID #1: total supply 7.5 Miliar, 20% creator fee share, 0 ETH creation fee).

2. **Ammora Swap & DEX:**
   - Menukar native testnet ETH dengan token di kurva Ammora.
   - Menggunakan `buildNativeALCBuy` dan terhubung langsung ke Ammora Native Router.
   - Pilihan toleransi slippage (0.5%, 1.0%, 2.5%).

3. **Katalog Kontrak & Monitor Node:**
   - Menampilkan alamat smart contract terverifikasi di GIWA Sepolia (Launch Factory, Config Registry, DLMM Factory, WETH).
   - Real-time block height tracker.

4. **Koneksi Wallet Multi-EVM:**
   - Mendukung MetaMask, Rabby, dan wallet EVM lainnya.
   - Fitur otomatis untuk beralih atau menambahkan jaringan **GIWA Sepolia Testnet** ke wallet dengan 1 klik.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Web3 SDK:** [`@ammora-protocol/sdk`](https://www.npmjs.com/package/@ammora-protocol/sdk)
- **EVM Client:** [`viem`](https://viem.sh/)
- **UI & Icons:** Lucide React + Glassmorphism Dark Theme Styling

---

## 🚀 Panduan Menjalankan Secara Lokal

### 1. Clone & Install Dependensi
```bash
npm install
```

### 2. Jalankan Mode Development
```bash
npm run dev
```
Buka browser di `http://localhost:5173`.

### 3. Build untuk Production
```bash
npm run build
```

---

## 🌐 Cara Deploy ke Vercel (Untuk Mendapatkan Link Misi)

Untuk menyelesaikan **Ammora Builder Mission**, Anda perlu link website yang aktif secara online:

1. Buat repositori baru di GitHub (misal: `ammora-builder-mission`), lalu push folder ini:
   ```bash
   git init
   git add .
   git commit -m "feat: Ammora Launchpad & DEX for Builder Mission"
   git branch -M main
   git remote add origin https://github.com/USERNAME/ammora-builder-mission.git
   git push -u origin main
   ```
2. Buka [Vercel](https://vercel.com) dan login dengan akun GitHub Anda.
3. Klik **"Add New"** > **"Project"**, lalu import repositori `ammora-builder-mission`.
4. Biarkan konfigurasi default (Framework Preset: **Vite**, Root Directory: `./`).
5. Klik **"Deploy"**! Dalam 1 menit, Anda akan mendapatkan URL publik seperti `https://ammora-launchpad-dex.vercel.app`.

---

## 🏆 Cara Submit ke Ammora Season 2 Builder Mission

1. **Buka Website Anda:** Hubungkan wallet Rabby Anda ke jaringan GIWA Sepolia (pastikan sudah klaim faucet di [faucet.giwa.io](https://faucet.giwa.io) atau [faucet.nodit.io](https://faucet.nodit.io)).
2. **Coba Transaksi:** Buat token percobaan di tab Launchpad atau lakukan swap di tab Swap. Ambil screenshot website Anda saat transaksi berhasil.
3. **Posting di X (Twitter):**
   - Buat tweet baru, contoh teks:
     > Just shipped my Launchpad & DEX on GIWA Sepolia powered by @AmmoraProtocol SDK for Season 2 Builder Mission! 🚀
     > Live DApp: https://your-project.vercel.app
     > #Ammora #GIWA #DeFi #Web3
   - Sertakan screenshot aplikasi web Anda.
4. **Submit di Dashboard Ammora:**
   - Kunjungi dashboard Ammora Season 2 di [ammora.org](https://ammora.org).
   - Masuk ke tab **Missions** / **Builder Mission**.
   - Masukkan link live website Vercel Anda dan link tweet X Anda.
   - Klaim hadiah bonus $tAMM dan Soulbound Token (SBT)!

---

## 📜 Kontrak Ammora Resmi (GIWA Sepolia #91342)

- **Launch Factory:** `0xafb0b870d718f656cadd2bea721b9736d9064c9a`
- **Config Registry:** `0x8bd344d6c2ac01cbd5166c022f13895ab0b69d17`
- **DLMM Pool Factory:** `0x92982ccfbbe91754a1eb64e20cf7d401e7989709`
- **Native Swap Router:** `0xb003fc924c530b1ed7d54bd984d5c9d1606d9658`
- **WETH (Wrapped Native):** `0x4200000000000000000000000000000000000006`
