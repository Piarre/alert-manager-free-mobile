# 🚀 Elysia API Starter

A lightweight and efficient API starter template built with [Elysia](https://elysiajs.com/) and [Bun](https://bun.sh/).

[![Elysia](https://img.shields.io/badge/powered%20by-Elysia-blue.svg)](https://elysiajs.com/)
[![Bun](https://img.shields.io/badge/runtime-Bun-black.svg)](https://bun.sh/)

## ✨ Features

- 🚀 Super fast API development with Elysia
- ⚡ Powered by Bun runtime for maximum performance
- 🔄 Hot reloading for development
- 🐳 Docker ready for production deployment
- 📊 Debug routes for uptime and health monitoring
- ✅ TypeScript configured

## 📋 Prerequisites

- [Bun](https://bun.sh/) >= 1.0.0

## 🚦 Getting Started

### ⬇️ Installation

```bash
# Clone the repository
git clone https://github.com/piarre/elysia-starter
cd elysia-starter && rm -rf .git/

# Install dependencies
bun install
```

### 👨‍💻 Development

Start the development server with hot reloading:

```bash
bun run dev
```

Your API will be available at http://localhost:2025

### 🐳 Running with Docker

```bash
# Build the Docker image
docker build -t elysia-api .

# Run the container
docker run -p 2025:2025 elysia-api

# Or with custom port and OpenTelemetry
docker run -p 3000:3000 -e PORT=3000 -e useOtel=true elysia-api
```

## 📁 Project Structure

```
├── src/
│   ├── index.ts          # Main application entry point
│   ├── routes/
│   │   └── debug.ts      # Debug route handlers
│   └── utils/
│       └── uptime.ts     # Utility functions
├── Dockerfile            # Docker configuration
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## ⚙️ Configuration

### 🔌 Port Configuration

The API server runs on port 2025 by default. You can modify this via environment variable:

```bash
PORT=3000 bun run dev
```

### � Environment Variables

- `PORT`: Server port (default: 2025)
- `useOtel`: Enable OpenTelemetry (default: false)

## 📋 Commands

```bash
bun run dev      # Start development server with hot reloading
```

## 🔐 License

MIT