import { useNotificationContext } from '../context/NotificationContext.jsx';

function useNotifications() {
  return useNotificationContext();
}

export { useNotifications };
