import { useEffect, useState } from 'react';
import { request } from '../services/api.js';

function useUsers(refreshToken = 0) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const response = await request('/users');
        if (!cancelled) {
          setUsers(response.data?.data || []);
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

  return { users, loading };
}

export { useUsers };
