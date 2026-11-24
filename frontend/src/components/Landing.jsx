import FeatureCard from "./FeatureCard";

function Landing() {
  return (
    <div className="landing">
      <h1>JavaShipped</h1>
      <img src="/banner.jpg" alt="Coffee banner" className="banner" />
      <p className="about">
        JavaShipped is an online coffee delivery company. Pick your favourite
        drink, place an order, and we deliver it fresh to your door.
      </p>

      <div className="features">
        <FeatureCard
          title="Our Drinks"
          text="Browse our menu of lattes, cappuccinos, espresso and more."
        />
        <FeatureCard
          title="Track Your Order"
          text="See your order move from Received to Delivered."
        />
        <FeatureCard
          title="Live Analytics"
          text="View total orders, sales and the most popular drinks."
        />
      </div>
    </div>
  );
}

export default Landing;