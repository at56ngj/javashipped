import { API } from "../config";
import { useState, useEffect } from "react";

function Kitchen() {
  const [orders, setOrders] = useState([]);

  const loadOrders = () => {
    fetch(`${API}/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    await fetch(`${API}/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    loadOrders();
  };

  const statusClass = (status) =>
    "status " + status.toLowerCase().replace(" ", "-");

  return (
    <div className="status-page">
      <h2>Kitchen - All Orders</h2>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((o) => (
        <div key={o._id} className="order-row">
          <p>Order ID: {o.orderId}</p>
          <p>
            {o.customerName} - {o.mobile}
          </p>
          <p>
            {o.drink} ({o.size}) x {o.quantity}
          </p>
          <p>Address: {o.address}</p>
          <p>Total: ₹{o.totalAmount}</p>
          <p>
            Status: <span className={statusClass(o.status)}>{o.status}</span>
          </p>

          {o.status === "Received" && (
            <button
              className="kitchen-btn"
              onClick={() => updateStatus(o.orderId, "Being Prepared")}
            >
              Start Preparing
            </button>
          )}
          {o.status === "Being Prepared" && (
            <button
              className="kitchen-btn"
              onClick={() => updateStatus(o.orderId, "Delivered")}
            >
              Mark Delivered
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Kitchen;