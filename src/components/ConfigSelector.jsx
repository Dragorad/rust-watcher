import React, { useContext } from 'react';
import ConfigContext from '../context/ConfigContext.jsx'

function ConfigSelector() {
  const { setGlobalConfigPath, setLocalConfigPath } = useContext(ConfigContext);

  const handleConfigChange = (event, type) => {
    try {
      const filePath = event.target.files[0]?.path;
      if (!filePath) {
        throw new Error('No file selected');
      }

      if (type === 'global') {
        setGlobalConfigPath(filePath);
      } else {
        setLocalConfigPath(filePath);
      }
    } catch (error) {
      console.error('Error selecting config file:', error);
    }
  };

  return (
    <div>
      <h2>Select Configuration Files</h2>
      <div>
        <label>
          Global Config:
          <input type="file" onChange={(event) => handleConfigChange(event, 'global')} />
        </label>
      </div>
      <div>
        <label>
          Local Config:
          <input type="file" onChange={(event) => handleConfigChange(event, 'local')} />
        </label>
      </div>
    </div>
  );
}

export default ConfigSelector;