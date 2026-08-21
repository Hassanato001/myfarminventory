function RecentTransactions({ data }) {
  return (
    <div className="panel">
      <h3>Recent Transactions</h3>
      {data?.recentSales?.length ? (
        <ul>
          {data.recentSales.map((sale) => (
            <li key={sale.id}>
              {sale.customerName} - {sale.total}
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">View records of transactions.</p>
      )}
    </div>
  );
}

export default RecentTransactions;
