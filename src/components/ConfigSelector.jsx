import React, { useState, useContext } from 'react';
import { open } from '@tauri-apps/plugin-dialog'; // Импортиране на правилния модул
import { ensureConfigFileExists } from '../api'; // Импортиране на API функцията
import ConfigContext from '../context/ConfigContext.jsx';

function ConfigSelector() {
  const { setGlobalConfigPath, setLocalConfigPath } = useContext(ConfigContext);
  const [localPath, setLocalPath] = useState('');
  const [globalPath, setGlobalPath] = useState('');

  const handleSelectDirectory = async (isGlobal) => {
    try {
      const directoryPath = await open({ directory: true });
      if (directoryPath) {
        const fileName = isGlobal ? "global_config.json" : "local_config.json";
        const filePath = await ensureConfigFileExists(directoryPath, isGlobal);
        if (isGlobal) {
          setGlobalConfigPath(filePath);
        } else {
          setLocalPath(filePath);
        }
      }
    } catch (error) {
      console.error('Failed to ensure config file exists:', error);
    }
  };

  return (
    <div>
      <h2>Select Configuration Files</h2>
      <div>
        <button onClick={() => handleSelectDirectory(true)}>Select Global Directory</button>
        <p>Global Config Path: {globalPath}</p>
      </div>
      <div>
        <button onClick={() => handleSelectDirectory(false)}>Select Local Directory</button>
        <p>Local Config Path: {localPath}</p>
      </div>
    </div>
  );
}

export default ConfigSelector;