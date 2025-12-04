import { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'todos', name: 'Todos' },
    { id: 'electronica', name: 'Electrónica' },
    { id: 'ropa', name: 'Ropa' },
    { id: 'libros', name: 'Libros' },
    { id: 'hogar', name: 'Hogar' },
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [activeCategory, products]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError('Error al cargar productos. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (activeCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((p) => p.category === activeCategory)
      );
    }
  };

  return (
    <div>
      <section className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white py-20">
        <div className="container-custom text-center">
          <h2 className="text-5xl font-bold mb-4">Bienvenido a Tienda</h2>
          <p className="text-xl mb-8 opacity-90">
            Envío rápido hasta la puerta de tu hogar
          </p>
          <a
            href="#productos"
            className="inline-block btn btn-primary text-lg px-8 py-3"
          >
            Ver Productos
          </a>
        </div>
      </section>

      <section id="productos" className="py-16">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-8">
            Nuestros Productos
          </h2>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-primary-500 hover:text-primary-500'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 text-lg">
                    No hay productos disponibles en esta categoría
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
