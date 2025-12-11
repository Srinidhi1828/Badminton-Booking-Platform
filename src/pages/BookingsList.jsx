import { useEffect, useState } from "react";
import axios from "axios";

export default function BookingsList() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/bookings")
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Court</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.date}</td>
                <td>{b.start_time}</td>
                <td>{b.end_time}</td>
                <td>{b.court}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
