# TASKFLOW — Make Every Day Count.

> A luxury, editorial-grade task management web application engineered with a modern frosted obsidian glass aesthetic, multi-user authentication, and comprehensive productivity workflows.

**Crafted & Engineered by [Shivam Jagtap](https://github.com/shivamjagtap174100-commits)** — *Founder & Lead Designer*

---

## ✨ Design Philosophy

TASKFLOW was designed to break away from generic AI dashboards, excessive flat card grids, and cookie-cutter templates. Built with a bespoke **Obsidian Glass Skin** aesthetic:

- **Frosted Obsidian Glassmorphism**: Translucent `backdrop-blur-2xl` surfaces layered against deep `#101110` canvas.
- **Champagne Gold Accents**: Hand-calibrated warm champagne gold (`#C5A46D` to `#D4B57E`) reserved for high-impact actions, active navigation states, and focal metrics.
- **Luminous Micro-Interactions**: Custom minimalist checkboxes with glowing emerald accomplishment states, subtle star toggles, and modal scale transitions.
- **Editorial Typography**: Typographic hierarchy with clean line heights, monospaced metadata, and uppercase section dividers.

---

## 🚀 Key Features

### 1. Multi-User Authentication & Data Isolation
- **Sign In & Account Registration** with full validation.
- **Multi-Tenant Local Storage Engine**: Each account’s tasks, completion status, metrics, and categories are isolated under `taskflow_user_${userId}_tasks`.
- **One-Click Demo Access**: Instant 1-tap sign-in as **Shivam Jagtap** (*Founder & Lead Designer*).
- **Fast Account Switching & Profile Customization** directly from the sidebar or settings modal.

### 2. Comprehensive Task Workflows
- **Overview**: Daily summary capsule, radial/horizontal completion progress, Today's Focus, and upcoming deadline radar.
- **My Tasks**: Complete workspace task repository with category filtering and sorting.
- **Today**: Time-ordered daily agenda with progress metrics.
- **Upcoming**: Future schedule segmented by *Tomorrow*, *This Week*, *Next Week*, and *Later*.
- **Important**: High-priority deliverables and starred items.
- **Completed Archive**: History of accomplished milestones with permanent clear and instant undo options.
- **Category Streams**: Dedicated views for `Work`, `Personal`, `Study`, and `Other`.

### 3. Productivity & Power-User Tools
- **Global Search**: Filter tasks by title or description instantaneously (Press `/`).
- **Keyboard Shortcuts**:
  - `N`: Create new task from anywhere
  - `/`: Quick focus search bar
  - `⌘ / Ctrl + Enter`: Save task in modal
  - `Esc`: Close open dialogs, menus, and modals
- **Data Portability**: Full JSON backup export and restore snapshot support.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom glass skin utilities
- **Icons**: [Lucide React](https://lucide.dev/)
- **State & Persistence**: React Context API + LocalStorage Multi-User Isolation

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm / pnpm / yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/shivamjagtap174100-commits/TASKFLOW-.git

# Navigate to project directory
cd TASKFLOW-

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Building for Production

```bash
# Type check and build bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License

Created by **Shivam Jagtap**. All rights reserved.
