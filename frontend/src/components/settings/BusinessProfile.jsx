import { useState } from 'react';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';

function BusinessProfile({ value, onChange, onSave }) {
  const [message, setMessage] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    await onSave();
    setMessage('Business profile saved');
    window.setTimeout(() => setMessage(''), 1500);
  };

  return (
    <div className="panel">
      <form onSubmit={submit} className="page">
        <h3>Business Profile</h3>
        <Input label="Business name" value={value.businessName} onChange={(e) => onChange({ ...value, businessName: e.target.value })} />
        <Input label="Phone" value={value.phone} onChange={(e) => onChange({ ...value, phone: e.target.value })} />
        <Input label="Email" value={value.email} onChange={(e) => onChange({ ...value, email: e.target.value })} />
        <Input label="Address" multiline value={value.address} onChange={(e) => onChange({ ...value, address: e.target.value })} />
        {message ? <div className="muted">{message}</div> : null}
        <Button type="submit">Save Profile</Button>
      </form>
    </div>
  );
}

export default BusinessProfile;
