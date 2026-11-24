# JavaShipped - Coffee Order Manager (MERN)

A full-stack coffee ordering app. Customers browse drinks and place orders; kitchen staff track and update each order until it is delivered.

**Stack:** MongoDB (in Docker), Express, React (Vite), Node.js

## Requirements

- Node.js and npm
- Docker Desktop

## How to run

### 1. Start MongoDB in Docker

```
docker run -d --name javashipped-mongo -p 27017:27017 -v mongo_data:/data/db mongo
```

If the container already exists, start it with:

```
docker start javashipped-mongo
```

### 2. Add the drinks (one time only)

Open mongosh:

```
docker exec -it javashipped-mongo mongosh
```

Then run:

```
use coffeeDB
```

```
db.drinks.insertMany([
  { name: "Latte", description: "Smooth espresso with steamed milk", price: 150, stock: 20 },
  { name: "Cappuccino", description: "Espresso with thick milk foam", price: 140, stock: 20 },
  { name: "Espresso", description: "Strong and bold single shot", price: 100, stock: 20 },
  { name: "Cold Coffee", description: "Chilled coffee blended with ice cream", price: 160, stock: 15 },
  { name: "Mocha", description: "Coffee with chocolate and milk", price: 170, stock: 15 },
  { name: "Americano", description: "Espresso diluted with hot water", price: 120, stock: 25 }
])
```

The `customers` and `orders` collections are created automatically when the first order is placed.

### 3. Start the backend (Terminal 1)

```
cd backend
npm install
node index.js
```

Expected output:

```
Server running on port 5000
MongoDB connected
```

### 4. Start the frontend (Terminal 2)

```
cd frontend
npm install
npm run dev
```

Open the address shown in the terminal (usually http://localhost:5173).

## Pages

| URL | Page |
|---|---|
| `/` | Landing page |
| `/menu` | Drinks menu and order form |
| `/status` | Order Status (refreshes every 5 seconds, customer can cancel while status is Received) |
| `/kitchen` | Kitchen (Admin) page to update order status |
| `/analytics` | Analytics dashboard |

## Backend API

| Method | Route | Purpose |
|---|---|---|
| GET | `/drinks` | List all drinks |
| POST | `/orders` | Place an order (checks stock, reduces stock) |
| GET | `/orders` | List all orders |
| PUT | `/orders/:orderId/status` | Update order status |
| DELETE | `/orders/:orderId` | Cancel an order (only if Received; restores stock) |
| GET | `/analytics` | Total orders, total sales, orders per drink |
