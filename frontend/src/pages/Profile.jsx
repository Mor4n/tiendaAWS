import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const data = await getUserOrders(userId);
      setOrders(data);
    } catch (err) {
      setError('Error al cargar los pedidos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Procesando' },
      shipped: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Enviado' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'Entregado' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado' },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-sm font-semibold`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="container-custom py-12">
      <h2 className="text-4xl font-bold mb-8">Mi Perfil</h2>

      {/* User Info Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-2xl font-bold mb-4">Información Personal</h3>
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Email:</span>{' '}
            {user?.email || localStorage.getItem('userEmail') || 'No disponible'}
          </p>
          <p>
            <span className="font-semibold">ID de Usuario:</span>{' '}
            {localStorage.getItem('userId') || 'No disponible'}
          </p>
        </div>
      </div>

      {/* Orders Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold mb-6">Mis Pedidos</h3>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando pedidos...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-600 mb-4">No tienes pedidos aún</p>
            <a href="/#productos" className="btn btn-primary">
              Comenzar a Comprar
            </a>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((order) => (
                <div key={order.orderId} className="border-2 border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-lg text-secondary-600">
                        Pedido #{order.orderId}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="mb-4">
                    <p className="font-semibold mb-2">Productos:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {order.products.map((product, index) => (
                        <li key={index} className="text-gray-700">
                          {product.quantity}x Producto ID: {product.productId}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-2xl font-bold text-primary-500">
                      Total: ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
