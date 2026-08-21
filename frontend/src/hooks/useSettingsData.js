import { useEffect, useState } from 'react';
import settingsService from '../services/settingsService.js';

function useSettingsData() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const response = await settingsService.get();
      setSettings(response.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { settings, loading, reload: load, setSettings };
}

export { useSettingsData };
