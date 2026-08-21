import { useNotifications } from '../../hooks/useNotifications.js';

function NotificationBell() {
  const { notifications } = useNotifications();

  return (
    <div className="panel" style={{ padding: '10px 14px' }}>
      Notifications: {notifications.length}
    </div>
  );
}

export default NotificationBell;
