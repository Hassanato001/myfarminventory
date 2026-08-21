import { useEffect, useState } from 'react';
import salesService from '../services/salesService.js';

function useSales() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    salesService.list().then((response) => setSales(response.data || []));
  }, []);

  return { sales };
}

export { useSales };
