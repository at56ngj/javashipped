import { API } from "../config";
import { useState, useEffect } from "react";

function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API}/analytics`)
      .then((res) => res.json())
      .then((result) => setData(result));
  }, []);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div className="status-page">
      <h2>Analytics Dashboard</h2>

      <div className="order-row">
        <p>Total Orders: {data.totalOrders}</p>
        <p>Total Sales: ₹{data.totalSales}</p>
      </div>

      <div className="order-row">
        <h3>Orders per Drink</h3>
        {data.totalOrders === 0 && <p>No orders yet.</p>}
        {Object.entries(data.perDrink).map(([drink, count]) => (
          <p key={drink}>
            {drink}: {count} orders (
            {((count / data.totalOrders) * 100).toFixed(1)}%)
          </p>
        ))}
      </div>
    </div>
  );
}

export default Analytics;