import { useState } from 'react';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import customerService from '../../services/customerService.js';

function CustomerForm({ onCreated }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      await customerService.create(form);
      setMessage('Customer created');
      setForm({ name: '', phone: '', email: '', address: '', notes: '' });
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
        <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <Input label="Notes" multiline value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        {message ? <div className="muted">{message}</div> : null}
        {error ? <div className="muted">{error}</div> : null}
        <Button type="submit">Create Customer</Button>
      </form>
    </div>
  );
}

export default CustomerForm;
