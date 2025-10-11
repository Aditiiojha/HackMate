import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts and Wrappers
import PrivateRoute from './components/common/PrivateRoute';
import MainLayout from './components/common/MainLayout';

// Page Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import GroupExplorer from './pages/GroupExplorer';
import CreateGroup from './pages/CreateGroup';
import GroupDetails from './pages/GroupDetails';

// THE FIX: Import 'useAuth' from its new, correct location
import { useAuth } from './hooks/useAuth';

function App() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!currentUser ? <Register /> : <Navigate to="/dashboard" />} />

      {/* Private Routes Wrapper */}
      <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/groups/:groupId" element={<GroupDetails />} />
        <Route path="/groups" element={<GroupExplorer />} />
        <Route path="/create-group" element={<CreateGroup />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default App;