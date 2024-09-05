import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './login/LoginPage';
import Staffcover from './staff/staffcover';
import DashboardHeader from './admin/DashboardHeader/DashboardHeader';
import PrivateRoute from './utils/Privaterouter'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/staff-request"
          element={
            <PrivateRoute requiredRole="staff">
              <Staffcover />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute requiredRole="admin">
              <DashboardHeader />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
