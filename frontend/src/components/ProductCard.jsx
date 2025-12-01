import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const getProductEmoji = (category) => {
    const emojis = {
      electronics: '💻',
      clothing: '👕',
      books: '📚',
      home: '🏠',
      sports: '⚽',
      toys: '🎮',
    };
    return emojis[category] || '📦';
  };

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return (
        <span className="text-red-600 font-semibold text-sm">Agotado</span>
      );
    }
    if (stock < 5) {
      return (
        <span className="text-orange-600 font-semibold text-sm">
          ¡Solo quedan {stock}!
        </span>
      );
    }
    return (
      <span className="text-green-600 text-sm">
        Disponible ({stock} unidades)
      </span>
    );
  };

  const handleAddToCart = () => {
    const result = addToCart(product);
    if (result.success) {
      // Podríamos agregar una notificación aquí
      console.log(result.message);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="card card-hover">
      {/* Image */}
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-6xl">
        {getProductEmoji(product.category)}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category Badge */}
        <span className="inline-block bg-secondary-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase mb-2">
          {product.category}
        </span>

        {/* Product Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {product.name}
        </h3>

        {/* Price */}
        <p className="text-3xl font-bold text-primary-500 mb-2">
          ${product.price.toFixed(2)}
        </p>

        {/* Stock */}
        <div className="mb-4">{getStockBadge(product.stock)}</div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full btn btn-primary disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:transform-none"
        >
          {product.stock === 0 ? 'Agotado' : 'Añadir al Carrito'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
