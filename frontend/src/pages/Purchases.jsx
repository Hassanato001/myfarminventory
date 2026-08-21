import PagePlaceholder from '../components/common/PagePlaceholder.jsx';
import PurchaseList from '../components/purchases/PurchaseList.jsx';
import PurchaseForm from '../components/purchases/PurchaseForm.jsx';
import { useState } from 'react';

function Purchases() {
  const [refreshToken, setRefreshToken] = useState(0);
  return (
    <div className="page">
      <PagePlaceholder title="Purchases" description="Track supplier orders and automatically restock inventory." />
      <div className="card-grid">
        <PurchaseList refreshToken={refreshToken} />
        <PurchaseForm onCreated={() => setRefreshToken((value) => value + 1)} />
      </div>
    </div>
  );
}

export default Purchases;
