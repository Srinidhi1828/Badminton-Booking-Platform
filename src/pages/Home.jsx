import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">

      {/* Navigation */}
      <nav className="nav">
        <Link to="/" className="nav-btn active">Home</Link>
        <Link to="/booking" className="nav-btn">Book Court</Link>
        <Link to="/my-bookings" className="nav-btn">My Bookings</Link>
      </nav>

      {/* Main Card */}
      <div className="hero-card">
        <h1 className="title">Badminton Booking Platform</h1>
        <p className="subtitle">
          Reserve courts, rent equipment, and schedule training sessions — all in one place.
        </p>

        {/* Images */}
        <div className="home-images"> 
          <img src="https://gelora-public-storage.s3-ap-southeast-1.amazonaws.com/upload/public-20230915041940.jpg" className="hero-image" />
          <img src="https://cdn.pixabay.com/photo/2016/05/31/23/21/badminton-1428046_1280.jpg" className="hero-image" />
          <img src="http://upload.wikimedia.org/wikipedia/commons/1/1f/Badminton_Semifinal_Pan_2007.jpg" className="hero-image" />
        </div>

        {/* CTA Buttons */}
        <div className="hero-actions">
          <Link to="/booking" className="primary-btn">Book Now</Link>
          <Link to="/my-bookings" className="secondary-btn">My Bookings</Link>
        </div>
      </div>
    </div>
  );
}
