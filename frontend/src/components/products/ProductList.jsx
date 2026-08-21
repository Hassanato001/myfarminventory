import Table from '../common/Table.jsx';
import Spinner from '../common/Spinner.jsx';
import Button from '../common/Button.jsx';
import { useProducts } from '../../hooks/useProducts.js';
import { formatCurrency } from '../../utils/helpers.js';

function ProductList({ refreshToken, search = '', onEdit }) {
  const { products, loading } = useProducts(refreshToken, search ? `?search=${encodeURIComponent(search)}` : '');

  if (loading) {
    return (
      <div className="panel">
        <Spinner />
      </div>
    );
  }

  return (
    <Table
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'sku', label: 'SKU' },
        { key: 'quantity', label: 'Stock' },
        { key: 'price', label: 'Price' },
        { key: 'actions', label: 'Actions' }
      ]}
      rows={products.map((product) => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        quantity: product.quantity,
        price: formatCurrency(product.sellingPrice),
        actions: (
          <Button type="button" variant="secondary" onClick={() => onEdit(product)}>
            Edit
          </Button>
        )
      }))}
    />
  );
}

export default ProductList;
