# Truck Tracking Application Architecture

This document outlines the high-level architecture for our Kubernetes-based truck tracking application.

## System Overview

The application will be built using a microservices architecture. This approach will allow us to develop, deploy, and scale each component independently, which is a perfect use case for Kubernetes.

We will have three core microservices:

1.  **Location Service**: Ingests and stores truck location data.
2.  **Route History Service**: Provides historical route data via an API.
3.  **Frontend Service**: A web-based UI to display truck routes on a map.

## Architecture Diagram

Here is a Mermaid diagram illustrating the interaction between these services:

```mermaid
graph TD
    subgraph "Kubernetes Cluster"
        direction LR
        subgraph "Services"
            Frontend[Frontend Service]
            RouteHistory[Route History Service]
            Location[Location Service]
        end
        subgraph "Data Storage"
            Database[(Database)]
        end
    end

    User[User] -->|Views Map| Frontend
    Frontend -->|Requests Route Data| RouteHistory
    RouteHistory -->|Queries Data| Database
    Location --|>|Stores Location Data| Database

    subgraph "External"
        Truck[Simulated Truck Data] -->|Sends Location Data| Location
    end

```

## Microservice Details

### 1. Location Service

*   **Purpose**: To receive GPS coordinates from trucks and persist them in the database.
*   **Responsibilities**:
    *   Expose an API endpoint to receive location updates.
    *   Validate incoming data.
    *   Store the location data with a timestamp and truck ID.

### 2. Route History Service

*   **Purpose**: To provide clients with historical route data for a given truck.
*   **Responsibilities**:
    *   Expose an API endpoint to query for route history (e.g., by truck ID and time range).
    *   Fetch data from the database.
    *   Format the data for the frontend.

### 3. Frontend Service

*   **Purpose**: To provide a user interface for visualizing truck routes.
*   **Responsibilities**:
    *   Display a map.
    *   Allow users to select a truck.
    *   Fetch and display the historical route for the selected truck.

This architecture provides a clear separation of concerns and will allow us to explore various Kubernetes concepts as we build and deploy each service.