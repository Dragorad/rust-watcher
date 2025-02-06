import React, { useState } from 'react';

function ConfigSelector() {
  const [globalConfigPath, setGlobalConfigPath] = useState('');
  const [localConfigPath, setLocalConfigPath] = useState('');

  const handleGlobalConfigChange = (event) => {
    setGlobalConfigPath(event.target.files[0].path);
  };

  const handleLocalConfigChange = (event) => {
    console.log(event.target);
    setLocalConfigPath(event.target.files[0].path);
  };

  return (
    <div>
      <h2>Select Configuration Files</h2>
      <div>
        <label>
          Global Config:
          <input type="file" onChange={handleGlobalConfigChange} />
        </label>
      </div>
      <div>
        <label>
          Local Config:
          <input type="file" onChange={handleLocalConfigChange} />
        </label>
      </div>
      <div>
        <p>Global Config Path: {globalConfigPath}</p>
        <p>Local Config Path: {localConfigPath}</p>
      </div>
    </div>
  );
}

export default ConfigSelector;