function LowStockAlert({ data }) {
  return (
    <div className="panel">
      <h3>Low Stock Alert</h3>
      <p className="muted">
        {data?.lowStockItems?.length
          ? `${data.lowStockItems[0].name} is low on stock.`
          : 'No low-stock items yet.'}
      </p>
    </div>
  );
}

export default LowStockAlert;
