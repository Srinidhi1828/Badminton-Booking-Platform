import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import MyBookingsPage from "./pages/MyBookingsPage";
import Navbar from "./components/Navbar"; // ⬅ Add this

export default function App() {
  return (
    <Router>
      <div className="app-container">   {/* ✅ UI Wrapper */}
        <Navbar />                      {/* ✅ Top Navigation */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}
