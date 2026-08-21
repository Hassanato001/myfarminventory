import { useEffect, useState } from 'react';
import purchaseService from '../services/purchaseService.js';

function usePurchasesData(refreshToken = 0) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const response = await purchaseService.list();
        if (!cancelled) {
          setPurchases(response.data?.data || []);
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

  return { purchases, loading };
}

export { usePurchasesData };
