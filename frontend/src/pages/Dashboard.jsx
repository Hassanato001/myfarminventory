import SummaryCards from '../components/dashboard/SummaryCards.jsx';
import SalesChart from '../components/dashboard/SalesChart.jsx';
import LowStockAlert from '../components/dashboard/LowStockAlert.jsx';
import RecentTransactions from '../components/dashboard/RecentTransactions.jsx';
import { useDashboard } from '../hooks/useDashboard.js';

function Dashboard() {
  const { data } = useDashboard();

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>
      <SummaryCards data={data} />
      <div className="card-grid">
        <SalesChart data={data} />
        <LowStockAlert data={data} />
      </div>
      <RecentTransactions data={data} />
    </div>
  );
}

export default Dashboard;
