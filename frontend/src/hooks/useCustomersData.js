import { useEffect, useState } from 'react';
import customerService from '../services/customerService.js';

function useCustomersData(refreshToken = 0) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const response = await customerService.list();
        if (!cancelled) {
          setCustomers(response.data?.data || []);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [refreshToken]);

  return { customers, loading };
}

export { useCustomersData };
