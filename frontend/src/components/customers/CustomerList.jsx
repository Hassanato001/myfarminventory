import Table from '../common/Table.jsx';
import Spinner from '../common/Spinner.jsx';
import { useCustomersData } from '../../hooks/useCustomersData.js';
import { formatDate } from '../../utils/helpers.js';

function CustomerList({ refreshToken }) {
  const { customers, loading } = useCustomersData(refreshToken);

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
        { key: 'name', label: 'Name' },
        { key: 'phone', label: 'Phone' },
        { key: 'email', label: 'Email' },
        { key: 'totalSpent', label: 'Spent' },
        { key: 'lastPurchaseAt', label: 'Last Purchase' }
      ]}
      rows={customers.map((customer) => ({
        id: customer.id,
        name: customer.name,
        phone: customer.phone || '-',
        email: customer.email || '-',
        totalSpent: customer.totalSpent || 0,
        lastPurchaseAt: formatDate(customer.lastPurchaseAt)
      }))}
    />
  );
}

export default CustomerList;
