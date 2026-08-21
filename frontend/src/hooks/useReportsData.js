import { useEffect, useState } from 'react';
import reportService from '../services/reportService.js';

function useReportsData(refreshToken = 0) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const response = await reportService.summary();
        if (!cancelled) {
          setSummary(response.data);
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

  return { summary, loading };
}

export { useReportsData };
