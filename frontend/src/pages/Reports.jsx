import PagePlaceholder from '../components/common/PagePlaceholder.jsx';
import ReportFilters from '../components/reports/ReportFilters.jsx';
import ReportGenerator from '../components/reports/ReportGenerator.jsx';
import { useState } from 'react';
import { useReportsData } from '../hooks/useReportsData.js';

function Reports() {
  const [refreshToken, setRefreshToken] = useState(0);
  const { summary, loading } = useReportsData(refreshToken);
  return (
    <div className="page">
      <PagePlaceholder title="Reports" description="Generate connected sales, stock, purchase, and expense summaries." />
      <div className="card-grid">
        <ReportFilters onRefresh={() => setRefreshToken((value) => value + 1)} />
        <ReportGenerator summary={summary} loading={loading} />
      </div>
    </div>
  );
}

export default Reports;
