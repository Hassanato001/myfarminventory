import Table from '../common/Table.jsx';
import Spinner from '../common/Spinner.jsx';
import { formatCurrency } from '../../utils/helpers.js';

function ReportGenerator({ summary, loading }) {
  if (loading) {
    return (
      <div className="panel">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="panel">
      <h3>Report Summary</h3>
      <p className="muted">Revenue: {formatCurrency(summary?.metrics?.revenue)}</p>
      <Table
        columns={[
          { key: 'label', label: 'Metric' },
          { key: 'value', label: 'Value' }
        ]}
        rows={[
          { id: 'sales', label: 'Sales', value: summary?.metrics?.sales || 0 },
          { id: 'purchases', label: 'Purchases', value: summary?.metrics?.purchases || 0 },
          { id: 'expenses', label: 'Expenses', value: summary?.metrics?.expenses || 0 },
          { id: 'lowStock', label: 'Low Stock Items', value: summary?.metrics?.lowStock || 0 }
        ]}
      />
    </div>
  );
}

export default ReportGenerator;
