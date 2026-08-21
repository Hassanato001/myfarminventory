import { createContext, useContext, useMemo, useState } from 'react';

const NotificationContext = createContext(null);

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  function pushNotification(message, type = 'info') {
    const id = crypto.randomUUID();
    setNotifications((current) => [...current, { id, message, type }]);
    window.setTimeout(() => {
      setNotifications((current) => current.filter((item) => item.id !== id));
    }, 3000);
  }

  function removeNotification(id) {
    setNotifications((current) => current.filter((item) => item.id !== id));
  }

  const value = useMemo(
    () => ({
      notifications,
      pushNotification,
      removeNotification
    }),
    [notifications]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
}

export { NotificationProvider, useNotificationContext };
