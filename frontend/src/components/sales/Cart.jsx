import Button from '../common/Button.jsx';

function Cart({ items, onChangeQty, onRemove }) {
  return (
    <div className="panel">
      <h3>Cart</h3>
      {(items || []).length ? (
        <div className="page">
          {(items || []).map((item) => (
            <div key={item.productId} className="row" style={{ justifyContent: 'space-between' }}>
              <span>
                {item.name} x {item.quantity}
              </span>
              <div className="row">
                <Button type="button" variant="secondary" onClick={() => onChangeQty(item.productId, -1)}>
                  -
                </Button>
                <Button type="button" variant="secondary" onClick={() => onChangeQty(item.productId, 1)}>
                  +
                </Button>
                <Button type="button" onClick={() => onRemove(item.productId)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="muted">Add items from search.</p>
      )}
    </div>
  );
}

export default Cart;
