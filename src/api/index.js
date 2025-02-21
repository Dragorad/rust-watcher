import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { exists, writeTextFile, readTextFile } from '@tauri-apps/plugin-fs';

// Съществуващи функции
export async function loadNetworkAndLocalConfigs(networkConfigPath, localConfigPath) {
  try {
    const [networkConfigs, localConfigs] = await invoke('load_network_and_local_configs', {
      networkConfigPath,
      localConfigPath,
    });
    return { networkConfigs, localConfigs };
  } catch (error) {
    console.error('Failed to load network and local configs:', error);
    return { networkConfigs: [], localConfigs: [] };
  }
}

export async function saveNetworkConfig(configs, networkConfigPath) {
  try {
    await invoke('save_network_config', { configs, networkConfigPath });
    console.log('Network config saved successfully');
  } catch (error) {
    console.error('Failed to save network config:', error);
  }
}

export async function saveLocalConfig(configs, localConfigPath) {
  try {
    await invoke('save_local_config', { configs, localConfigPath });
    console.log('Local config saved successfully');
  } catch (error) {
    console.error('Failed to save local config:', error);
  }
}

export async function addDirectory(path, days, hours, frequency) {
  try {
    await invoke('add_directory', { path, days, hours, frequency });
  } catch (error) {
    console.error('Failed to add directory parameters:', error);
  }
}

export async function getDirectories() {
  try {
    return await invoke('get_directories');
  } catch (error) {
    console.error('Failed to fetch directories:', error);
    return [];
  }
}

export async function updateDirectory(index, path, days, hours, frequency) {
  try {
    await invoke('update_directory', { index, path, days, hours, frequency });
  } catch (error) {
    console.error('Failed to update directory:', error);
  }
}

export async function deleteDirectory(index) {
  try {
    await invoke('delete_directory', { index });
  } catch (error) {
    console.error('Failed to delete directory:', error);
  }
}

export async function startWatching() {
  try {
    await invoke('start_watching_command');
  } catch (error) {
    console.error('Failed to start watching directories:', error);
  }
}

export async function ensureConfigFileExists(directoryPath, isGlobal) {
  const fileName = isGlobal ? "global_config.json" : "local_config.json";
  const filePath = `${directoryPath}/${fileName}`;

  try {
    await invoke('ensure_config_file_exists', { directory: directoryPath, is_global: isGlobal });
    return filePath;
  } catch (error) {
    console.error('Failed to ensure config file exists:', error);
    throw error;
  }
}

export async function selectConfigFile(isGlobal) {
  try {
    const selected = await open({
      multiple: false,
      filters: [{
        name: 'Configuration',
        extensions: ['json']
      }]
    });

    if (selected) {
      // Извличаме директорията от избрания път
      const directory = selected.substring(0, selected.lastIndexOf('\\'));
      
      // Използваме съществуващата функция за създаване на конфигурационен файл
      const configPath = await ensureConfigFileExists(directory, isGlobal);

      // Проверяваме дали файлът е валиден
      const isValid = await checkConfigFile(configPath);
      if (!isValid) {
        throw new Error('Configuration file is not valid');
      }

      return configPath;
    }
    return null;
  } catch (error) {
    console.error('Failed to select or create config file:', error);
    throw error;
  }
}
export async function readConfigFile(path) {
  try {
    const content = await readTextFile(path);
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to read config file:', error);
    throw error;
  }
}

export async function writeConfigFile(path, data) {
  try {
    await writeTextFile(path, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to write config file:', error);
    throw error;
  }
}

export async function checkConfigFile(path) {
  try {
    const fileExists = await exists(path);
    if (fileExists) {
      const content = await readTextFile(path);
      try {
        JSON.parse(content);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  } catch (error) {
    console.error('Failed to check config file:', error);
    return false;
  }
}