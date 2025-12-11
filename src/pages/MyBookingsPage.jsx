import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyBookingsPage.css";

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings from backend
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:5000/api/bookings");
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Error loading bookings:", err);
      }
      setLoading(false);
    }
    load();
  }, []);

  // Cancel a booking
  async function cancelBooking(id) {
    const ok = window.confirm("Cancel this booking?");
    if (!ok) return;

    try {
      await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "DELETE",
      });

      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error("Error cancelling:", err);
    }
  }

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="mybookings-container">

      <div className="pink-header">
        <h1>My Bookings</h1>
      </div>

      {bookings.length === 0 ? (
        <p className="empty-text">No bookings found</p>
      ) : (
        <div className="booking-list">
          {bookings.map((b) => (
            <div className="booking-card" key={b.id}>
              <p><strong>Court:</strong> {b.courtName}</p>
              <p><strong>Date:</strong> {b.date}</p>
              <p><strong>Time:</strong> {b.start_time} - {b.end_time}</p>

              {b.equipment?.length > 0 && (
                <p><strong>Equipment:</strong> {b.equipment.map(e => `${e.id} x${e.qty}`).join(", ")}</p>
              )}

              {b.coachId && (
                <p><strong>Coach:</strong> {b.coachId}</p>
              )}

              <button
                className="cancel-btn"
                onClick={() => cancelBooking(b.id)}
              >
                Cancel Booking
              </button>
            </div>
          ))}
        </div>
      )}

      <button className="back-btn-bottom" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>
    </div>
  );
}
