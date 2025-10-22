# Alert Manager Free Mobile 📱

Bridge to send Prometheus AlertManager alerts to Free Mobile SMS API.

## 📋 Features

- ✉️ Receive alerts from Prometheus AlertManager
- 📲 Automatic SMS sending via Free Mobile API
- 📊 Optional SMS logging to database (SQLite or MariaDB)
- 🐳 Ready to deploy with Docker
- ⚡ Lightweight and performant (based on Bun and Elysia)

## 🚀 Quick Start

### Prerequisites

1. A Free Mobile account with the **"SMS Notifications"** option enabled
2. Get your API credentials:
   - Login to [your Free Mobile account](https://mobile.free.fr/)
   - Go to **Mes Options** → **Notifications par SMS**
   - Enable the option and note your **API key**
     
## 🐳 Using with Docker

### Docker Compose (recommended)

Create a `docker-compose.yml` file:

```yaml
services:
  alert-manager-free-mobile:
    image: ghcr.io/piarre/alert-manager-free-mobile:latest
    container_name: alert-manager-free-mobile
    restart: unless-stopped
    ports:
      - "2025:2025"
    environment:
      - FREE_MOBILE_USER=33612345678
      - FREE_MOBILE_PASS=your_api_key
      - LOG_SMS=true
      # Option 1: SQLite (default)
      - LOG_DB_URI=sqlite://app/sms.db
      # Option 2: MariaDB/MySQL
      # - LOG_DB_URI=mariadb://user:password@mariadb:3306/sms_logs
    volumes:
      # SQLite persistence (uncomment if using SQLite)
      - ./data:/app
```

Start the service:

```bash
docker-compose up -d
```

### Docker Run

```bash
docker run -d \
  --name alert-manager-free-mobile \
  --restart unless-stopped \
  -p 2025:2025 \
  -e FREE_MOBILE_USER=33612345678 \
  -e FREE_MOBILE_PASS=your_api_key \
  -e LOG_SMS=true \
  -e LOG_DB_URI=sqlite://app/sms.db \
  -v $(pwd)/data:/app \
  ghcr.io/piarre/alert-manager-free-mobile:latest
```

## ⚙️ Prometheus AlertManager Configuration

In your `alertmanager.yml`, add the following configuration:

```yaml
route:
  receiver: 'free-mobile-sms'
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h

receivers:
  - name: 'free-mobile-sms'
    webhook_configs:
      - url: 'http://alert-manager-free-mobile:2025/sms/send'
        send_resolved: true
```

## 📡 API Endpoints

### `POST /sms/send`

Receives alerts from AlertManager and sends an SMS.

**Example payload**:

```json
{
  "alerts": [
    {
      "status": "firing",
      "labels": {
        "alertname": "InstanceDown",
        "instance": "server01:9100",
        "severity": "critical"
      },
      "annotations": {
        "summary": "Instance is DOWN"
      }
    }
  ]
}
```

### `GET /sms/log`

Retrieve SMS history (only if `LOG_SMS=true`).

```bash
curl http://localhost:2025/sms/log
```

### Free Mobile API Error Codes

- `400`: Missing or invalid parameters
- `402`: Too many SMS sent (limit of 250/day)
- `403`: Service not enabled or incorrect credentials
- `500`: Free Mobile server error
