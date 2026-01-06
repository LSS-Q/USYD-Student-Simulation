# 🎓 USYD Student Simulation | 悉尼留学生模拟器

**A web-based life simulation game about being an international student in Sydney, Australia.**
**一款关于澳洲悉尼留学生活的 Web 人生模拟游戏。**

---

## 📖 Overview | 概述

Inspired by games like *Chinese Parents (中国式家长)* and *Chili Pepper Simulator (青椒模拟器)*, this game simulates the challenging journey of an international student navigating studies, career, visa issues, and the pursuit of Permanent Residency (PR) in Australia.

本游戏灵感来源于《中国式家长》和《青椒模拟器》，模拟了国际学生在澳洲求学、求职、处理签证问题以及追求永久居留权 (PR) 的艰辛旅程。

---

## ✨ Features | 功能特性

### Core Gameplay | 核心玩法
- **Character Creation | 角色创建**: Choose your degree (Bachelor, Master, PhD) and major (Commerce, IT, Engineering, Nursing).
- **Quarterly Progression | 季度推进**: Manage your Action Points (AP) each quarter to study, work, or socialize.
- **Stat Management | 数值管理**: Balance Sanity, WAM, Money, English, Network, Experience, and PR Score.
- **Event System | 事件系统**: Encounter random life events based on your phase (Student, Graduate, Working).
- **Visa System | 签证系统**: Start on Student Visa (500), graduate to Graduate Visa (485), and eventually apply for PR.

### V2.1 Updates | V2.1 更新 (Latest)
- **Strict Economy | 严苛经济**:
    - **No More Debt**: Bankruptcy (Money < 0) now immediately triggers a "Financial Ruin" Game Over.
    - **Rebalanced Start**:
        - 💎 Wealthy (富二代): $50,000 (Harder than before)
        - 🏠 Middle Class (中产): $10,000 (Standard)
        - 👷 Working Class (工薪): $5,000 (Hard Mode)
- **Enhanced Gameplay | 游戏性增强**:
    - **AP Boost**: Action Points increased to **50 per quarter** (was 10), allowing for more flexible strategies.
    - **Visual Upgrade**: Added pixel art avatars for 6 key NPCs and player characters.
- **Regional Strategy | 区域策略**:
    - **4 Regions**: City CBD, Eastern Suburbs, Inner West, Western Suburbs.
    - Each region affects **Rent Multiplier**, **Sanity Modifier**, and **Safety Level**.

---

## 🛠️ Tech Stack | 技术栈

| Technology | Purpose |
|---|---|
| **Vite** | Build tool & dev server |
| **React 19** | UI framework |
| **TypeScript** | Type-safe JavaScript |
| **Zustand** | State management (with persistence) |
| **TailwindCSS** | Utility-first CSS |
| **Lucide React** | Icon library |

---

## 🚀 Getting Started | 快速开始

### Prerequisites | 前置条件
- Node.js (v18+)
- npm or yarn

### Installation | 安装

```bash
# Clone the repository
git clone <your-repo-url>
cd AusFinanceSim

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:5173`.

### Build for Production | 生产构建

```bash
npm run build
npm run preview
```

---

## 🎮 How to Play | 如何游玩

1. **Start Game | 开始游戏**: Select your Degree and Major, then click "Start Life in Sydney".
2. **Dashboard | 仪表盘**: This is your main hub. Perform actions like "Study", "Part-time Job", "Rest", etc.
3. **Use AP | 消耗 AP**: Most actions cost Action Points. When AP runs out, click "End Quarter" to advance time.
4. **Manage Stats | 管理数值**:
   - **Sanity** < 0 → Depression Game Over
   - **Money** < -$5000 → Bankruptcy Game Over
   - **Visa Expired** → Deportation Game Over
5. **Explore Tabs | 探索页面**:
   - **Academics**: Study, assignments, exams.
   - **Career**: Apply for jobs, internships.
   - **Network**: Meet and befriend NPCs.
   - **Lifestyle**: Manage housing, buy assets, relocate.
   - **Migration**: Track visa status, EOI progress.
6. **Goal | 目标**: Survive, graduate, find a job, and eventually get that PR invite!

---

## 📁 Project Structure | 项目结构

```
src/
├── components/
│   ├── common/         # Shared UI components (EventModal, WelcomeModal)
│   ├── layout/         # Layout components (Sidebar, Header)
│   └── views/          # Main game views (DashboardView, NetworkView, etc.)
├── data/
│   ├── constants.ts    # Housing config, degree config
│   ├── npcs.ts         # NPC definitions
│   ├── regions.ts      # Region definitions
│   └── events/         # Game events (academics, career, life, special)
├── stores/
│   └── useGameStore.ts # Zustand store (game state & actions)
└── types/
    ├── game.ts         # Game type definitions
    └── event.ts        # Event type definitions
```

---

## 🤝 Contributing | 贡献指南

Contributions are welcome! Feel free to:
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes.
4. Open a Pull Request.

欢迎贡献！可以 Fork 本仓库，创建功能分支并提交 Pull Request。

---

## 📜 License | 许可

This project is for educational and entertainment purposes only.
本项目仅供学习和娱乐目的。

---

## ❓ Troubleshooting | 常见问题

### Data not updating? / 数据没更新？
If you see old data (e.g., outdated money or AP), please try clearing your browser cache or local storage.
The game now uses `aus-sim-storage-v2`.

如果发现数据异常（如旧的初始资金），请尝试清除浏览器缓存或 LocalStorage。游戏已升级存储键值为 `v2`。

---

**Good luck on your PR journey! 祝你早日上岸！** 🌏➡️🇦🇺

---

## 👨‍💻 Credits | 版权归属
This project is created and maintained by GitHub user **LSS-Q Noah**.
本项目由 GitHub 用户 **LSS-Q Noah** 开发与维护。
