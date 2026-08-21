import Button from '../common/Button.jsx';

function ReportFilters({ onRefresh }) {
  return (
    <div className="panel">
      <h3>Report Controls</h3>
      <p className="muted">Refresh the latest business summary and breakdowns.</p>
      <Button type="button" onClick={onRefresh}>
        Refresh Reports
      </Button>
    </div>
  );
}

export default ReportFilters;
