import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import productService from '../../services/productService.js';

function ProductForm({ onSaved, product, onCancel }) {
  const { accessToken } = useAuth();
  const [form, setForm] = useState({
    name: '',
    category: '',
    buyingPrice: '',
    sellingPrice: '',
    quantity: '',
    reorderLevel: '',
    unit: 'piece',
    description: '',
    isActive: true
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        category: product.category || '',
        buyingPrice: product.buyingPrice || '',
        sellingPrice: product.sellingPrice || '',
        quantity: product.quantity || '',
        reorderLevel: product.reorderLevel || '',
        unit: product.unit || 'piece',
        description: product.description || '',
        isActive: product.isActive !== undefined ? product.isActive : true
      });
    } else {
      setForm({
        name: '',
        category: '',
        buyingPrice: '',
        sellingPrice: '',
        quantity: '',
        reorderLevel: '',
        unit: 'piece',
        description: '',
        isActive: true
      });
    }
  }, [product]);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const payload = {
      ...form,
      buyingPrice: Number(form.buyingPrice),
      sellingPrice: Number(form.sellingPrice),
      quantity: Number(form.quantity),
      reorderLevel: Number(form.reorderLevel)
    };

    try {
      if (product) {
        await productService.update(accessToken, product.id, payload);
        setMessage('Product updated');
      } else {
        await productService.create(accessToken, payload);
        setMessage('Product created');
      }
      if (onSaved) {
        onSaved();
      }
      if (!product) {
        setForm({
          name: '',
          category: '',
          buyingPrice: '',
          sellingPrice: '',
          quantity: '',
          reorderLevel: '',
          unit: 'piece',
          description: '',
          isActive: true
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="panel">
      <form onSubmit={submit} className="page">
        <h3>{product ? 'Edit Product' : 'Create Product'}</h3>
        <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <Input label="Buying price" type="number" value={form.buyingPrice} onChange={(e) => setForm({ ...form, buyingPrice: e.target.value })} />
        <Input label="Selling price" type="number" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} />
        <Input label="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
        <Input label="Reorder level" type="number" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} />
        <Input label="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
        <Input label="Description" multiline value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        {message ? <div className="muted">{message}</div> : null}
        {error ? <div className="muted">{error}</div> : null}
        <div className="row">
          <Button type="submit">{product ? 'Update Product' : 'Create Product'}</Button>
          {product ? (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
