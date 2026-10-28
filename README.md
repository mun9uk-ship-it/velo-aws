<div align="center">

# ✈️ Velo.AWS

<h3>🌐 <a href="https://velo.aws.velosights.com" target="_blank">v e l o . a w s . v e l o s i g h t s . c o m</a></h3>

**A lightning-fast, framework-free AWS Pricing Calculator built for modern cloud architects.**

[![Live Demo](https://img.shields.io/badge/🚀_Visit_Live_App-7C6FFF?style=for-the-badge&logo=googlechrome&logoColor=white)](https://velo.aws.velosights.com)
<br>
![Status](https://img.shields.io/badge/Status-Active-10B981?style=flat-square)
![Version](https://img.shields.io/badge/Version-1.0.0-06B6D4?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-F59E0B?style=flat-square)
![Deploy](https://img.shields.io/badge/Deploy-GitHub_Actions_to_Plesk-2088FF?style=flat-square&logo=github-actions&logoColor=white)

*Built with HTML5, CSS3, Vanilla JS, and a PWA architecture.*

<!-- BANNER IMAGE PLACEHOLDER -->
<img src="https://via.placeholder.com/1200x450/0A0E1A/7C6FFF?text=Velo.AWS+%E2%80%94+Interactive+Dashboard" alt="Velo.AWS Hero Banner" width="100%" style="border-radius: 12px; margin-top: 20px;">

</div>

---

## 📖 The Story: Why Velo.AWS?

**The Problem:** The official AWS Pricing Calculator is powerful but notoriously overwhelming. It’s cluttered, requires multiple clicks to configure simple services, lacks dark mode, and often forgets your session. For developers trying to do quick mental math on infrastructure costs, it’s a friction-filled experience.

**The Solution:** Velo.AWS is a zero-dependency, single-page estimation tool designed for speed and clarity. It strips away the noise, offering a sleek three-column workspace, instant live calculations, and a brilliant "Smart Search" that understands natural language (e.g., typing *"security lock"* instantly finds ACM). It respects your preferences—supporting 4 languages (including full RTL Arabic support), multi-currency conversion, and offline PWA capabilities.

> [!TIP]
> **The Real Magic:** All calculations happen instantly on the client side. No server round-trips, no loading spinners, just pure, instant UX.

---

## 🖼️ Show, Don't Tell

<div align="center">
  <!-- DEMO GIF PLACEHOLDER -->
  <img src="https://via.placeholder.com/800x450/1A1F2E/FFFFFF?text=Demo+GIF+Placeholder" alt="Demo GIF" width="100%" style="border-radius: 8px; border: 1px solid #2A2F3E;">
</div>

*Watch how fast the app calculates. In this GIF, you'll see a user searching for "hosting", adding an EC2 instance and an S3 bucket, switching the region to Frankfurt, and instantly seeing the monthly total update without a single page reload.*

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 🔍 **Smart Cross-Cloud Search** | Type natural terms like *"CDN"* or *"SSL"* and it will instantly surface the AWS service, along with its GCP and Azure equivalents. |
| ⚡ **Instant Calculations** | Every keystroke triggers a recalculation. No "Calculate" button needed. |
| 🌍 **Multi-Language & RTL** | Fully translated into English, Arabic, French, and German. The entire layout flips flawlessly for Arabic (RTL). |
| 💱 **Multi-Currency** | Estimate in USD, GBP, or EUR. Prices are stored in USD and instantly converted on the fly. |
| 🖨️ **Branded PDF Exports** | Generate a clean, black-and-white, print-optimized report containing a dynamically generated QR code linking to the shared estimate. |
| 📱 **PWA & Offline Ready** | Install it as a native-like app on your desktop or mobile. It works completely offline once loaded. |
| 🗂️ **State Sharing** | Encode your entire infrastructure estimate, selected language, and currency into a single shareable URL. |

---

## ⌨️ The Cheat Sheet

Speed is everything. Velo.AWS comes with a robust set of keyboard shortcuts.

| Shortcut | Action |
| :--- | :--- |
| <kbd>/</kbd> | Focus the Global Search Bar |
| <kbd>Ctrl</kbd> + <kbd>[A-Z]</kbd> | Quickly add a specific service (e.g., <kbd>Ctrl</kbd> + <kbd>E</kbd> for EC2) |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> | Copy Share Link to clipboard |
| <kbd>Ctrl</kbd> + <kbd>P</kbd> | Generate PDF / Print |
| <kbd>?</kbd> | Open the Shortcuts Help Modal |
| <kbd>Esc</kbd> | Close any open modal or blur search |
| <kbd>R</kbd> | Reset the entire estimate |

---

## 🏗️ Architecture & CI/CD Workflow

Velo.AWS is completely static and framework-free. However, it features a modern, automated deployment pipeline. We don't use FTP clients; we use Git.

```text
+----------------+      git push      +-------------------+
|  💻 Local VS   | -----------------> |  🐙 GitHub Repo   |
|     Code       |                    |     (main)        |
+----------------+                    +-------------------+
                                               |
                                               | triggers
                                               v
+----------------+    FTP Sync      +-------------------+
|  ☁️ Plesk      | <---------------- |  ⚙️ GitHub Actions|
|   Hosting      |                   |   (deploy.yml)    |
+----------------+                   +-------------------+
        |
        | serves
        v
+----------------+
|  🌐 Live User  |
+----------------+
```
[!IMPORTANT]
    The CI/CD pipeline requires exactly 4 GitHub Secrets (FTP_SERVER, FTP_USERNAME, FTP_PASSWORD, FTP_SERVER_DIR) to be configured in your repository settings to authorize the deployment to Plesk.

🚀 One-Click Deployment Guide

Deploying updates to production is as simple as making a commit. The GitHub Action handles the rest.

# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: added new EC2 pricing logic"

# Push to the main branch (This triggers the Plesk deployment automatically)
git push origin main

# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: added new EC2 pricing logic"

# Push to the main branch (This triggers the Plesk deployment automatically)
git push origin main





