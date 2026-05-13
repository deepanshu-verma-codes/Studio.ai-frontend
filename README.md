# 🧠 Neural Studio - Next-Gen AI Interface

Neural Studio is a sophisticated, high-performance frontend interface designed for seamless interaction with Gemini-powered AI models. Built with Next.js 16 and Tailwind CSS 4, it provides a polished, interactive, and responsive experience for modern AI communication.

## ✨ Features

- **Interactive Chat Interface**: A fluid, real-time chat experience powered by Vercel AI SDK.
- **Rich Markdown Support**: Full support for markdown rendering, including tables, lists, and formatting.
- **Syntax Highlighting**: Beautifully highlighted code blocks for multiple programming languages.
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.
- **Motion & Animations**: Smooth transitions and interactive elements using Framer Motion.
- **Dark/Light Mode**: Elegant design that adapts to user preferences.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai/docs)
- **Content Rendering**: `react-markdown`, `react-syntax-highlighter`, `remark-gfm`

## 🚀 Getting Started

### 1. Prerequisites

- Node.js (v18+)
- Backend server running (see [Backend README](../ai-chat-app-backend/README.md))

### 2. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-chat-app-frontend

# Install dependencies
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components (ChatInterface, Hero, etc.).
- `styles/`: Global CSS and Tailwind configurations.
- `public/`: Static assets.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👤 Author

**Deepanshu Verma**
Full Stack Developer | MERN Stack Engineer
