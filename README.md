# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/677f1f3c-5bb4-4113-89a1-4a9dc7027545

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/677f1f3c-5bb4-4113-89a1-4a9dc7027545) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Integration in MERN stack, technical considerations outline

### Technical Overview

The current Stratoview application is a React frontend that already has:

1. A map visualization component (`StratumMap.tsx`)
2. Data visualization components using Recharts (`StratumGraphs.tsx`)
3. An index/metrics dashboard (`StratumIndex.tsx`)
4. Integrating with a MERN backend would be feasible since this app is already React-based. Here's what we need to consider:

### Integration Points

1. API Connection: You'd need an API client to fetch data from your Express/Node.js backend
2. Map Integration: Replace the mock map with real geodata from your backend
3. Charts/Graphs: Feed real data to the existing Recharts components
4. State Management: Connect backend data to the React state system

### Information Needed

To implement this integration, I would need to know:

1. API Structure: What endpoints does your backend expose? What data formats?
2. Authentication: Does your API require authentication?
3. Map Data Format: What format is your geospatial data in? (GeoJSON, coordinates, etc.)
4. Visualization Requirements: What specific charts/metrics should display your MongoDB data?
5. Real-time Requirements: Do you need real-time updates (WebSockets) or just HTTP requests?

### Technical Approach

The most straightforward approach would be to:

1. Create API service modules to fetch data from your MERN backend
2. Implement data transformation functions to convert backend responses into formats compatible with the existing visualization components
3. Modify the useStratum context to include functions for data fetching and state updates
4. Update the map component to use real geodata instead of the mock implementation

### Potential Constraints

1. Cross-Origin Requests: Your backend would need proper CORS configuration
2. Authentication Flow: If your backend requires auth, we'd need to implement that
3. Performance: Large datasets might require optimization strategies
4. Map Library Choice: The current implementation is a mock, we might need to implement a real map library (Mapbox, Leaflet, etc.)

## Collaborative Development Workflow

### Repository Structure

- Keep frontend (Lovable-managed) and backend code in separate directories (`/frontend` and `/backend`)
- Maintain clear documentation for the interface boundaries

### API Contract First Approach

- Define API contracts early (OpenAPI/Swagger specifications)
- Create mock API responses for frontend development
- Implement backend endpoints matching the contract

### Branch Strategy

- `main` - stable, production-ready code
- `development` - integration branch for frontend and backend
- `feature/frontend/*` - Lovable-managed frontend features
- `feature/backend/*` - Backend developer features

### Pull Request Process

- Create separate PRs for frontend and backend changes
- Review and test independently before merging to development
- Perform integration testing in the development branch

### Local Development Setup

- Backend developers run the API locally
- Frontend developers can:
  - Use Lovable for UI work
  - Pull latest frontend code for integration testing
  - Configure environment variables for backend connections

### Synchronization Process

1. Export code from Lovable (download or GitHub integration)
2. Push to your feature branch
3. Create a PR to merge into development
4. After review, merge and test integration with backend

### Deployment Pipeline

- Set up CI/CD for automated testing
- Deploy frontend and backend separately if possible
- Use environment configurations to connect the right endpoints

## Frontend-Backend Integration Structure for Stratoview

### Recommended Project Structure

```
project-root/
├── frontend/           # React frontend managed by Lovable
│   ├── src/
│   │   ├── api/        # API client code to interact with backend
│   │   │   ├── client.ts          # Base API client setup (axios/fetch)
│   │   │   ├── endpoints.ts       # API endpoint definitions
│   │   │   ├── mapService.ts      # Map data fetching and transformation
│   │   │   ├── dataService.ts     # Graph/metrics data services
│   │   │   └── models/            # TypeScript interfaces matching backend models
│   │   │       ├── StratumData.ts
│   │   │       ├── GeoData.ts
│   │   │       └── MetricsData.ts
│   │   ├── components/
│   │   │   └── ... existing components ...
│   │   ├── contexts/
│   │   │   └── StratumContext.tsx  # Enhanced with data fetching
│   │   └── ... other frontend files ...
│   └── ... frontend config files ...
│
├── backend/           # MERN backend (separate repo/directory)
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── stratumController.js
│   │   │   ├── mapController.js
│   │   │   └── metricsController.js
│   │   ├── models/
│   │   │   ├── Stratum.js          # MongoDB schema
│   │   │   ├── GeoData.js
│   │   │   └── Metrics.js
│   │   ├── routes/
│   │   │   ├── api.js              # API route definitions
│   │   │   └── ... specific routes ...
│   │   └── app.js                  # Express app setup
│   └── ... backend config files ...
│
├── docs/
│   ├── api-contract.md             # API contract documentation
│   └── data-models.md              # Shared data model documentation
│
└── ... project-level config files ...
```

### Key Integration Components

#### 1. API Contract Definition

In `docs/api-contract.md`, define a clear API contract that both frontend and backend developers agree on.

#### 2. Frontend API Client Layer

Create structured API services in the frontend to communicate with the backend.

#### 3. Environment Configuration

Set up environment variables for development.

#### 4. Mock API for Frontend Development

Create a mock API implementation to use before the real backend is ready.

#### 5. Backend API Implementation

Define clear controllers and routes in the backend.

### Technical Considerations

- **Authentication Flow**: Implement secure authentication between frontend and backend

```typescript
// src/api/authService.ts
import { apiClient } from "./client";

export const login = async (username: string, password: string) => {
  const response = await apiClient.post("/auth/login", { username, password });
  const { token } = response.data;

  // Store token in localStorage or secure cookie
  localStorage.setItem("auth_token", token);

  // Set auth header for future requests
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  return response.data;
};
```

- **Data Transformation Layer**: Convert API responses to component-compatible formats

```typescript
// src/utils/dataTransformers.ts
import { ApiStratum } from "../api/models/ApiModels";
import { Stratum } from "../contexts/StratumContext";

export const transformApiStratumToAppStratum = (
  apiStratum: ApiStratum
): Stratum => {
  return {
    id: apiStratum.id,
    name: apiStratum.name,
    location: apiStratum.location,
    activeTab: "map",
    layout: "tabs",
    isExpanded: false,
    tabs: {
      map: {
        enabled: true,
        layers: apiStratum.mapLayers.map((layer) => ({
          id: layer.id,
          name: layer.name,
          visible: layer.defaultVisible,
          type: layer.type,
        })),
      },
      // ... transform other properties
    },
  };
};
```

- **Feature Flags**: Control when to use real backend vs mock data

```typescript
// src/config/features.ts
export const FEATURES = {
  USE_REAL_API: process.env.REACT_APP_USE_REAL_API === "true",
  ENABLE_REALTIME: process.env.REACT_APP_ENABLE_REALTIME === "true",
};

// src/api/index.ts
import * as mockApi from "./mockClient";
import * as realApi from "./client";
import { FEATURES } from "../config/features";

export const api = FEATURES.USE_REAL_API ? realApi : mockApi;
```

- **Real-time Updates**: Implement WebSockets if needed for live data

```typescript
// src/api/socketService.ts
import io from "socket.io-client";
import { FEATURES } from "../config/features";

let socket: any = null;

export const initializeSocket = (token: string) => {
  if (!FEATURES.ENABLE_REALTIME) return;

  socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5000", {
    auth: { token },
  });

  socket.on("connect", () => {
    console.log("Socket connected");
  });

  return socket;
};

export const subscribeToStratumUpdates = (
  stratumId: string,
  callback: (data: any) => void
) => {
  if (!socket || !FEATURES.ENABLE_REALTIME) return () => {};

  socket.emit("subscribe", { stratumId });
  socket.on(`stratum:${stratumId}:update`, callback);

  return () => {
    socket.off(`stratum:${stratumId}:update`, callback);
    socket.emit("unsubscribe", { stratumId });
  };
};
```

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
