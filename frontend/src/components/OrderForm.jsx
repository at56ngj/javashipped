import { API } from "../config";
import { useState } from "react";

function OrderForm({ drinks, selectedDrink }) {
  const [customerName, setCustomerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [drinkName, setDrinkName] = useState(selectedDrink.name);
  const [size, setSize] = useState("Small");
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");

  const [placedOrder, setPlacedOrder] = useState(null);
  const [error, setError] = useState("");

  // find the chosen drink to get its price
  const chosen = drinks.find((d) => d.name === drinkName);
  const total = chosen ? chosen.price * quantity : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPlacedOrder(null);

    const res = await fetch(`${API}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName,
        mobile,
        drink: drinkName,
        size,
        quantity: Number(quantity),
        address,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.message); // e.g. "Out of stock"
    } else {
      setPlacedOrder(data);
    }
  };

  return (
    <div className="order-form">
      <h3>Place Your Order</h3>
      <form onSubmit={handleSubmit}>
        <label>Customer Name</label>
        <input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />

        <label>Mobile Number</label>
        <input
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
        />

        <label>Drink</label>
        <select value={drinkName} onChange={(e) => setDrinkName(e.target.value)}>
          {drinks.map((d) => (
            <option key={d._id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>

        <label>Size</label>
        <select value={size} onChange={(e) => setSize(e.target.value)}>
          <option>Small</option>
          <option>Medium</option>
          <option>Large</option>
        </select>

        <label>Quantity</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <label>Delivery Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <p className="total">Total Amount: ₹{total}</p>
        <button type="submit">Place Order</button>
      </form>

      {error && <p className="error">{error}</p>}

      {placedOrder && (
        <div className="success">
          <p>Order placed!</p>
          <p>Order ID: {placedOrder.orderId}</p>
          <p>Status: {placedOrder.status}</p>
        </div>
      )}
    </div>
  );
}

export default OrderForm;