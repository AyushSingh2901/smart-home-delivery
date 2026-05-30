import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AboutContact from './pages/AboutContact';
import AdminDashboard from './pages/AdminDashboard';
import Auth from './pages/Auth';
import Booking from './pages/Booking';
import Chat from './pages/Chat';
import CustomerDashboard from './pages/CustomerDashboard';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import PaymentSuccess from './pages/PaymentSuccess';
import ProviderDashboard from './pages/ProviderDashboard';
import ProviderDetails from './pages/ProviderDetails';
import Services from './pages/Services';
import { useAuth } from './context/AuthContext';

function DashboardRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'admin' ? '/admin' : user.role === 'provider' ? '/provider' : '/customer'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/providers/:id" element={<ProviderDetails />} />
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/register" element={<Auth mode="register" />} />
      <Route path="/dashboard" element={<DashboardRedirect />} />
      <Route path="/customer" element={<ProtectedRoute roles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
      <Route path="/provider" element={<ProtectedRoute roles={['provider']}><ProviderDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/about" element={<AboutContact />} />
      <Route path="/contact" element={<AboutContact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

