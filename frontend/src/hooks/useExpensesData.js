import { useEffect, useState } from 'react';
import expenseService from '../services/expenseService.js';

function useExpensesData(refreshToken = 0) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const response = await expenseService.list();
        if (!cancelled) {
          setExpenses(response.data?.data || []);
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

  return { expenses, loading };
}

export { useExpensesData };
