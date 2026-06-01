# Order Management Frontend

A modern React frontend for the [Order Management API](https://github.com/rimjhimkrishna/order-management-api) backend. Built with **React + Vite + Tailwind CSS**.

This is a separate repository that connects to the backend over HTTP. The two projects are developed independently (multi-repo setup).

## Features

- JWT authentication (register / login) with token persistence
- Product catalog with search, price sorting, and live stock badges
- Cart and one-click order placement
- "My Orders" page with a visual status timeline (PENDING -> CONFIRMED -> SHIPPED -> DELIVERED) and order cancellation
- Admin dashboard: product CRUD, order status management, and summary stats (orders, revenue, low stock)
- Responsive design, loading skeletons, and toast feedback

## Tech Stack

- React 18 (Vite)
- React Router v6
- Axios (JWT interceptor)
- Tailwind CSS

## Project Structure

```
src/
  api/        client.js (Axios + JWT), services.js (endpoints)
  context/    AuthContext.jsx (auth state)
  components/ Navbar.jsx
  pages/      Login, Register, Products, Orders, AdminDashboard
  App.jsx     routes + protected routes
  main.jsx    entry
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`) and set the backend URL:

```
VITE_API_URL=http://localhost:8080/api/v1
```

3. Start the dev server:

```bash
npm run dev
```

The app runs at http://localhost:5173

## Connecting to the Backend

This frontend talks to the Spring Boot backend at `VITE_API_URL`. Run the backend locally per its README (`docker-compose up`), which serves it on port 8080.

### CORS (backend side)

The backend must allow this frontend's origin. In the backend's `SecurityConfig.java` CORS configuration, add the frontend origin (e.g. `http://localhost:5173` for local dev, and the deployed URL in production). Without this, the browser will block requests with a CORS error.

### Auth flow

Login returns a JWT token, which is stored in localStorage and automatically attached as `Authorization: Bearer <token>` on every request by the Axios interceptor in `src/api/client.js`.

## License

MIT
