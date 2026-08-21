import Table from '../common/Table.jsx';
import Spinner from '../common/Spinner.jsx';
import { usePurchasesData } from '../../hooks/usePurchasesData.js';
import { formatCurrency, formatDate } from '../../utils/helpers.js';

function PurchaseList({ refreshToken }) {
  const { purchases, loading } = usePurchasesData(refreshToken);

  if (loading) {
    return (
      <div className="panel">
        <Spinner />
      </div>
    );
  }

  return (
    <Table
      columns={[
        { key: 'reference', label: 'Reference' },
        { key: 'supplierName', label: 'Supplier' },
        { key: 'total', label: 'Total' },
        { key: 'createdAt', label: 'Date' }
      ]}
      rows={purchases.map((purchase) => ({
        id: purchase.id,
        reference: purchase.reference,
        supplierName: purchase.supplierName,
        total: formatCurrency(purchase.total),
        createdAt: formatDate(purchase.createdAt)
      }))}
    />
  );
}

export default PurchaseList;
