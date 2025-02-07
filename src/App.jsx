import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './login/LoginPage';
import Staffcover from './staff/staffcover';
import DashboardHeader from './admin/DashboardHeader/DashboardHeader';
import Sidebar from './stored/Sidebar/Sidebar';
import './index.css'
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
        path="/admin-dashboard/*" 
          element={
            <PrivateRoute requiredRole="admin">
              <DashboardHeader />
            </PrivateRoute>
          }
        />

<Route
        path="/store-dashboard/*" 
          element={
            <PrivateRoute requiredRole="store">
              <Sidebar />
            </PrivateRoute>
          }
        />
      </Routes>
      
   
    </Router>
  );
};

export default App;
