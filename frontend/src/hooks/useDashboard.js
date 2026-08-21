import { useEffect, useState } from 'react';
import { useAuth } from './useAuth.js';
import dashboardService from '../services/dashboardService.js';

function useDashboard(refreshToken = 0) {
  const { accessToken } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      setData(null);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const response = await dashboardService.summary();
        if (!cancelled) {
          setData(response.data);
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
  }, [refreshToken, accessToken]);

  return { data, loading };
}

export { useDashboard };
