// context/WatcherContext.jsx
import React, { createContext, useReducer } from 'react';
import { 
  loadNetworkAndLocalConfigs,
  saveNetworkConfig,
  saveLocalConfig,
  addDirectory,
  updateDirectory,
  deleteDirectory,
  startWatching 
} from '../api';

// Action Types
const SET_CONFIG_PATHS = 'SET_CONFIG_PATHS';
const SET_ACTIVE_WATCHERS = 'SET_ACTIVE_WATCHERS';
const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS';
const SET_IS_WATCHING = 'SET_IS_WATCHING';
const SET_DIRECTORIES = 'SET_DIRECTORIES';

const initialState = {
  configPaths: {
    globalConfigPath: '',
    localConfigPath: ''
  },
  activeWatchers: [],
  notifications: [],
  isWatching: false,
  globalDirectories: [],
  localDirectories: []
};

function watcherReducer(state, action) {
  switch (action.type) {
    case SET_CONFIG_PATHS:
      return { ...state, configPaths: action.payload };
    case SET_ACTIVE_WATCHERS:
      return { ...state, activeWatchers: action.payload };
    case ADD_NOTIFICATION:
      return { 
        ...state, 
        notifications: [...state.notifications, {
          ...action.payload,
          id: Date.now()
        }]
      };
    case CLEAR_NOTIFICATIONS:
      return { ...state, notifications: [] };
    case SET_IS_WATCHING:
      return { ...state, isWatching: action.payload };
    case SET_DIRECTORIES:
      return {
        ...state,
        globalDirectories: action.payload.global,
        localDirectories: action.payload.local
      };
    default:
      return state;
  }
}

export const WatcherContext = createContext(initialState);

export function WatcherProvider({ children }) {
  const [state, dispatch] = useReducer(watcherReducer, initialState);

  // Действия за работа с конфигурацията
  const setConfigPaths = async (paths) => {
    dispatch({ type: SET_CONFIG_PATHS, payload: paths });
  };

  const loadDirectories = async () => {
    if (state.configPaths.globalConfigPath || state.configPaths.localConfigPath) {
      try {
        const { networkConfigs, localConfigs } = await loadNetworkAndLocalConfigs(
          state.configPaths.globalConfigPath,
          state.configPaths.localConfigPath
        );
        dispatch({ 
          type: SET_DIRECTORIES, 
          payload: { 
            global: networkConfigs, 
            local: localConfigs 
          } 
        });
      } catch (error) {
        console.error('Failed to load directories:', error);
      }
    }
  };

  const addNewDirectory = async (directory, isGlobal) => {
    try {
      await addDirectory(directory);
      const configPath = isGlobal ? 
        state.configPaths.globalConfigPath : 
        state.configPaths.localConfigPath;
      
      if (isGlobal) {
        await saveNetworkConfig([...state.globalDirectories, directory], configPath);
      } else {
        await saveLocalConfig([...state.localDirectories, directory], configPath);
      }
      await loadDirectories(); // Презареждане на директориите
    } catch (error) {
      console.error('Failed to add directory:', error);
    }
  };

  const updateExistingDirectory = async (index, directory, isGlobal) => {
    try {
      await updateDirectory(index, directory);
      const configPath = isGlobal ? 
        state.configPaths.globalConfigPath : 
        state.configPaths.localConfigPath;
      
      const directories = isGlobal ? 
        state.globalDirectories.map((dir, i) => i === index ? directory : dir) :
        state.localDirectories.map((dir, i) => i === index ? directory : dir);

      if (isGlobal) {
        await saveNetworkConfig(directories, configPath);
      } else {
        await saveLocalConfig(directories, configPath);
      }
      await loadDirectories(); // Презареждане на директориите
    } catch (error) {
      console.error('Failed to update directory:', error);
    }
  };

  const contextValue = {
    ...state,
    setConfigPaths,
    loadDirectories,
    addNewDirectory,
    updateExistingDirectory,
    startWatching: async () => {
      try {
        await startWatching();
        dispatch({ type: SET_IS_WATCHING, payload: true });
      } catch (error) {
        console.error('Failed to start watching:', error);
      }
    },
    stopWatching: () => {
      dispatch({ type: SET_IS_WATCHING, payload: false });
    },
    addNotification: (notification) => {
      dispatch({ type: ADD_NOTIFICATION, payload: notification });
    },
    clearNotifications: () => {
      dispatch({ type: CLEAR_NOTIFICATIONS });
    }
  };

  return (
    <WatcherContext.Provider value={contextValue}>
      {children}
    </WatcherContext.Provider>
  );
}

export default WatcherContext;