export default function ProductGrid({ products }) {
  return (
    <main className="product-section">
      <h2>Featured Fugglers</h2>

      <div className="product-container">
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            <img src={p.image} alt={p.name} />
            <h4>{p.name}</h4>
            <p className="price">₱{p.price}</p>

            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </main>
  );
}