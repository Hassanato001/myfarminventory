import Table from '../common/Table.jsx';
import Spinner from '../common/Spinner.jsx';
import { useExpensesData } from '../../hooks/useExpensesData.js';
import { formatCurrency, formatDate } from '../../utils/helpers.js';

function ExpenseList({ refreshToken }) {
  const { expenses, loading } = useExpensesData(refreshToken);

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
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category' },
        { key: 'amount', label: 'Amount' },
        { key: 'createdAt', label: 'Date' }
      ]}
      rows={expenses.map((expense) => ({
        id: expense.id,
        title: expense.title,
        category: expense.category,
        amount: formatCurrency(expense.amount),
        createdAt: formatDate(expense.createdAt)
      }))}
    />
  );
}

export default ExpenseList;
