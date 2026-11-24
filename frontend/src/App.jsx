import { Routes, Route, Link } from "react-router-dom";
import Landing from "./components/Landing";
import Menu from "./components/Menu";
import OrderStatus from "./components/OrderStatus";
import Kitchen from "./components/Kitchen";
import Analytics from "./components/Analytics";

function App() {
  return (
    <div>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/status">Order Status</Link>
        <Link to="/kitchen">Kitchen</Link>
        <Link to="/analytics">Analytics</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/status" element={<OrderStatus />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </div>
  );
}

export default App;