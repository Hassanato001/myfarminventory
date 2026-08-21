import { useState } from 'react';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';

function UserForm({ onCreated }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'STAFF'
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await register(form);
      setMessage('User created');
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        role: 'STAFF'
      });
      if (onCreated) {
        onCreated();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="panel">
      <form onSubmit={submit} className="page">
        <Input label="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        <Input label="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <label className="field">
          <span>Role</span>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="STAFF">STAFF</option>
            <option value="MANAGER">MANAGER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </label>
        {message ? <div className="muted">{message}</div> : null}
        {error ? <div className="muted">{error}</div> : null}
        <Button type="submit">Create User</Button>
      </form>
    </div>
  );
}

export default UserForm;
