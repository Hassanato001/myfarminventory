import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Button from './Button.jsx';
import Toast from './Toast.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { APP_NAME } from '../../utils/constants.js';
import NotificationBell from '../notifications/NotificationBell.jsx';

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>{APP_NAME}</h1>
        <p className="muted">Signed in as {user?.firstName || 'User'}</p>
        <nav>
          <ul className="nav-list">
            {[
              ['/dashboard', 'Dashboard'],
              ['/products', 'Products'],
              ['/pos', 'POS'],
              ['/purchases', 'Purchases'],
              ['/customers', 'Customers'],
              ['/expenses', 'Expenses'],
              ['/reports', 'Reports'],
              ['/settings', 'Settings'],
              ['/users', 'Users'],
              ['/audit', 'Audit Log']
            ].map(([to, label]) => (
              <li key={to}>
                <NavLink to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`.trim()}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <div className="topbar">
          <div>
            <strong>Farm Shop Inventory</strong>
            <div className="muted">Welcome to User</div>
          </div>
          <div className="row">
            <NotificationBell />
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
        <Outlet />
      </main>
      <Toast />
    </div>
  );
}

export default Layout;
