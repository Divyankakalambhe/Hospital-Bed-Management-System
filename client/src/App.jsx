import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts & Pages
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BedsManagement from './pages/BedsManagement';
import PatientAdmissions from './pages/PatientAdmissions';
import PatientDischarge from './pages/PatientDischarge';
import Reports from './pages/Reports';
import Doctors from './pages/Doctors';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="beds" element={<BedsManagement />} />
              <Route path="admissions" element={<PatientAdmissions />} />
              <Route path="discharge" element={<PatientDischarge />} />
              <Route path="reports" element={<Reports />} />
              <Route path="doctors" element={<Doctors />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
