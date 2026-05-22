export default function ProductGrid({ products }) {
  return (
    <section className="py-8 px-5">
      <h2 className="text-2xl font-bold text-center mb-6">Featured Fugglers</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((p) => (
          <div
            key={p.id}
            className="border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all flex flex-col bg-white"
          >
            <div className="w-full h-32 bg-gray-50 rounded-md flex items-center justify-center mb-3 overflow-hidden">
              <img src={p.image} alt={p.name} className="w-full h-full object-contain p-2" />
            </div>
            <h4 className="font-semibold text-gray-800 text-sm truncate">{p.name}</h4>
            <p className="text-red-600 font-bold text-base mt-1">₱{p.price}</p>
            <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors text-sm mt-3">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}