import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './login/LoginPage';
import StaffRoutes from './staff/StaffRoutes';
import DashboardHeader from './admin/Sidebar/DashboardHeader';
import Sidebar from './staff/sidebar';
import PrivateRoute from './utils/Privaterouter';
import AdminLoginPage from './login/AdminLoginPage/AdminLoginPage'; // Fixed import
import './index.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Staff login */}
        <Route path="/admin-login" element={<AdminLoginPage />} /> {/* Admin login */}
        <Route path="/admin-dashboard/*" element={
          <PrivateRoute requiredRole="admin">
            <DashboardHeader />
          </PrivateRoute>
        } />
        <Route path="/staff-home/*" element={<Sidebar />} />
        <Route path="/*" element={<StaffRoutes />} /> {/* Catch-all last */}
      </Routes>
    </Router>
  );
};

export default App;