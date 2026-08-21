import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';

function PaymentModal({ payment, setPayment, onComplete, total }) {
  return (
    <div className="panel">
      <div className="page">
        <h3>Checkout</h3>
        <Input label="Customer name" value={payment.customerName} onChange={(e) => setPayment({ ...payment, customerName: e.target.value })} />
        <label className="field">
          <span>Payment method</span>
          <select value={payment.paymentMethod} onChange={(e) => setPayment({ ...payment, paymentMethod: e.target.value })}>
            <option value="CASH">CASH</option>
            <option value="CARD">CARD</option>
            <option value="MOBILE">MOBILE</option>
          </select>
        </label>
        <Input label="Amount paid" type="number" value={payment.amountPaid} onChange={(e) => setPayment({ ...payment, amountPaid: e.target.value })} />
        <p className="muted">Total: {total}</p>
        <Button type="button" onClick={onComplete}>
          Complete Sale
        </Button>
      </div>
    </div>
  );
}

export default PaymentModal;
