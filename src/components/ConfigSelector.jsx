import React, { useState, useContext, useEffect } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { exists, writeTextFile } from '@tauri-apps/plugin-fs';
import { WatcherContext } from '../context/WatcherContext';
import { ensureConfigFileExists } from '../api';

function ConfigSelector() {
  // Локално състояние
  const [localPath, setLocalPath] = useState('');
  const [globalPath, setGlobalPath] = useState('');
  const [error, setError] = useState('');

  // Контекст
  const { configPaths, setConfigPaths } = useContext(WatcherContext);

  // При първоначално зареждане проверяваме за съществуващи конфигурации
  useEffect(() => {
    const initializeConfigs = async () => {
      try {
        // Опит за създаване/достъп до конфигурационните файлове в default директорията
        const globalConfigPath = await ensureConfigFileExists('config', true);
        const localConfigPath = await ensureConfigFileExists('config', false);

        // Обновяване на локалното състояние
        setGlobalPath(globalConfigPath);
        setLocalPath(localConfigPath);

        // Обновяване на контекста
        setConfigPaths({
          globalConfigPath,
          localConfigPath
        });
      } catch (error) {
        setError('Failed to initialize configuration files');
        console.error(error);
      }
    };

    initializeConfigs();
  }, []);

  // Функция за промяна на конфигурационен файл
  const handleChangeConfig = async (isGlobal) => {
    try {
      setError('');
      const selected = await open({
        multiple: false,
        filters: [{
          name: 'Configuration',
          extensions: ['json']
        }]
      });

      if (selected) {
        // Проверка дали файлът съществува
        const fileExists = await exists(selected);
        
        if (!fileExists) {
          // Създаване на празен конфигурационен файл
          const defaultConfig = {
            directories: [],
            settings: {
              isGlobal
            }
          };
          await writeTextFile(selected, JSON.stringify(defaultConfig, null, 2));
        }

        // Обновяване на локалното състояние
        if (isGlobal) {
          setGlobalPath(selected);
        } else {
          setLocalPath(selected);
        }

        // Обновяване на контекста
        setConfigPaths(prev => ({
          ...prev,
          [isGlobal ? 'globalConfigPath' : 'localConfigPath']: selected
        }));
      }
    } catch (error) {
      setError(error.toString());
      console.error('Failed to change config file:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Configuration Files</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Global Configuration</span>
            <button 
              onClick={() => handleChangeConfig(true)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Change Location
            </button>
          </div>
          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            {globalPath || 'Initializing...'}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Local Configuration</span>
            <button 
              onClick={() => handleChangeConfig(false)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Change Location
            </button>
          </div>
          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            {localPath || 'Initializing...'}
          </p>
        </div>
      </div>

      {/* Статус на конфигурацията */}
      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Configuration Status</h3>
        <div className="text-sm">
          <div className="flex items-center">
            <span className={`w-2 h-2 rounded-full mr-2 ${globalPath ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span>Global Configuration: {globalPath ? 'Ready' : 'Not Set'}</span>
          </div>
          <div className="flex items-center mt-2">
            <span className={`w-2 h-2 rounded-full mr-2 ${localPath ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span>Local Configuration: {localPath ? 'Ready' : 'Not Set'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfigSelector;