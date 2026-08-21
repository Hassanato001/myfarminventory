import { useEffect, useState } from 'react';
import productService from '../services/productService.js';

function useProducts(refreshToken = 0, params = '') {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const response = await productService.list(params);
        if (!cancelled) {
          setProducts(response.data?.data || []);
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
  }, [params, refreshToken]);

  return { products, loading };
}

export { useProducts };
