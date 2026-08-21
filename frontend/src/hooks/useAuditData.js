import { useEffect, useState } from 'react';
import { request } from '../services/api.js';

function useAuditData(refreshToken = 0, search = '') {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const response = await request(`/audit${search ? `?search=${encodeURIComponent(search)}` : ''}`);
        if (!cancelled) {
          setLogs(response.data?.data || []);
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
  }, [refreshToken, search]);

  return { logs, loading };
}

export { useAuditData };
