import React, { useState, useContext } from 'react';
import { ensureConfigFileExists } from '../api'; // Импортиране на API функцията
import ConfigContext from '../context/ConfigContext.jsx';

function ConfigSelector() {
  const { setGlobalConfigPath, setLocalConfigPath } = useContext(ConfigContext);
  const [localPath, setLocalPath] = useState('');
  const [globalPath, setGlobalPath] = useState('');

  const handleFileChange = (event, isGlobal) => {
    const filePath = event.target.files[0]?.path;
    if (isGlobal) {
      setGlobalPath(filePath || '');
    } else {
      setLocalPath(filePath || '');
    }
  };

  const handleConfirm = async (isGlobal) => {
    const directoryPath = isGlobal ? globalPath : localPath;
    if (directoryPath) {
      try {
        const filePath = await ensureConfigFileExists(directoryPath, isGlobal);
        if (isGlobal) {
          setGlobalConfigPath(filePath);
        } else {
          setLocalConfigPath(filePath);
        }
      } catch (error) {
        console.error('Failed to ensure config file exists:', error);
      }
    }
  };

  return (
    <div>
      <h2>Select Configuration Files</h2>
      <div>
        <label>
          Global Config:
          <input type="file" onChange={(event) => handleFileChange(event, true)} />
        </label>
        <button onClick={() => handleConfirm(true)}>Confirm Global</button>
      </div>
      <div>
        <label>
          Local Config:
          <input type="file" onChange={(event) => handleFileChange(event, false)} />
        </label>
        <button onClick={() => handleConfirm(false)}>Confirm Local</button>
      </div>
    </div>
  );
}

export default ConfigSelector;