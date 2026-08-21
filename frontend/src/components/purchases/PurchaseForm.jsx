import { useEffect, useState } from 'react';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import productService from '../../services/productService.js';
import purchaseService from '../../services/purchaseService.js';

function PurchaseForm({ onCreated }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    supplierName: '',
    reference: '',
    productId: '',
    quantity: '',
    unitCost: '',
    notes: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    productService.list().then((response) => {
      setProducts(response.data?.data || []);
      if (!form.productId && (response.data?.data || []).length > 0) {
        setForm((current) => ({ ...current, productId: response.data.data[0].id, unitCost: response.data.data[0].buyingPrice }));
      }
    });
  }, []);

  const selectedProduct = products.find((product) => product.id === form.productId);

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      await purchaseService.create({
        supplierName: form.supplierName,
        reference: form.reference,
        notes: form.notes,
        items: [
          {
            productId: form.productId,
            quantity: Number(form.quantity),
            unitCost: Number(form.unitCost)
          }
        ]
      });
      setMessage('Purchase saved');
      setForm({
        supplierName: '',
        reference: '',
        productId: products[0]?.id || '',
        quantity: '',
        unitCost: products[0]?.buyingPrice || '',
        notes: ''
      });
      if (onCreated) {
        onCreated();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="panel">
      <form onSubmit={submit} className="page">
        <Input label="Supplier name" value={form.supplierName} onChange={(e) => setForm({ ...form, supplierName: e.target.value })} />
        <Input label="Reference" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} />
        <label className="field">
          <span>Product</span>
          <select value={form.productId} onChange={(e) => {
            const product = products.find((item) => item.id === e.target.value);
            setForm({
              ...form,
              productId: e.target.value,
              unitCost: product ? product.buyingPrice : form.unitCost
            });
          }}>
            <option value="">Select product</option>
            {products.map((product) => (
              <option value={product.id} key={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </label>
        <Input label="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
        <Input label="Unit cost" type="number" value={form.unitCost} onChange={(e) => setForm({ ...form, unitCost: e.target.value })} />
        <Input label="Notes" multiline value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        {selectedProduct ? <div className="muted">Selected stock: {selectedProduct.quantity}</div> : null}
        {message ? <div className="muted">{message}</div> : null}
        {error ? <div className="muted">{error}</div> : null}
        <Button type="submit">Save Purchase</Button>
      </form>
    </div>
  );
}

export default PurchaseForm;
