import PagePlaceholder from '../components/common/PagePlaceholder.jsx';
import ProductSearch from '../components/sales/ProductSearch.jsx';
import Cart from '../components/sales/Cart.jsx';
import PaymentModal from '../components/sales/PaymentModal.jsx';
import Receipt from '../components/sales/Receipt.jsx';
import { useEffect, useMemo, useState } from 'react';
import productService from '../services/productService.js';
import salesService from '../services/salesService.js';
import { useAuth } from '../hooks/useAuth.js';
import { formatCurrency } from '../utils/helpers.js';

function POS() {
  const { accessToken } = useAuth();
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [sale, setSale] = useState(null);
  const [error, setError] = useState('');
  const [payment, setPayment] = useState({
    customerName: '',
    paymentMethod: 'CASH',
    amountPaid: ''
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const response = await productService.list(`?search=${encodeURIComponent(query)}`);
      if (!cancelled) {
        setProducts(response.data?.data || []);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [query, accessToken]);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity * item.sellingPrice, 0),
    [cart]
  );

  const addProduct = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { productId: product.id, name: product.name, quantity: 1, sellingPrice: Number(product.sellingPrice) }];
    });
  };

  const changeQty = (productId, delta) => {
    setCart((current) =>
      current
        .map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const completeSale = async () => {
    setError('');
    try {
      const response = await salesService.create({
        customerName: payment.customerName,
        paymentMethod: payment.paymentMethod,
        amountPaid: Number(payment.amountPaid || total),
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.sellingPrice
        }))
      });
      setSale(response.data);
      setCart([]);
      setPayment({ customerName: '', paymentMethod: 'CASH', amountPaid: '' });
      const refreshed = await productService.list(`?search=${encodeURIComponent(query)}`);
      setProducts(refreshed.data?.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <PagePlaceholder title="POS" description="Point of sale " />
      <div className="card-grid">
        <ProductSearch query={query} setQuery={setQuery} onAddProduct={addProduct} products={products} />
        <Cart items={cart} onChangeQty={changeQty} onRemove={(productId) => changeQty(productId, -999)} />
      </div>
      <div className="card-grid">
        <PaymentModal payment={payment} setPayment={setPayment} onComplete={completeSale} total={formatCurrency(total)} />
        <Receipt sale={sale} />
      </div>
      {error ? <div className="panel">{error}</div> : null}
    </div>
  );
}

export default POS;
