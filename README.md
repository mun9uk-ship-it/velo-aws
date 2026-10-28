<div align="center">

# Velo.AWS

### ⚡ Lightning-fast AWS cost estimation. No framework. No clutter.

[![Visit](https://img.shields.io/badge/🌐_WEBSITE-velo.aws.velosights.com-6C63FF?style=for-the-badge&labelColor=0B0F1A)](https://velo.aws.velosights.com/)

<br/>

![Status](https://img.shields.io/badge/status-live-2EA44F?style=flat-square&logo=statuspage&logoColor=white)
![Version](https://img.shields.io/badge/version-1.0.0-6C63FF?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
[![Deploy](https://img.shields.io/github/actions/workflow/status/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME/deploy.yml?branch=main&label=deploy&logo=githubactions&logoColor=white&style=flat-square)](https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME/actions)
![PWA](https://img.shields.io/badge/PWA-ready-5A0FC8?style=flat-square&logo=pwa&logoColor=white)
![No Framework](https://img.shields.io/badge/framework-none-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

<br/>

[![🚀 Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Open_Velo.AWS-6C63FF?style=for-the-badge&labelColor=1A1F2E)](https://velo.aws.velosights.com/)

<br/>

[📖 Story](#-the-story) •
[🖼️ Demo](#️-demo) •
[✨ Features](#-key-features) •
[⌨️ Shortcuts](#️-keyboard-shortcuts) •
[🏗️ Architecture](#️-architecture--cicd-workflow) •
[🚀 Deploy](#-one-click-deployment-guide) •
[🛠️ Local Dev](#️-local-development)

</div>

---

> [!TIP]
> **In a hurry?** Open **[velo.aws.velosights.com](https://velo.aws.velosights.com/)**, type a service name, and watch the monthly estimate update instantly. No sign-up, no install.

---

## 📖 The Story

**The problem.** The official AWS pricing calculator is powerful, but it is also cluttered, slow to load, and heavy to navigate when all you want is a quick, ballpark answer. Every estimate means clicking through multiple screens and waiting for pages to refresh.

**The solution.** **Velo.AWS** is a sleek, instant alternative. Pick your services, tweak a few numbers, and see live monthly and yearly costs immediately. It is completely static and framework-free, so it loads in a blink, works offline as a PWA, and speaks your language and your currency.

> [!NOTE]
> Velo.AWS is built for **quick, early-stage estimates**. For official quotes and billing, always verify with the official AWS Pricing Calculator.

---

## 🖼️ Demo

![Demo](https://via.placeholder.com/800x450/1A1F2E/FFFFFF?text=Demo+GIF+Placeholder)

<p align="center"><em>
🎬 The demo GIF shows a full workflow: typing "SSL" in the search box and instantly seeing AWS ACM alongside its GCP and Azure equivalents, adding a few services, switching currency from USD to GBP, flipping the interface to Arabic with full RTL layout, and exporting a branded PDF with a QR code.
</em></p>

> [!TIP]
> Record the GIF at **800×450** with a tool such as ScreenToGif, Kap, or LICEcap, and keep it under **5 MB** so the README loads fast.

---

## ✨ Key Features

| Feature | Description |
| :-- | :-- |
| 🔍 **Smart Cross-Cloud Search** | Type a keyword like `SSL` and find AWS ACM, with GCP and Azure equivalents shown side by side. |
| ⚡ **Instant Calculations** | Every change updates monthly and yearly costs in real time, with no page reloads. |
| 🌍 **Multi-Language + RTL** | Multiple interface languages, including **full Arabic right-to-left support**. |
| 💱 **Multi-Currency** | Switch between **USD 💵, GBP 💷, and EUR 💶** with converted prices. |
| 📄 **Branded PDF Export** | One click to export a polished PDF report with your branding and a **QR code**. |
| 📱 **PWA & Offline** | Installable on desktop and mobile, powered by a Service Worker. |
| 🪶 **Zero Frameworks** | Pure HTML5, CSS3, and Vanilla JavaScript (ES2022 Modules). Tiny and fast. |

---

## ⌨️ Keyboard Shortcuts

Work faster without leaving the keyboard.

| Action | Shortcut |
| :-- | :--: |
| 🔍 Focus the search box | <kbd>Ctrl</kbd> + <kbd>K</kbd> |
| 💾 Save the estimate | <kbd>Ctrl</kbd> + <kbd>S</kbd> |
| 📄 Export to PDF | <kbd>Ctrl</kbd> + <kbd>E</kbd> |
| 🔗 Copy share link | <kbd>Ctrl</kbd> + <kbd>L</kbd> |
| ❓ Open help | <kbd>?</kbd> |
| ❌ Clear search / close dialog | <kbd>Esc</kbd> |

> [!IMPORTANT]
> On macOS, use <kbd>⌘</kbd> instead of <kbd>Ctrl</kbd>. Update this table to match the exact shortcuts implemented in your app.

---

## 🏗️ Architecture & CI/CD Workflow

Velo.AWS is **completely static and framework-free**, yet it ships through a modern, automated pipeline. We don't drag files around with FTP clients. We use **Git**.

| 🟣 **1. Local** | 🟠 **2. GitHub** | 🟡 **3. Actions** | 🔵 **4. Plesk** | 🟢 **5. Live** |
| :-: | :-: | :-: | :-: | :-: |
| VS Code | Repo `main` | `deploy.yml` | Hosting | Your users |

```text
┌──────────────────┐   git push   ┌────────────────────┐
│  1  LOCAL        │ ───────────▶ │  2  GITHUB REPO    │
│     VS Code      │              │     branch: main   │
└──────────────────┘              └─────────┬──────────┘
                                            │ triggers
                                            ▼
┌──────────────────┐   FTP sync   ┌────────────────────┐
│  4  PLESK        │ ◀─────────── │  3  GITHUB ACTIONS │
│     Hosting      │              │     deploy.yml     │
└────────┬─────────┘              └────────────────────┘
         │ serves
         ▼
┌──────────────────┐
│  5  LIVE USERS   │
│     Your users   │
└──────────────────┘
```

> [!NOTE]
> The diagram is plain text on purpose: it loads instantly and never breaks due to GitHub's renderer.

---

## 🚀 One-Click Deployment Guide

Deploying is just three Git commands. Push to `main` and GitHub Actions does the rest.

**1️⃣ Stage your changes**

```bash
git add .
```

**2️⃣ Commit with a clear message**

```bash
git commit -m "Describe your change here"
```

**3️⃣ Push to main and trigger the deployment**

```bash
git push origin main
```

> [!IMPORTANT]
> Every push to `main` triggers the `deploy.yml` workflow, which syncs the site to Plesk over FTP. Watch progress in the **Actions** tab of your repository.

---

## 🛠️ Local Development

No build step and no dependencies to install. Just serve the `public` folder:

```bash
npx serve public -l 3000
```

Then open **http://localhost:3000** in your browser.

> [!TIP]
> Service Workers only run on `localhost` or HTTPS, so testing the PWA and offline mode locally works out of the box.

---

## 🧰 Tech Stack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript_ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Plesk](https://img.shields.io/badge/Plesk-52BBE6?style=for-the-badge&logo=plesk&logoColor=white)

---

## 🗺️ Roadmap

- [x] Instant cost calculation
- [x] Multi-currency (USD, GBP, EUR)
- [x] Multi-language with Arabic RTL
- [x] Branded PDF export with QR code
- [x] PWA and offline support
- [ ] More AWS services and instance types
- [ ] Per-service regional pricing data
- [ ] Side-by-side AWS vs GCP vs Azure cost comparison

---

## 🤝 Contributing

Ideas, bug reports, and pull requests are welcome.

1. 🍴 Fork the repository
2. 🌿 Create a feature branch
3. 💾 Commit your changes
4. 🔁 Open a Pull Request

---

## 📜 License & Disclaimer

This project is licensed under the **MIT License**. You are free to use, copy, modify, and distribute it, provided the license notice is included.

> [!WARNING]
> **Disclaimer:** Velo.AWS is an **independent project** and is **not affiliated with, endorsed by, or sponsored by Amazon Web Services (AWS), Google Cloud Platform (GCP), or Microsoft Azure**. All product names, logos, and brands are the property of their respective owners. Cost figures are **estimates only**. Always verify with the official pricing calculators before making financial decisions.

---

## ☕ Support & Author

If Velo.AWS saved you time, consider buying me a coffee. ☕ **4 coffees a day let me build more free tools for you!** 💜

<p align="center">

[![Buy Me a Coffee](https://img.shields.io/badge/☕_Buy_Me_a_Coffee-Monzo-FF4F40?style=for-the-badge&logo=monzo&logoColor=white)](https://monzo.me/muneerahmed)

**Monzo tag:** `@muneerahmed`

</p>

### 👤 Author

**Muneer Ahmed**

| | |
| :-- | :-- |
| 📧 **Email** | `your.email@example.com` |
| 💼 **LinkedIn** | `https://www.linkedin.com/in/your-profile` |
| 🆔 **ORCID** | `https://orcid.org/0000-0000-0000-0000` |
| 🧪 **Zenodo** | `https://zenodo.org/your-profile` |

---

<div align="center">

**Built with ❤️ by Muneer Ahmed · Powered by pure HTML, CSS & JavaScript**

⭐ *If you like this project, give it a star!* ⭐

</div>
