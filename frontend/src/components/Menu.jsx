import { API } from "../config";
import { useState, useEffect } from "react";
import DrinkCard from "./DrinkCard";
import OrderForm from "./OrderForm";

function Menu() {
  const [drinks, setDrinks] = useState([]);
  const [selectedDrink, setSelectedDrink] = useState(null);

  useEffect(() => {
    fetch(`${API}/drinks`)
      .then((res) => res.json())
      .then((data) => setDrinks(data));
  }, []);

  return (
    <div className="menu">
      <h2>Our Drinks</h2>
      <div className="drinks-grid">
        {drinks.map((d) => (
          <DrinkCard key={d._id} drink={d} onOrder={setSelectedDrink} />
        ))}
      </div>

      {selectedDrink && (
  <OrderForm
    key={selectedDrink._id}
    drinks={drinks}
    selectedDrink={selectedDrink}
  />
)}
    </div>
  );
}

export default Menu;