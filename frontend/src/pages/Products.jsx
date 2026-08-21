import { useState } from 'react';
import PagePlaceholder from '../components/common/PagePlaceholder.jsx';
import ProductList from '../components/products/ProductList.jsx';
import ProductForm from '../components/products/ProductForm.jsx';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';

function Products() {
  const [refreshToken, setRefreshToken] = useState(0);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  const refresh = () => setRefreshToken((value) => value + 1);

  return (
    <div className="page">
      <PagePlaceholder title="Products" description="Manage inventory items, pricing, stock levels, and fast edits." />
      <div className="card-grid">
        <div className="panel">
          <Input label="Search products" value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="row" style={{ marginTop: '12px' }}>
            <Button type="button" variant="secondary" onClick={refresh}>
              Refresh
            </Button>
            <Button type="button" variant="secondary" onClick={() => setSearch('')}>
              Clear
            </Button>
          </div>
        </div>
        <ProductForm
          product={editingProduct}
          onSaved={() => {
            setEditingProduct(null);
            refresh();
          }}
          onCancel={() => setEditingProduct(null)}
        />
      </div>
      <div className="panel">
        <ProductList refreshToken={refreshToken} search={search} onEdit={setEditingProduct} />
      </div>
    </div>
  );
}

export default Products;
