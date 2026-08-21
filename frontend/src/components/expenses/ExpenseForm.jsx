import { useState } from 'react';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import expenseService from '../../services/expenseService.js';

function ExpenseForm({ onCreated }) {
  const [form, setForm] = useState({
    title: '',
    category: 'General',
    amount: '',
    note: '',
    paymentMethod: 'CASH'
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      await expenseService.create(form);
      setMessage('Expense recorded');
      setForm({ title: '', category: 'General', amount: '', note: '', paymentMethod: 'CASH' });
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
        <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <Input label="Amount" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        <Input label="Note" multiline value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        <label className="field">
          <span>Payment method</span>
          <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
            <option value="CASH">CASH</option>
            <option value="CARD">CARD</option>
            <option value="MOBILE">MOBILE</option>
          </select>
        </label>
        {message ? <div className="muted">{message}</div> : null}
        {error ? <div className="muted">{error}</div> : null}
        <Button type="submit">Record Expense</Button>
      </form>
    </div>
  );
}

export default ExpenseForm;
