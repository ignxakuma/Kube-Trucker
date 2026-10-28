# 🚛 Kube-Trucker

A fully agentic AI-driven microservices-based truck tracking application designed to demonstrate and teach core Kubernetes concepts.

## 📋 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Architecture Diagram](#architecture-diagram)
- [Technology Stack](#technology-stack)
- [Database Schema](#database-schema)
- [Service Endpoints](#service-endpoints)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Getting Started](#getting-started)

---

## Overview

The Kube-Trucker project demonstrates a complete microservices architecture deployed on Kubernetes, featuring:

1. **Location Service**: Ingests and stores truck GPS location data from external sources
2. **Route History Service**: Provides historical route data via RESTful APIs
3. **Frontend Service**: Web-based UI for visualizing truck routes on interactive maps

This architecture showcases microservices principles with clear separation of concerns, containerization with Docker, and orchestration through Kubernetes (Kind).

---

## System Architecture

### Microservice Responsibilities

| Service | Purpose | Key Responsibilities |
|---------|---------|----------------------|
| **Location Service** | Data ingestion & storage | Receive GPS coordinates, validate data, persist to PostgreSQL with timestamps |
| **Route History Service** | Historical data queries | Expose APIs for route history lookup (by truck ID and optional date range) |
| **Frontend Service** | User interface | Display map visualization, enable truck selection, fetch and render route data |

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Kubernetes Cluster                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────┐ │
│  │ Frontend Service │  │Route History Svc│  │Location  │ │
│  │   (React)        │  │   (Node.js)      │  | Service | │
│  └──────────────────┘  └──────────────────┘  └──────────┘ │
│                    │                   │                │   │
│              ┌─────▼─────┐       ┌─────▼─────┐          │
│              │ PostgreSQL │       │ Truck IoT  │          │
│              │ (Data)    │       │ Devices    │          │
│              └───────────┘       └────────────┘          │
└─────────────────────────────────────────────────────────────┘

External: Simulated Truck Data → Location Service
Internal: Frontend → Route History → Database
Internal: Location Service ↔ Database (write)
```

---

## Architecture Diagram

```mermaid
graph TD
    subgraph "Kubernetes Cluster"
        direction LR
        subgraph "Services"
            Frontend[Frontend Service<br/>React + Nginx]
            RouteHistory[Route History Service<br/>Node.js + Express]
            Location[Location Service<br/>Node.js + Express]
        end
        subgraph "Data Storage"
            Database[(PostgreSQL)]
        end
    end

    User[Users] -->|Views Map| Frontend
    Frontend -->|Requests Route Data| RouteHistory
    RouteHistory <-->|Queries Data| Database
    Location --|>Stores Location Data| Database

    subgraph "External"
        Truck[Simulated Truck Data] -->|Sends Location Updates| Location
    end
```

---

## Technology Stack

### Frontend
- **Framework**: React 17.0.2 (Component-based architecture for modular UI)
- **Build Tool**: Create React App / React Scripts
- **HTTP Server**: Nginx (serves static files and proxies API requests)

### Backend (Location & Route History Services)
- **Runtime**: Node.js
- **Web Framework**: Express.js 4.17.1 (Simple, middleware-based HTTP framework)
- **Data Access**: PostgreSQL driver (`pg` package 8.7.1)
- **API Format**: JSON

### Database
- **Type**: PostgreSQL (Robust open-source relational database)
- **Features**: Complex query support, potential PostGIS extension for geospatial features

### Containerization & Orchestration
- **Container Engine**: Docker Desktop
- **Orchestrator**: Kubernetes via Kind (Kubernetes in Docker)
- **Local Development**: Single-node Kind cluster (`kube-trucker-cluster`)

---

## Database Schema

### `truck_locations` Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-incrementing unique identifier |
| `truck_id` | VARCHAR(255) | NOT NULL | Identifies which truck's data |
| `latitude` | DECIMAL(9, 6) | NOT NULL | GPS latitude coordinate |
| `longitude` | DECIMAL(9, 6) | NOT NULL | GPS longitude coordinate |
| `timestamp` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | When location was recorded |

```sql
CREATE TABLE IF NOT EXISTS truck_locations (
    id SERIAL PRIMARY KEY,
    truck_id VARCHAR(255) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## Service Endpoints

### Location Service (Port 3001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/location` | Ingest new truck location data |
| GET | `/health` | Health check endpoint |

**POST /location Request Example:**
```json
{
  "truckId": "TRUCK-001",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "timestamp": "2026-10-24T12:00:00Z"
}
```

**POST /location Success Response (201 Created):**
```json
{
  "id": 1,
  "truck_id": "TRUCK-001",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "timestamp": "2026-10-24T12:00:00Z"
}
```

### Route History Service (Port 3002)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/history/:truckId` | Get historical route data for a truck |
| GET | `/health` | Health check endpoint |

**GET /history/:truckId Request Example:**
```
GET /history/TRUCK-001?startDate=2026-10-01&endDate=2026-10-24
```

**GET /history/:truckId Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "truck_id": "TRUCK-001",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "timestamp": "2026-10-01T08:00:00Z"
  },
  {
    "id": 2,
    "truck_id": "TRUCK-001",
    "latitude": 40.7200,
    "longitude": -73.9900,
    "timestamp": "2026-10-01T12:00:00Z"
  }
]
```

---

## Project Structure

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/history/:truckId` | Get historical route data for a truck |
| GET | `/health` | Health check endpoint |

**GET /history/:truckId Request Example:**
```
GET /history/TRUCK-001?startDate=2026-10-01&endDate=2026-10-24
```

**GET /history/:truckId Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "truck_id": "TRUCK-001",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "timestamp": "2026-10-01T08:00:00Z"
  },
  {
    "id": 2,
    "truck_id": "TRUCK-001",
    "latitude": 40.7200,
    "longitude": -73.9900,
    "timestamp": "2026-10-01T12:00:00Z"
  }
]
```

---

## Project Structure

```
Kube-Trucker/
│
├── architecture.md                    # System architecture documentation
├── environment_setup.md              # Dev environment setup guide (Docker + Kind)
├── tech_stack.md                     # Technology decisions and rationale
├── README.md                         # This file - project overview and docs
├── init.sql                          # Database schema & initialization SQL
│
├── kubernetes/                        # Kubernetes manifests & cluster config
│   ├── config.yaml                   # Kind cluster configuration
│   ├── frontend-service.yaml         # Frontend Deployment & Service
│   ├── location-service.yaml         # Location Service Deployment & Service
│   ├── route-history-service.yaml    # Route History Service Deployment & Service
│   └── postgres.yaml                 # PostgreSQL Deployment, Service & Persistence
│
├── frontend-service/                  # React web application
│   ├── Dockerfile                    # Container definition for React app
│   ├── nginx.conf                    # Frontend proxy configuration
│   ├── package.json                  # Dependencies (React 17, testing libraries)
│   └── src/
│       ├── App.js                    # Main React component
│       ├── index.js                   # React entry point
│       ├── App.css                    # Application styles
│       ├── index.css                    # Global styles
│       └── reportWebVitals.js          # Performance monitoring
│
├── location-service/                  # Microservice: Location ingestion
│   ├── Dockerfile                    # Container definition for Node service
│   └── index.js                      # Express server (POST /location, GET /health)
│       • Port: 3001
│       • PostgreSQL connection via env variables
│       • INSERT queries to store truck locations
│
└── route-history-service/             # Microservice: Route queries
    ├── Dockerfile                    # Container definition for Node service
    └── index.js                      # Express server (GET /history/:truckId, GET /health)
        • Port: 3002
        • PostgreSQL connection via env variables
        • SELECT queries with optional date range filtering
```

---

## Development Setup

### Prerequisites

1. **Windows OS** (Current environment)
2. **Chocolatey Package Manager** (Recommended for Windows tool installation)

### Step 1: Install Docker Desktop

Docker Desktop is required to run containers, which Kind uses as Kubernetes "nodes".

```powershell
# Verify installation
docker --version
docker compose version
```

**Installation Steps:**
1. Download Docker Desktop from [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2. Install with WSL 2 support enabled (for better Kind performance)
3. Restart your computer after installation
4. Launch Docker Desktop

### Step 2: Install Kind & kubectl

**Install kubectl:**
```powershell
# Using Chocolatey (Recommended)
choco install kubernetes-cli

# Manual Installation
# Download from: https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/
```

**Install Kind:**
```powershell
# Using Chocolatey (Recommended)
choco install kind

# Manual Installation
# Download from: https://kind.sigs.k8s.io/docs/user/quick-start/#installation
```

### Step 3: Create Kubernetes Cluster

```powershell
# Create single-node Kind cluster
kind create cluster --name kube-trucker-cluster

# Verify cluster status
kind get clusters
kubectl cluster-info --context kind-kube-trucker-cluster
kubectl get nodes
```

---

## Getting Started

### Prerequisites

1. **Windows OS** (Current environment)
2. **Chocolatey Package Manager** (Recommended for Windows tool installation)

### Step 1: Install Docker Desktop

Docker Desktop is required to run containers, which Kind uses as Kubernetes "nodes".

```powershell
# Verify installation
docker --version
docker compose version
```

**Installation Steps:**
1. Download Docker Desktop from [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2. Install with WSL 2 support enabled (for better Kind performance)
3. Restart your computer after installation
4. Launch Docker Desktop

### Step 2: Install Kind & kubectl

**Install kubectl:**
```powershell
# Using Chocolatey (Recommended)
choco install kubernetes-cli

# Manual Installation
# Download from: https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/
```

**Install Kind:**
```powershell
# Using Chocolatey (Recommended)
choco install kind

# Manual Installation
# Download from: https://kind.sigs.k8s.io/docs/user/quick-start/#installation
```

### Step 3: Create Kubernetes Cluster

```powershell
# Create single-node Kind cluster
kind create cluster --name kube-trucker-cluster

# Verify cluster status
kind get clusters
kubectl cluster-info --context kind-kube-trucker-cluster
kubectl get nodes
```

---

## Getting Started

### Quick Start Commands

1. **Import Database Schema:**
   ```powershell
   # Run the SQL schema file (requires PostgreSQL running)
   psql -h localhost -U postgres -d kube_trucker < init.sql
   ```

2. **Start Backend Services Locally (for testing):**
   ```powershell
   # Location Service (Port 3001)
   cd location-service && npm start
   
   # Route History Service (Port 3002)
   cd route-history-service && npm start
   ```

3. **Deploy to Kubernetes:**
   ```powershell
   # Build images and deploy all services (example commands - review your manifests)
   kind load docker-image <your-local-reg>/frontend-service:latest
   kind load docker-image <your-local-reg>/location-service:latest
   kind load docker-image <your-local-reg>/route-history-service:latest
   
   # Apply Kubernetes manifests
   kubectl apply -f kubernetes/
   ```

4. **Access Services:**
   - Frontend: `http://<frontend-service-name>.kube-trucker-kind-0.svc.cluster.local`
   - Location Service Health: `kubectl port-forward service/location-service 3001:3001`
   - Route History Service Health: `kubectl port-forward service/route-history-service 3002:3002`

### Running Local Services (Development)

**Start each service separately:**

```powershell
# Terminal 1: Location Service
cd location-service
npm start

# Terminal 2: Route History Service
cd route-history-service  
npm start

# Terminal 3: Frontend
cd frontend-service
npm start
```

### Testing the API Endpoints

**Test Location Service:**
```powershell
curl -X POST http://localhost:3001/location \
  -H "Content-Type: application/json" \
  -d '{"truckId": "TRUCK-001", "latitude": 40.7128, "longitude": -74.0060, "timestamp": "2026-10-24T12:00:00Z"}'
```

**Test Route History Service:**
```powershell
curl http://localhost:3002/history/TRUCK-001?startDate=2026-10-01&endDate=2026-10-24
```

---

## Future Enhancements

- [ ] Implement map visualization in frontend (Leaflet/Mapbox integration)
- [ ] Add authentication and authorization layers
- [ ] Implement real-time location updates via WebSocket
- [ ] Add PostGIS extension for advanced geospatial queries
- [ ] Include monitoring and logging (Prometheus, Grafana)
- [ ] Add horizontal pod autoscaling based on traffic
- [ ] Implement CI/CD pipeline for automated deployment

---

**Built with ❤️ to demonstrate Kubernetes microservices architecture**
