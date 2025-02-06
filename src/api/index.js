import { invoke } from '@tauri-apps/api/core';

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