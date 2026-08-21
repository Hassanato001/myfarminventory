import Table from '../common/Table.jsx';
import Spinner from '../common/Spinner.jsx';
import { useUsers } from '../../hooks/useUsers.js';

function UserList({ refreshToken }) {
  const { users, loading } = useUsers(refreshToken);

  if (loading) {
    return (
      <div className="panel">
        <Spinner />
      </div>
    );
  }

  return (
    <Table
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' }
      ]}
      rows={users.map((user) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role
      }))}
    />
  );
}

export default UserList;
