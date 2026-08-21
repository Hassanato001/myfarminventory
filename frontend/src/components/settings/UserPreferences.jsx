import { useState } from 'react';
import Button from '../common/Button.jsx';

function UserPreferences({ value, onChange, onSave }) {
  const [message, setMessage] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    await onSave();
    setMessage('Preferences saved');
    window.setTimeout(() => setMessage(''), 1500);
  };

  return (
    <div className="panel">
      <form onSubmit={submit} className="page">
        <h3>User Preferences</h3>
        <label className="field">
          <span>Theme</span>
          <select value={value.theme} onChange={(e) => onChange({ ...value, theme: e.target.value })}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <label className="field">
          <span>Currency</span>
          <select value={value.currency} onChange={(e) => onChange({ ...value, currency: e.target.value })}>
            <option value="USD">USD</option>
            <option value="NGN">NGN</option>
            <option value="GBP">GBP</option>
          </select>
        </label>
        <label className="field">
          <span>Language</span>
          <select value={value.language} onChange={(e) => onChange({ ...value, language: e.target.value })}>
            <option value="en">English</option>
            <option value="fr">French</option>
          </select>
        </label>
        {message ? <div className="muted">{message}</div> : null}
        <Button type="submit">Save Preferences</Button>
      </form>
    </div>
  );
}

export default UserPreferences;
