// src/context/WatcherContext.jsx
import React, { createContext, useReducer, useEffect } from 'react';
import { 
  watcherReducer, 
  initialState,
  SET_CONFIG_PATHS,
  SET_ACTIVE_WATCHERS,
  ADD_NOTIFICATION,
  CLEAR_NOTIFICATIONS,
  SET_IS_WATCHING,
  SET_DIRECTORIES
} from './reducers/watcherReducer';
import { 
  loadAppConfig, 
  saveAppConfig,
  loadNetworkAndLocalConfigs,
  saveNetworkConfig,
  saveLocalConfig,
  startWatching 
} from '../api';

export const WatcherContext = createContext(initialState);

export function WatcherProvider({ children }) {
  const [state, dispatch] = useReducer(watcherReducer, initialState);

  useEffect(() => {
    const initializeConfig = async () => {
      try {
        const config = await loadAppConfig();
        dispatch({ 
          type: SET_CONFIG_PATHS, 
          payload: {
            globalConfigPath: config.global_config_path,
            localConfigPath: config.local_config_path
          }
        });

        // Зареждане на директориите след като имаме пътищата
        if (config.global_config_path || config.local_config_path) {
          const { networkConfigs, localConfigs } = await loadNetworkAndLocalConfigs(
            config.global_config_path,
            config.local_config_path
          );
          dispatch({
            type: SET_DIRECTORIES,
            payload: {
              global: networkConfigs,
              local: localConfigs
            }
          });
        }
      } catch (error) {
        console.error('Грешка при инициализация на конфигурацията:', error);
      }
    };

    initializeConfig();
  }, []);

  const setConfigPaths = async (paths) => {
    try {
      await saveAppConfig({
        global_config_path: paths.globalConfigPath,
        local_config_path: paths.localConfigPath,
        last_update: new Date().toISOString()
      });
      
      dispatch({ type: SET_CONFIG_PATHS, payload: paths });
    } catch (error) {
      console.error('Грешка при запазване на конфигурационните пътища:', error);
    }
  };

  const setActiveWatchers = (watchers) => {
    dispatch({ type: SET_ACTIVE_WATCHERS, payload: watchers });
  };

  const addNotification = (notification) => {
    dispatch({ type: ADD_NOTIFICATION, payload: notification });
  };

  const clearNotifications = () => {
    dispatch({ type: CLEAR_NOTIFICATIONS });
  };

  const setIsWatching = async (isWatching) => {
    try {
      if (isWatching) {
        await startWatching();
      }
      dispatch({ type: SET_IS_WATCHING, payload: isWatching });
    } catch (error) {
      console.error('Грешка при промяна на състоянието на наблюдение:', error);
    }
  };

  const setDirectories = async (global, local) => {
    try {
      if (state.configPaths.globalConfigPath) {
        await saveNetworkConfig(global, state.configPaths.globalConfigPath);
      }
      if (state.configPaths.localConfigPath) {
        await saveLocalConfig(local, state.configPaths.localConfigPath);
      }
      dispatch({ 
        type: SET_DIRECTORIES, 
        payload: { global, local } 
      });
    } catch (error) {
      console.error('Грешка при запазване на директориите:', error);
    }
  };

  const contextValue = {
    ...state,
    setConfigPaths,
    setActiveWatchers,
    addNotification,
    clearNotifications,
    setIsWatching,
    setDirectories
  };

  return (
    <WatcherContext.Provider value={contextValue}>
      {children}
    </WatcherContext.Provider>
  );
}

export default WatcherContext;