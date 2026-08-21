import { useEffect, useState } from 'react';
import customerService from '../services/customerService.js';

function useCustomers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    customerService.list().then((response) => setCustomers(response.data || []));
  }, []);

  return { customers };
}

export { useCustomers };
