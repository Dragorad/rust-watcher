// src/reducers/watcherReducer.js
export const SET_CONFIG_PATHS = 'SET_CONFIG_PATHS';
export const SET_ACTIVE_WATCHERS = 'SET_ACTIVE_WATCHERS';
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS';
export const SET_IS_WATCHING = 'SET_IS_WATCHING';
export const SET_DIRECTORIES = 'SET_DIRECTORIES';

export const initialState = {
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

export function watcherReducer(state, action) {
  switch (action.type) {
    case SET_CONFIG_PATHS:
      return { 
        ...state, 
        configPaths: action.payload 
      };
    case SET_ACTIVE_WATCHERS:
      return { 
        ...state, 
        activeWatchers: action.payload 
      };
    case ADD_NOTIFICATION:
      return { 
        ...state, 
        notifications: [...state.notifications, {
          ...action.payload,
          id: Date.now()
        }]
      };
    case CLEAR_NOTIFICATIONS:
      return { 
        ...state, 
        notifications: [] 
      };
    case SET_IS_WATCHING:
      return { 
        ...state, 
        isWatching: action.payload 
      };
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