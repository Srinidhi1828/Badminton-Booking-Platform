import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";   // ✅ Added
import "./Booking.css";

export default function Booking() {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [courtId, setCourtId] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [coachId, setCoachId] = useState("");
  const [breakdown, setBreakdown] = useState(null);
  const [message, setMessage] = useState("");

  const [courtsList, setCourtsList] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [coachesList, setCoachesList] = useState([]);

  const navigate = useNavigate(); // ✅ Navigation hook

  // NEXT BUTTON FUNCTION
  const goNext = () => {
    navigate("/my-bookings");
  };

  useEffect(() => {
    axios.get("http://localhost:5000/api/bookings/courts").then(r => setCourtsList(r.data));
    axios.get("http://localhost:5000/api/bookings/equipment").then(r => setEquipmentList(r.data));
    axios.get("http://localhost:5000/api/bookings/coaches").then(r => setCoachesList(r.data));
  }, []);

  const toggleEquipment = (id) => {
    const found = selectedEquipment.find(s => s.id === id);
    if (found)
      setSelectedEquipment(selectedEquipment.filter(s => s.id !== id));
    else
      setSelectedEquipment([...selectedEquipment, { id, qty: 1 }]);
  };

  const setEqQty = (id, qty) => {
    setSelectedEquipment(selectedEquipment.map(s => s.id === id ? { ...s, qty } : s));
  };

  useEffect(() => {
    if (!date || !startTime || !endTime || !courtId) return setBreakdown(null);

    axios
      .post("http://localhost:5000/api/bookings/price-estimate", {
        date,
        start_time: startTime,
        end_time: endTime,
        courtId,
        equipment: selectedEquipment,
        coachId: coachId || null
      })
      .then(res => setBreakdown(res.data))
      .catch(() => setBreakdown(null));
  }, [date, startTime, endTime, courtId, selectedEquipment, coachId]);

  const submitBooking = async () => {
    if (!date || !startTime || !endTime || !courtId) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/bookings", {
        date,
        start_time: startTime,
        end_time: endTime,
        courtId,
        equipment: selectedEquipment,
        coachId: coachId || null,
        user_email: "test@gmail.com"
      });

      setMessage("Booking successful!");
    } catch (err) {
      setMessage(err.response?.data?.error || "Booking failed");
    }
  };

  return (
    <div className="booking-wrapper">
      <div className="booking-container">
        <h2 className="title">Book a Court</h2>

        {/* DATE & TIME */}
        <div className="inputs-row">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
          <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
        </div>

        {/* COURT */}
        <label className="label">Select Court</label>
        <select value={courtId} onChange={e => setCourtId(e.target.value)}>
          <option value="">Choose court</option>
          {courtsList.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.type})
            </option>
          ))}
        </select>

        {/* EQUIPMENT */}
        <h4 className="label">Equipment</h4>
        {equipmentList.map(eq => {
          const sel = selectedEquipment.find(s => s.id === eq.id);
          return (
            <div key={eq.id} className="eq-row">
              <label>
                <input type="checkbox" checked={!!sel} onChange={() => toggleEquipment(eq.id)} />
                {eq.name} (+${eq.fee})
              </label>
              {sel && (
                <input
                  type="number"
                  min="1"
                  value={sel.qty}
                  onChange={e => setEqQty(eq.id, Number(e.target.value))}
                />
              )}
            </div>
          );
        })}

        {/* COACH */}
        <label className="label">Coach</label>
        <select value={coachId} onChange={e => setCoachId(e.target.value)}>
          <option value="">No coach</option>
          {coachesList.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} (+${c.fee})
            </option>
          ))}
        </select>

        {/* BUTTONS */}
        <div className="btn-row">
          <button className="p-btn" onClick={submitBooking}>
            Confirm Booking →
          </button>
        </div>

        <div className="btn-row">
          <button className="p-btn-outline" onClick={() => window.history.back()}>
            ← Back
          </button>

          <button className="p-btn-outline" onClick={goNext}>
            Next →
          </button>
        </div>

        {message && <div className="msg">{message}</div>}
      </div>

      {/* PRICE PANEL */}
      <div className="price-card">
        <h3 className="title">Price Estimate</h3>

        {breakdown ? (
          <div className="price-details">
            <div>Base: ${breakdown.basePrice}</div>
            <div>Equipment: ${breakdown.equipmentFee}</div>
            <div>Coach: ${breakdown.coachFee}</div>
            {breakdown.surcharges?.map(s => (
              <div key={s.id}>{s.name}: +${s.amount}</div>
            ))}
            {breakdown.multipliers?.map(m => (
              <div key={m.id}>{m.name}: x{m.multiplier}</div>
            ))}
            <div className="total">Total: ${breakdown.total}</div>
          </div>
        ) : (
          <p>Select inputs to see price</p>
        )}
      </div>
    </div>
  );
}
