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
        <p className="muted">Transactions will appear here once connected to the API.</p>
      )}
    </div>
  );
}

export default RecentTransactions;
