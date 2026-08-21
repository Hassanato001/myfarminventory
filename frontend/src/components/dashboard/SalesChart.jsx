function SalesChart({ data }) {
  return (
    <div className="panel">
      <h3>Sales Chart</h3>
      <p className="muted">
        {data?.recentSales?.length ? `Latest sale total: ${data.recentSales[0].total}` : 'No sales yet.'}
      </p>
    </div>
  );
}

export default SalesChart;
