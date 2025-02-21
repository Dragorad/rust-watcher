// components/NotificationList.jsx
import React, { useContext } from 'react';
import WatcherContext from '../context/WatcherContext';

function NotificationList() {
    const { notifications, clearNotifications } = useContext(WatcherContext);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Notifications</h2>
                <button 
                    onClick={clearNotifications}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                >
                    Clear
                </button>
            </div>
            <div className="space-y-2">
                {notifications.map(notification => (
                    <div 
                        key={notification.id} 
                        className="p-2 bg-blue-50 rounded"
                    >
                        <p>File: {notification.fileName}</p>
                        <p>Directory: {notification.directory}</p>
                        <p className="text-sm text-gray-500">
                            {new Date(notification.timestamp).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}