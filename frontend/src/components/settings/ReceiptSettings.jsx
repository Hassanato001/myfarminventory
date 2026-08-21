import { useState } from 'react';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';

function ReceiptSettings({ value, onChange, onSave }) {
  const [message, setMessage] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    await onSave();
    setMessage('Receipt settings saved');
    window.setTimeout(() => setMessage(''), 1500);
  };

  return (
    <div className="panel">
      <form onSubmit={submit} className="page">
        <h3>Receipt Settings</h3>
        <Input label="Footer text" value={value.footerText} onChange={(e) => onChange({ ...value, footerText: e.target.value })} />
        <label className="field">
          <span>Show logo</span>
          <select value={String(value.showLogo)} onChange={(e) => onChange({ ...value, showLogo: e.target.value === 'true' })}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </label>
        <label className="field">
          <span>Show tax</span>
          <select value={String(value.showTax)} onChange={(e) => onChange({ ...value, showTax: e.target.value === 'true' })}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </label>
        {message ? <div className="muted">{message}</div> : null}
        <Button type="submit">Save Receipt</Button>
      </form>
    </div>
  );
}

export default ReceiptSettings;
