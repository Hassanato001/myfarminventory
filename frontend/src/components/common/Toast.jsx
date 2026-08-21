import { useNotifications } from '../../hooks/useNotifications.js';

function Toast() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="toast-stack">
      {notifications.map((item) => (
        <div className="toast" key={item.id} onClick={() => removeNotification(item.id)} role="button" tabIndex={0}>
          {item.message}
        </div>
      ))}
    </div>
  );
}

export default Toast;
