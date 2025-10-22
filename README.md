# 🚀 Alert Manager Free Mobile

A lightweight and efficient Alert Manager webhook receiver for Free Mobile SMS notifications, built with [Elysia](https://elysiajs.com/) and [Bun](https://bun.sh/).

[![Elysia](https://img.shields.io/badge/powered%20by-Elysia-blue.svg)](https://elysiajs.com/)
[![Bun](https://img.shields.io/badge/runtime-Bun-black.svg)](https://bun.sh/)

## ✨ Features

- 🚀 Fast webhook receiver for Prometheus AlertManager
- ⚡ Powered by Bun runtime for maximum performance
- 🔔 Send SMS notifications via Free Mobile API
- 💾 Database logging with support for MySQL, MariaDB, and SQLite
- 🔄 Hot reloading for development
- 🐳 Docker ready for production deployment
- 📊 Debug routes for uptime and health monitoring
- ✅ TypeScript configured

## 📋 Prerequisites

- [Bun](https://bun.sh/) >= 1.3.0
- MySQL, MariaDB, or SQLite database
- Free Mobile account with SMS API access

## 🚦 Getting Started

### ⬇️ Installation

```bash
git clone https://github.com/piarre/alert-manager-free-mobile
cd alert-manager-free-mobile

bun install
```

### ⚙️ Configuration

Create a `.env` file with the following variables:

```bash
# Database Configuration
# For MySQL/MariaDB:
LOG_DB_URI="mysql://user:password@localhost:3306/database_name"

# Or for SQLite:
LOG_DB_URI="sqlite://logs.db"

# Free Mobile API Configuration
FREE_MOBILE_USER="your_user_id"
FREE_MOBILE_API_KEY="your_api_key"

# Server Configuration
PORT=2025
```

### 👨‍💻 Development

Start the development server with hot reloading:

```bash
bun run dev
```

Your API will be available at http://localhost:2025

## 💾 Database

The application uses Bun's native SQL driver and supports multiple database engines:

### MySQL / MariaDB
```bash
LOG_DB_URI="mysql://user:password@host:3306/database"
```

### SQLite
```bash
LOG_DB_URI="sqlite://path/to/database.db"
```

The database schema is automatically created on startup with a `sms_logs` table containing:
- `id`: Auto-incrementing primary key
- `type`: Log type (VARCHAR/TEXT)
- `message`: Log message (TEXT)
- `created_at`: Timestamp

### Database Methods

The `DB` class provides the following methods:

- `log(type, message)`: Insert a log entry
- `getLogs(limit)`: Retrieve recent logs
- `getLogsByType(type, limit)`: Filter logs by type
- `cleanOldLogs(daysToKeep)`: Delete logs older than specified days
- `countLogs()`: Count total logs
- `countLogsByType()`: Count logs grouped by type
- `getLogsByDateRange(start, end)`: Retrieve logs within date range
- `query(...)`: Execute custom SQL queries

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
│   ├── index.ts              # Main application entry point
│   ├── lib/
│   │   ├── db.ts             # Database class (MySQL/MariaDB/SQLite)
│   │   ├── types/
│   │   │   ├── alert-manager.ts  # AlertManager types
│   │   │   ├── free.ts           # Free Mobile types
│   │   │   └── http.ts           # HTTP types
│   │   └── utils/
│   │       ├── free.ts       # Free Mobile API utilities
│   │       ├── log.ts        # Logger utilities
│   │       └── uptime.ts     # Uptime utilities
│   └── routes/
│       ├── debug.ts          # Debug route handlers
│       └── sms.ts            # SMS webhook handlers
├── Dockerfile                # Docker configuration
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

## ⚙️ Configuration

### 🔌 Port Configuration

The API server runs on port 2025 by default. You can modify this via environment variable:

```bash
PORT=3000 bun run dev
```

### 🔐 Environment Variables

- `PORT`: Server port (default: 2025)
- `LOG_DB_URI`: Database connection string (MySQL/MariaDB/SQLite)
- `FREE_MOBILE_USER`: Your Free Mobile user ID
- `FREE_MOBILE_API_KEY`: Your Free Mobile API key
- `useOtel`: Enable OpenTelemetry (default: false)

## 📋 Commands

```bash
bun run dev      # Start development server with hot reloading
```

## 🔐 License

MIT