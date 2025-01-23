// src/components/AddEditModal.jsx
import { useState } from "react";
import { addDirectory } from "../api";

const AddEditModal = ({ onModalClose }) => {
  const [path, setPath] = useState("");
  const [days, setDays] = useState([]);
  const [hours, setHours] = useState("");
  const [frequency, setFrequency] = useState(30);

  const handleSubmit = () => {
    addDirectory(path, days, hours, frequency);
    onModalClose(); // Затваряне на модала след добавяне
  };

  return (
    <div className="modal">

      <h2>Add/Edit Directory</h2>
      <form action="">
      <input
        type="text"
        placeholder="Path"
        value={path}
        onChange={(e) => setPath(e.target.value)}
      />
      <input
        type="text"
        placeholder="Days (comma separated)"
        value={days}
        onChange={(e) => setDays(e.target.value.split(","))}
      />
      <input
        type="text"
        placeholder="Hours (e.g., 09:00-17:00)"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
      />
      <input
        type="number"
        placeholder="Frequency (seconds)"
        value={frequency}
        onChange={(e) => setFrequency(Number(e.target.value))}
      />
      <button onClick={handleSubmit}>Add</button>
      <button onClick={onModalClose}>Cancel</button>
      </form>
    </div>
  );
};

export default AddEditModal;