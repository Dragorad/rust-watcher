import { invoke } from '@tauri-apps/api/core';

// Извличане на директориите от мрежов и локален конфигурационен файл
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

// Записване на мрежовите конфигурации
export async function saveNetworkConfig(configs, networkConfigPath) {
  try {
    await invoke('save_network_config', { configs, networkConfigPath });
    console.log('Network config saved successfully');
  } catch (error) {
    console.error('Failed to save network config:', error);
  }
}

// Записване на локалните конфигурации
export async function saveLocalConfig(configs, localConfigPath) {
  try {
    await invoke('save_local_config', { configs, localConfigPath });
    console.log('Local config saved successfully');
  } catch (error) {
    console.error('Failed to save local config:', error);
  }
}

// Добавяне на директория
export async function addDirectory(path, days, hours, frequency) {
  try {
    await invoke('add_directory', { path, days, hours, frequency });
  } catch (error) {
    console.error('Failed to add directory parameters:', error);
  }
}

// Получаване на директориите
export async function getDirectories() {
  try {
    return await invoke('get_directories');
  } catch (error) {
    console.error('Failed to fetch directories:', error);
    return [];
  }
}

// Актуализиране на директория
export async function updateDirectory(index, path, days, hours, frequency) {
  try {
    await invoke('update_directory', { index, path, days, hours, frequency });
  } catch (error) {
    console.error('Failed to update directory:', error);
  }
}

// Изтриване на директория
export async function deleteDirectory(index) {
  try {
    await invoke('delete_directory', { index });
  } catch (error) {
    console.error('Failed to delete directory:', error);
  }
}

// Старт на наблюдение
export async function startWatching() {
  try {
    await invoke('start_watching_command');
  } catch (error) {
    console.error('Failed to start watching directories:', error);
  }
}

// Уверява се, че конфигурационният файл съществува, като го създава, ако липсва
export async function ensureConfigFileExists(directoryPath, isGlobal) {
  const fileName = isGlobal ? "global_config.json" : "local_config.json";
  const filePath = `${directoryPath}/${fileName}`;

  try {
    await invoke('ensure_config_file_exists', { directory: directoryPath, is_global: isGlobal });
    return filePath; // Връща пълния път за използване в компонентите
  } catch (error) {
    console.error('Failed to ensure config file exists:', error);
    throw error;
  }
}