import PagePlaceholder from '../components/common/PagePlaceholder.jsx';
import CustomerList from '../components/customers/CustomerList.jsx';
import CustomerForm from '../components/customers/CustomerForm.jsx';
import { useState } from 'react';

function Customers() {
  const [refreshToken, setRefreshToken] = useState(0);
  return (
    <div className="page">
      <PagePlaceholder title="Customers" description="Customer records, balances, and quick capture." />
      <div className="card-grid">
        <CustomerList refreshToken={refreshToken} />
        <CustomerForm onCreated={() => setRefreshToken((value) => value + 1)} />
      </div>
    </div>
  );
}

export default Customers;
