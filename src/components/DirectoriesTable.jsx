import React, { useState, useEffect } from 'react';
import { getDirectories, deleteDirectory, updateDirectory } from '../api'; // Импортиране на функции от api

function DirectoriesTable() {
  const [directories, setDirectories] = useState([]);

  useEffect(() => {
    // Зареждане на директориите при маунт на компонента
    getDirectories().then(setDirectories);
  }, []);

  const handleDelete = async (index) => {
    // Изтриване на директория
    try {
      await deleteDirectory(index);
      setDirectories((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Failed to delete directory:', error);
    }
  };

  const handleEdit = (index) => {
    // Логика за редакция на директория
    console.log('Edit directory at index:', index);
    // Тук можете да отворите модал или форма за редакция
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Path</th>
            <th>Days</th>
            <th>Hours</th>
            <th>Frequency</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {directories.map((dir, index) => (
            <tr key={index}>
              <td>{dir.path}</td>
              <td>{dir.days.join(', ')}</td>
              <td>{dir.hours}</td>
              <td>{dir.frequency}</td>
              <td>
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DirectoriesTable;