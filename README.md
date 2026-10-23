# Kampung Melati SuperApp

A modern, responsive citizen association (**Rukun Warga / RW**) dashboard and web portal built with React 19, TypeScript, and Tailwind CSS. The platform serves as a centralized digital ecosystem for neighborhood management, providing transparent public administration, utility billing, role-based governance, and community news.

---

## 🏛️ Ecosystem Overview

The application is structured into four core pillars accessible via a centralized gateway:

1. **Community Portal (`/`)**
   - The primary gateway and entry point for all citizens association digital services.
   - Displays real-time service status, quick announcements, and module shortcuts.

2. **Water System Manager (`/water-system`)**
   - **Resident Directory:** Manage neighborhood households, meter IDs, and contact info.
   - **Meter Logging & Tiered Billing:** Record monthly cubic meter ($m^3$) readings with automatic cost calculation using tiered utility tariffs.
   - **Payment Status Tracking:** Instant toggle between Paid and Unpaid with local and remote persistence.
   - **TanStack Data Table:** Advanced search, column sorting, pagination, and one-click filter reset.
   - **Printable Reports:** Dedicated `@media print` layout (`Ctrl+P` or via header button) for clean monthly administrative reports.

3. **Treasury & Dues / Kas RW (`/treasury`)**
   - **Financial Transparency Ledger:** Public and administrative transaction audit records (dues collection, operational expenses, utility transfers).
   - **Live Financial KPIs:** Real-time visibility into Total Kas Balance, Monthly Inflow, Monthly Expenditures, and Dues Compliance Rate.
   - **Citizen Dues Lookup:** Resident-level dues verification status.
   - **Administrative Payment Recording:** Secure modal dialogs for authorized staff to log payments and record expenditures.

4. **Announcements & News (`/announcements`)**
   - Community news feed designed with a modern news portal layout.
   - Highlights a **Trending / Featured Story** alongside a chronological list of **Recent Updates & Announcements**.

---

## 🔐 Centralized Role-Based Access Control (RBAC)

The dashboard includes full authentication and authorization primitives integrated with [`AuthContext`](src/contexts/AuthContext.tsx):

- **Supported Roles:**
  - `admin` (Ketua RW / Administrator): Full system permissions across all modules.
  - `treasurer` (Bendahara RW): Manage treasury transactions, record dues, and view audit reports.
  - `resident` (Warga): Read-only view for public metrics, community announcements, and personal dues history.
- **Route Guarding:** Protected route component ([`ProtectedRoute`](src/components/ProtectedRoute.tsx)) enforcing permission requirements (e.g., `treasury:read`, `water:manage`) with automatic redirection and toast feedback.
- **Interactive Persona Switcher:** Built-in dev header switcher allowing instant role simulation between Administrator, Bendahara, and Warga.

---

## 🛠️ Tech Stack

- **Framework & Bundler:** [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + [tw-animate-css](https://github.com)
- **Component Primitives:** [Shadcn UI](https://ui.shadcn.com/) + [@base-ui/react](https://base-ui.com/)
- **Table Engine:** [TanStack Table v8](https://tanstack.com/table/v8)
- **Animations:** [Motion (Framer Motion)](https://motion.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Typography:** [Fontsource Poppins](https://fontsource.org/fonts/poppins)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **Backend Companion:** Designed to integrate with [`rukun-warga-api`](../rukun-warga-api) (Go, Gin, GORM, PostgreSQL).

---

## 📁 Project Structure

```text
src/
├── components/          # Reusable UI components & route guards
│   ├── ui/              # Shadcn primitive components (button, sonner, etc.)
│   ├── ProtectedRoute.tsx # RBAC route protection wrapper
│   └── Table.tsx        # TanStack table implementation
├── contexts/            # React context providers
│   └── AuthContext.tsx  # User session, persona switcher & RBAC logic
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication session hook
│   └── usePermission.ts # Granular permission verification hook
├── pages/               # Top-level route pages
│   ├── Portal.tsx       # SuperApp main landing page
│   ├── WaterSystem.tsx  # KSM water management dashboard
│   └── Announcements.tsx# Community news & bulletin portal
├── types/               # TypeScript interface and type definitions
│   ├── auth.ts          # Roles, permissions & user models
│   ├── treasury.ts      # Transaction & dues schemas
│   └── index.ts         # Water system, news & common types
├── utils/               # Formatting, calculation, and currency helpers
└── App.tsx              # Application entry, router & Treasury view
```

---

## 📦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation & Development

1. Navigate to the project directory:
   ```bash
   cd rukun-warga-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev`: Starts the Vite dev server on port `3000`.
- `npm run build`: Compiles and bundles production-ready TypeScript code.
- `npm run preview`: Locally previews the production build.
- `npm run lint`: Runs TypeScript compiler check (`tsc --noEmit`).

---

## 🚀 Deployment & Containerization

The production build uses a hardened multi-stage Docker setup with an optimized Nginx server configured for Single-Page Application (SPA) routing.

### 🐳 Docker Deployment

1. **Build image**:
   ```bash
   docker build -t rukun-warga-web:latest .
   ```

2. **Run container**:
   ```bash
   docker run -d -p 8080:80 --name rukun-warga-web rukun-warga-web:latest
   ```

3. **Verify running instance**:
   - Access web app: [http://localhost:8080](http://localhost:8080)
   - Probe health endpoint: `curl http://localhost:8080/health` (returns `healthy`)

4. **Tag & push to container registry**:
   ```bash
   docker tag rukun-warga-web:latest <your-dockerhub-username>/rukun-warga-web:latest
   docker push <your-dockerhub-username>/rukun-warga-web:latest
   ```

### ☸️ Kubernetes Deployment

Preconfigured Kubernetes manifests are available in the [`k8s/`](k8s/) directory:

- [`k8s/web.yaml`](k8s/web.yaml): Deploys 2 replicas with resource limits, liveness/readiness probes, and exposes a `LoadBalancer` Service on port 80.
- [`k8s/ingress.yaml`](k8s/ingress.yaml): Optional Ingress configuration routing `/` to the web app and `/api` to `rukun-warga-api-service`.

```bash
# 1. Update image repository in k8s/web.yaml
# Replace 'your-dockerhub-username/rukun-warga-web:latest' with your image

# 2. Apply deployment and service
kubectl apply -f k8s/web.yaml

# 3. (Optional) Apply ingress controller routing
kubectl apply -f k8s/ingress.yaml

# 4. Verify deployment status
kubectl get pods -l app=rukun-warga-web
kubectl get service rukun-warga-web-service
```

### 🌐 Nginx Configuration Features

The custom [`nginx.conf`](nginx.conf) includes:
- **SPA Fallback**: `try_files $uri $uri/ /index.html;` ensures seamless client-side routing on page reloads.
- **Probe Endpoint**: `/health` endpoint for Kubernetes health checks.
- **Cache Optimization**: Aggressive 1-year caching for fingerprinted assets (`/assets/*`) and `no-cache` on `index.html` for instant updates upon deployment.
- **Security Headers**: Includes `X-Frame-Options`, `X-Content-Type-Options`, and `Referrer-Policy`.


