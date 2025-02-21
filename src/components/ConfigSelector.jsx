import React, { useState, useContext } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { exists, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import WatcherContext from '../context/WatcherContext.jsx';

function ConfigSelector() {
  const { setGlobalConfigPath, setLocalConfigPath } = useContext(ConfigContext);
  const [localPath, setLocalPath] = useState('');
  const [globalPath, setGlobalPath] = useState('');

  const { configPaths, setConfigPaths } = useContext(WatcherContext);
  const [error, setError] = useState('');

  const handleSelectFile = async (isGlobal) => {
      try {
          setError('');
          const selected = await selectConfigFile(isGlobal);
          
          if (selected) {
              setConfigPaths(prev => ({
                  ...prev,
                  [isGlobal ? 'globalConfigPath' : 'localConfigPath']: selected
              }));
          }
      } catch (error) {
          setError(error.toString());
      }
  };

  // const handleSelectFile = async (isGlobal) => {
  //   try {
  //     const selected = await open({
  //       multiple: false,
  //       filters: [{
  //         name: 'Configuration',
  //         extensions: ['json']
  //       }]
  //     });

  //     if (selected) {
  //       // Проверка дали файлът съществува
  //       const fileExists = await exists(selected);
        
  //       if (!fileExists) {
  //         // Създаване на празен конфигурационен файл
  //         await writeTextFile(selected, JSON.stringify({}, null, 2));
  //       }

  //       if (isGlobal) {
  //         setGlobalPath(selected);
  //         setGlobalConfigPath(selected);
  //       } else {
  //         setLocalPath(selected);
  //         setLocalConfigPath(selected);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Failed to select file:', error);
  //   }
  // };

  // Алтернативен подход с input type="file"
  const handleFileInput = async (event, isGlobal) => {
    const files = event.target.files;
    if (files && files[0]) {
      const filePath = files[0].path;
      if (isGlobal) {
        setGlobalPath(filePath);
        setGlobalConfigPath(filePath);
      } else {
        setLocalPath(filePath);
        setLocalConfigPath(filePath);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Select Configuration Files</h2>
      
      {/* Вариант 1: С бутони */}
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => handleSelectFile(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Select Global Config
          </button>
          <p className="text-sm text-gray-600">
            Global Config: {globalPath || 'Not selected'}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button 
            onClick={() => handleSelectFile(false)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Select Local Config
          </button>
          <p className="text-sm text-gray-600">
            Local Config: {localPath || 'Not selected'}
          </p>
        </div>
      </div>

      {/* Вариант 2: С input type="file" */}
      <div className="mt-8 space-y-4">
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-gray-700">
            Global Configuration File
          </label>
          <input
            type="file"
            accept=".json"
            onChange={(e) => handleFileInput(e, true)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-gray-700">
            Local Configuration File
          </label>
          <input
            type="file"
            accept=".json"
            onChange={(e) => handleFileInput(e, false)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
      </div>

      {/* Показване на текущите пътища */}
      <div className="mt-4 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Current Configuration</h3>
        <div className="text-sm text-gray-600">
          <p>Global: {globalPath || 'Not set'}</p>
          <p>Local: {localPath || 'Not set'}</p>
        </div>
      </div>
    </div>
  );
}

export default ConfigSelector;