import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';

function ProductSearch({ query, setQuery, onAddProduct, products }) {
  return (
    <div className="panel">
      <div className="page">
        <Input label="Search products" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="panel" style={{ padding: '12px' }}>
          {(products || []).map((product) => (
            <div key={product.id} className="row" style={{ justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>{product.name}</span>
              <Button type="button" onClick={() => onAddProduct(product)}>
                Add
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductSearch;
