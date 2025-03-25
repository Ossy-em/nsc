import { Routes, Route } from 'react-router-dom';
import StaffRequestPage from '../staff/StaffRequestPage';
import RequestHistoryPage from '../staff/RequestHistoryPage/RequestHistoryPage';
import PrivateRoute from '../utils/Privaterouter';

const StaffRoutes = () => {
  return (
    <Routes>
    
      <Route
        path="/department/:departmentName/staff-request"
        element={
          <PrivateRoute requiredRole="staff">
            <StaffRequestPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/department/:departmentName/director"
        element={
          <PrivateRoute requiredRole="director">
            <StaffRequestPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/department/:departmentName/requests"
        element={
          // <PrivateRoute requiredRole={['staff', 'director']}>
            <RequestHistoryPage />
          // </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default StaffRoutes;