import  { createContext, useReducer } from 'react';
import { getDirectories, addDirectory, updateDirectory, deleteDirectory } from '../api';

// Action Types
export const SET_GLOBAL_CONFIG_PATH = 'SET_GLOBAL_CONFIG_PATH';
export const SET_LOCAL_CONFIG_PATH = 'SET_LOCAL_CONFIG_PATH';
export const SET_GLOBAL_DIRECTORIES = 'SET_GLOBAL_DIRECTORIES';
export const SET_LOCAL_DIRECTORIES = 'SET_LOCAL_DIRECTORIES';

// Action Creators
export const setGlobalConfigPath = (path) => ({
  type: SET_GLOBAL_CONFIG_PATH,
  payload: path
});

export const setLocalConfigPath = (path) => ({
  type: SET_LOCAL_CONFIG_PATH,
  payload: path
});

export const setGlobalDirectories = (directories) => ({
  type: SET_GLOBAL_DIRECTORIES,
  payload: directories
});

export const setLocalDirectories = (directories) => ({
  type: SET_LOCAL_DIRECTORIES,
  payload: directories
});

const initialState = {
  globalConfigPath: '',
  localConfigPath: '',
  globalDirectories: [],
  localDirectories: [],
};

const ConfigContext = createContext(initialState);

const configReducer = (state, action) => {
  switch (action.type) {
    case SET_GLOBAL_CONFIG_PATH:
      return { ...state, globalConfigPath: action.payload };
    case SET_LOCAL_CONFIG_PATH:
      return { ...state, localConfigPath: action.payload };
    case SET_GLOBAL_DIRECTORIES:
      return { ...state, globalDirectories: action.payload };
    case SET_LOCAL_DIRECTORIES:
      return { ...state, localDirectories: action.payload };
    default:
      return state;
  }
};

export const ConfigProvider = ({ children }) => {
  const [state, dispatch] = useReducer(configReducer, initialState);

  const loadDirectories = async (configPath) => {
    if (!configPath) {
      console.warn('No config path provided to loadDirectories');
      return;
    }

    try {
      const directories = await getDirectories(configPath);
      
      if (configPath === state.globalConfigPath) {
        dispatch(setGlobalDirectories(directories || []));
      } else if (configPath === state.localConfigPath) {
        dispatch(setLocalDirectories(directories || []));
      } else {
        console.warn('Config path does not match either global or local path');
      }
    } catch (error) {
      console.error('Failed to load directories:', error);
      // Set empty array in case of error to maintain consistent state
      if (configPath === state.globalConfigPath) {
        dispatch(setGlobalDirectories([]));
      } else if (configPath === state.localConfigPath) {
        dispatch(setLocalDirectories([]));
      }
    }
  };

const loadAllDirectories = async () => {
  let errors = [];

  if (state.globalConfigPath) {
    try {
      await loadDirectories(state.globalConfigPath);
    } catch (error) {
      console.error('Failed to load global directories:', error);
      errors.push({
        type: 'global',
        path: state.globalConfigPath,
        error: error.message
      });
      // Reset global directories to empty array on error
      dispatch(setGlobalDirectories([]));
    }
  }

  if (state.localConfigPath) {
    try {
      await loadDirectories(state.localConfigPath);
    } catch (error) {
      console.error('Failed to load local directories:', error);
      errors.push({
        type: 'local',
        path: state.localConfigPath,
        error: error.message
      });
      // Reset local directories to empty array on error
      dispatch(setLocalDirectories([]));
    }
  }

  if (!state.globalConfigPath && !state.localConfigPath) {
    console.warn('No config paths set. Nothing to load.');
  }

  // Return information about any errors that occurred
  return {
    success: errors.length === 0,
    errors: errors.length > 0 ? errors : null
  };
};


  const addNewDirectory = async (directory, configPath) => {
    if (!configPath) {
      console.error('No config path provided for adding directory');
      return;
    }

    try {
      await addDirectory(directory, configPath);
      await loadDirectories(configPath);
    } catch (error) {
      console.error('Failed to add directory:', error);
    }
  };

  const updateExistingDirectory = async (index, directory, configPath) => {
    if (!configPath) {
      console.error('No config path provided for updating directory');
      return;
    }

    try {
      await updateDirectory(index, directory, configPath);
      await loadDirectories(configPath);
    } catch (error) {
      console.error('Failed to update directory:', error);
    }
  };

  const removeDirectory = async (index, configPath) => {
    if (!configPath) {
      console.error('No config path provided for removing directory');
      return;
    }

    try {
      await deleteDirectory(index, configPath);
      await loadDirectories(configPath);
    } catch (error) {
      console.error('Failed to delete directory:', error);
    }
  };

 const setGlobalPath = async (path) => {
   try {
     dispatch(setGlobalConfigPath(path));
     if (path) {  // Only attempt to load if path exists
       await loadDirectories(path);
     }
   } catch (error) {
     console.error('Failed to set and load global path:', error);
     // Optionally reset the path if loading fails
     dispatch(setGlobalConfigPath(''));
     dispatch(setGlobalDirectories([]));
   }
 };
 
 const setLocalPath = async (path) => {
   try {
     dispatch(setLocalConfigPath(path));
     if (path) {  // Only attempt to load if path exists
       await loadDirectories(path);
     }
   } catch (error) {
     console.error('Failed to set and load local path:', error);
     // Optionally reset the path if loading fails
     dispatch(setLocalConfigPath(''));
     dispatch(setLocalDirectories([]));
   }
 };
 
  const contextValue = {
    // State
    globalConfigPath: state.globalConfigPath,
    localConfigPath: state.localConfigPath,
    globalDirectories: state.globalDirectories,
    localDirectories: state.localDirectories,
    
    // Actions
    dispatch,
    setGlobalPath,
    setLocalPath,
    
    // Operations
    loadDirectories,
    loadAllDirectories,
    addNewDirectory,
    updateExistingDirectory,
    removeDirectory,
  };

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigContext;
