import PagePlaceholder from '../components/common/PagePlaceholder.jsx';
import UserList from '../components/users/UserList.jsx';
import UserForm from '../components/users/UserForm.jsx';
import { useState } from 'react';

function Users() {
  const [refreshToken, setRefreshToken] = useState(0);
  return (
    <div className="page">
      <PagePlaceholder title="Users" description="Manage staff accounts and permissions." />
      <div className="card-grid">
        <UserList refreshToken={refreshToken} />
        <UserForm onCreated={() => setRefreshToken((value) => value + 1)} />
      </div>
    </div>
  );
}

export default Users;
