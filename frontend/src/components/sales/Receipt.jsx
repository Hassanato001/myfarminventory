function Receipt({ sale }) {
  return (
    <div className="panel">
      <h3>Receipt</h3>
      {sale ? (
        <div>
          <p>Sale #{sale.id}</p>
          <p>Total: {sale.total}</p>
          <p>Change: {sale.change}</p>
        </div>
      ) : (
        <p className="muted">Receipt will appear here after checkout.</p>
      )}
    </div>
  );
}

export default Receipt;
