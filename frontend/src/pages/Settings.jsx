import PagePlaceholder from '../components/common/PagePlaceholder.jsx';
import BusinessProfile from '../components/settings/BusinessProfile.jsx';
import ReceiptSettings from '../components/settings/ReceiptSettings.jsx';
import UserPreferences from '../components/settings/UserPreferences.jsx';
import { useEffect, useState } from 'react';
import { useSettingsData } from '../hooks/useSettingsData.js';
import settingsService from '../services/settingsService.js';

function Settings() {
  const { settings, setSettings } = useSettingsData();
  const [message, setMessage] = useState('');

  const current = settings || {
    businessProfile: { businessName: '', phone: '', email: '', address: '' },
    receiptSettings: { footerText: '', showLogo: true, showTax: true },
    userPreferences: { theme: 'light', currency: 'USD', language: 'en' }
  };

  useEffect(() => {
    if (!settings) {
      setSettings(current);
    }
  }, [settings]);

  const save = async () => {
    const response = await settingsService.update(current);
    setSettings(response.data);
    setMessage('Settings updated');
    window.setTimeout(() => setMessage(''), 1500);
  };

  return (
    <div className="page">
      <PagePlaceholder title="Settings" description="Configure business, receipt, and preference settings." />
      {message ? <div className="panel">{message}</div> : null}
      <div className="card-grid">
        <BusinessProfile
          value={current.businessProfile}
          onChange={(businessProfile) => setSettings({ ...current, businessProfile })}
          onSave={save}
        />
        <ReceiptSettings
          value={current.receiptSettings}
          onChange={(receiptSettings) => setSettings({ ...current, receiptSettings })}
          onSave={save}
        />
        <UserPreferences
          value={current.userPreferences}
          onChange={(userPreferences) => setSettings({ ...current, userPreferences })}
          onSave={save}
        />
      </div>
    </div>
  );
}

export default Settings;
