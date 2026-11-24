import { API } from "../config";
import { useState, useEffect } from "react";

function OrderStatus() {
  const [mobile, setMobile] = useState("");
  const [orders, setOrders] = useState([]);

  const loadOrders = () => {
    fetch(`${API}/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data));
  };

  // load now, then refresh every 5 seconds
  useEffect(() => {
    loadOrders();
    const timer = setInterval(loadOrders, 5000);
    return () => clearInterval(timer);
  }, []);

  const cancelOrder = async (orderId) => {
    const res = await fetch(`${API}/orders/${orderId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    alert(data.message);
    loadOrders();
  };

  const myOrders = orders.filter((o) => o.mobile === mobile);

  const statusClass = (status) =>
    "status " + status.toLowerCase().replace(" ", "-");

  return (
    <div className="status-page">
      <h2>Track Your Order</h2>

      <input
        placeholder="Enter your mobile number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />

      {mobile && myOrders.length === 0 && <p>No orders found.</p>}

      {myOrders.map((o) => (
        <div key={o._id} className="order-row">
          <p>Order ID: {o.orderId}</p>
          <p>
            {o.drink} ({o.size}) x {o.quantity}
          </p>
          <p>Total: ₹{o.totalAmount}</p>
          <p>
            Status: <span className={statusClass(o.status)}>{o.status}</span>
          </p>
          {o.status === "Received" && (
            <button onClick={() => cancelOrder(o.orderId)}>Cancel Order</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default OrderStatus;