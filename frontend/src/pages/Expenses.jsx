import PagePlaceholder from '../components/common/PagePlaceholder.jsx';
import ExpenseList from '../components/expenses/ExpenseList.jsx';
import ExpenseForm from '../components/expenses/ExpenseForm.jsx';
import { useState } from 'react';

function Expenses() {
  const [refreshToken, setRefreshToken] = useState(0);
  return (
    <div className="page">
      <PagePlaceholder title="Expenses" description="Log expenses, payment methods, and operational notes." />
      <div className="card-grid">
        <ExpenseList refreshToken={refreshToken} />
        <ExpenseForm onCreated={() => setRefreshToken((value) => value + 1)} />
      </div>
    </div>
  );
}

export default Expenses;
