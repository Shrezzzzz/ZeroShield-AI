# 🛡️ ZeroShield AI

### AI-Powered Cybersecurity Platform for Zero-Day Threat Detection

---

## 🚀 Overview

**ZeroShield AI** is a modern full-stack cybersecurity platform that simulates a real-world **Security Operations Center (SOC)**. It provides real-time threat monitoring, AI-based anomaly detection, attack simulation, automated response handling, and system-wide activity tracking.

The platform is designed with a futuristic UI and integrates frontend and backend systems for a **live, interactive security dashboard experience**.

---

## ✨ Key Features

### 🔐 Authentication

* Secure login & registration system
* JWT-based authentication (planned/implemented)
* Protected dashboard routes

---

### 📊 Dashboard

* Risk score monitoring
* Active threats tracking
* Endpoint monitoring
* Real-time charts:

  * Traffic patterns
  * API activity
  * Risk trends

---

### 🧠 AI Threat Detection

* Behavioral anomaly detection
* Confidence & deviation metrics
* Real-time threat alerts

---

### ⚔️ Attack Simulation Engine

* Simulate:

  * API Injection attacks
  * DDoS traffic spikes
  * Lateral movement
* Vulnerability scoring
* Mitigation suggestions

---

### 🛡️ Response Engine

* Isolate compromised services
* Block suspicious IPs
* Live system status updates

---

### 🌐 Threat Intelligence Feed

* CVE-based threat updates
* Severity classification (Critical / High / Medium)
* Source tracking (MITRE, NVD, etc.)

---

### 📜 Logs & Activity

* Filterable logs:

  * API
  * Auth
  * System
  * Threat
* Real-time activity monitoring

---

### 🔔 Notification System

* Sidebar notification panel
* Toast alerts for real-time events
* Unread notification tracking

---

## 🧱 Tech Stack

### Frontend

* React (Vite)
* TypeScript & JavaScript (mixed)
* Tailwind CSS
* Radix UI components
* Recharts (for data visualization)

### Backend

* Node.js (custom backend structure)
* API services (modular)
* Simulation engine
* AI engine (mock/simulated)

---

## 📁 Project Structure

```bash
ZeroShield-AI/
│
├── frontend/
│   ├── src/
│   │   ├── assets/                # Images & icons
│   │   ├── components/            # UI + layout components
│   │   │   ├── ui/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── AppSidebar.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── NotificationDropdown.jsx
│   │   │   └── LandingPage.tsx
│   │   │
│   │   ├── context/               # Global state
│   │   │   ├── AuthContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   │
│   │   ├── hooks/                 # Custom hooks
│   │   │   ├── use-mobile.tsx
│   │   │   └── use-toast.ts
│   │   │
│   │   ├── lib/                   # Utilities & mock data
│   │   │   ├── mock-data.ts
│   │   │   └── utils.ts
│   │   │
│   │   ├── pages/                 # Main pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ThreatDetection.tsx
│   │   │   ├── AttackSimulation.tsx
│   │   │   ├── ResponseEngine.tsx
│   │   │   ├── ThreatIntel.tsx
│   │   │   ├── LogsActivity.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── LandingPage.tsx
│   │   │
│   │   ├── services/
│   │   │   └── api.ts             # Central API handler
│   │   │
│   │   ├── App.tsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   └── package.json
│
├── routes/                        # Backend API routes
├── models/                        # Data models
├── ai-engine.js                   # AI logic (mock)
├── simulation-engine.js           # Attack simulation logic
├── data-layer.js                  # Data handling
├── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 🔹 1. Clone the Repository

```bash
git clone https://github.com/your-username/zeroshield-ai.git
cd zeroshield-ai
```

---

### 🔹 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

### 🔹 3. Setup Backend

```bash
npm install
node server.js   # or your main backend file
```

Backend runs at:

```
http://127.0.0.1:8000
```

---

## 🔗 API Integration

Frontend uses a centralized API handler:

```ts
frontend/src/services/api.ts
```

Handles:

* All API calls
* Error handling
* Token management

---

## 🔄 Real-Time Features

* WebSocket integration (planned/optional)
* Used for:

  * Threat alerts
  * Notifications
  * Live dashboard updates

---

## 🧪 Development Notes

* Currently uses **mock data**
* Can be replaced with real backend APIs
* Notification & WebSocket system can be extended

---

## 🚀 Future Improvements

* Real AI/ML integration
* Role-based access control (RBAC)
* Cloud deployment (AWS / Vercel / Render)
* Database integration (MongoDB / PostgreSQL)
* Advanced analytics dashboard

---
## 👩‍💻 Team Members

Shreya Chowdhury | Prakriti Sarkar | Srijita Biswas


---

## ⭐ Acknowledgment

Inspired by modern SOC dashboards and enterprise cybersecurity tools.
