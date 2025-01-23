import { invoke } from '@tauri-apps/api/core';

export async function addDirectory(path, days, hours, frequency) {
  try {
    await invoke('add_directory', { path, days, hours, frequency });
    console.log('Directory parameters added');
  } catch (error) {
    console.error('Failed to add directory parameters:', error);
  }
}

export async function startWatching() {
  try {
    await invoke('start_watching_command');
    console.log('Started watching directories');
  } catch (error) {
    console.error('Failed to start watching directories:', error);
  }
}