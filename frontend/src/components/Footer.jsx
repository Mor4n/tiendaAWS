import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-16">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-primary-500 text-xl font-bold mb-4">TiendaAWS</h3>
            <p className="mb-2">E-commerce desarrollado con AWS Services</p>
            <p className="text-primary-400">🎓 Proyecto AWS CCP</p>
          </div>

          {/* AWS Services */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Servicios AWS</h4>
            <ul className="space-y-2">
              <li>✓ S3 + CloudFront</li>
              <li>✓ EC2 Backend</li>
              <li>✓ DynamoDB</li>
              <li>✓ Cognito</li>
              <li>✓ CloudWatch</li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/#productos" className="hover:text-primary-400 transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary-400 transition-colors">
                  Carrito
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-primary-400 transition-colors">
                  Mi Perfil
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>&copy; 2025 TiendaAWS. Proyecto educativo.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
