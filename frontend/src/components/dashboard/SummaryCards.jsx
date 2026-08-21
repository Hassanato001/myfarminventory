import { formatCurrency } from '../../utils/helpers.js';

function SummaryCards({ data }) {
  const metrics = data?.metrics || {};
  const cards = [
    ['Today Sales', metrics.sales || 0],
    ['Low Stock Items', metrics.lowStock || 0],
    ['Products', metrics.products || 0],
    ['Revenue', formatCurrency(metrics.revenue || 0)]
  ];

  return (
    <div className="card-grid">
      {cards.map(([label, value]) => (
        <div className="card" key={label}>
          <div className="muted">{label}</div>
          <h3>{value}</h3>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;
