import React from 'react';


function AddEditModal({ isOpen, onRequestClose, onSubmit, initialData }) {
  

  const [path, setPath] = React.useState(initialData.path || '');
  const [days, setDays] = React.useState(initialData.days || []);
  const [hours, setHours] = React.useState(initialData.hours || '');
  const [frequency, setFrequency] = React.useState(initialData.frequency || 20);

  const handleSubmit = () => {
    onSubmit({ path, days, hours, frequency });
    onRequestClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add / Edit Directory</h2>
        <form>
          <div>
            <label>Path to Directory:</label>
            <input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
            />
          </div>
          <div>
            <label>Days of the Week:</label>
            <input
              type="text"
              value={days}
              onChange={(e) => setDays(e.target.value.split(','))}
              placeholder="e.g., Monday,Tuesday"
            />
          </div>
          <div>
            <label>Active Hours:</label>
            <input
              type="text"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="e.g., 09:00-17:00"
            />
          </div>
          <div>
            <label>Frequency (seconds):</label>
            <input
              type="text"
              min="20"
              max="600"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              placeholder="from 20 to 600 secs"
            />
          </div>
          <button type="button" onClick={handleSubmit}>
            Confirm
          </button>
          <button type="button" onClick={onRequestClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddEditModal;