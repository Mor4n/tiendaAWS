import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { isAuth, user, logout } = useAuth();
  const { getTotalItems } = useCart();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl">🛒</span>
            <h1 className="text-2xl font-bold text-primary-500">TiendaAWS</h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">
              Inicio
            </Link>
            <Link to="/#productos" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">
              Productos
            </Link>
            <Link to="/cart" className="flex items-center text-gray-700 hover:text-primary-500 font-medium transition-colors">
              Carrito
              {getTotalItems() > 0 && (
                <span className="ml-2 bg-primary-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            {isAuth ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-700 font-medium hidden sm:block">
                  {user?.email?.split('@')[0] || 'Usuario'}
                </span>
                <Link to="/profile" className="btn btn-outline">
                  Mi Perfil
                </Link>
                <button onClick={logout} className="btn btn-secondary">
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>

        <nav className="md:hidden flex items-center justify-around mt-4 pt-4 border-t">
          <Link to="/" className="text-gray-700 hover:text-primary-500 font-medium">
            Inicio
          </Link>
          <Link to="/#productos" className="text-gray-700 hover:text-primary-500 font-medium">
            Productos
          </Link>
          <Link to="/cart" className="relative text-gray-700 hover:text-primary-500 font-medium">
            Carrito
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
