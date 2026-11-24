function DrinkCard({ drink, onOrder }) {
  const imageName = drink.name.toLowerCase().replace(" ", "-");

  return (
    <div className="drink-card">
      <img src={`/images/${imageName}.jpg`} alt={drink.name} />
      <h3>{drink.name}</h3>
      <p>{drink.description}</p>
      <p className="price">₹{drink.price}</p>
      <button onClick={() => onOrder(drink)}>Order Now</button>
    </div>
  );
}

export default DrinkCard;