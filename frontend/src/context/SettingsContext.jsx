import { createContext, useContext, useMemo, useState } from 'react';

const SettingsContext = createContext(null);

function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    businessName: 'Farm Shop Inventory',
    currency: 'USD',
    theme: 'light'
  });

  const value = useMemo(() => ({ settings, setSettings }), [settings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within SettingsProvider');
  }
  return context;
}

export { SettingsProvider, useSettingsContext };
