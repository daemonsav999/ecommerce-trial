import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GroupBuyList from '../components/GroupBuy/GroupBuyList';
import GroupBuyDetail from '../components/GroupBuy/GroupBuyDetail';
import UserDashboard from '../components/Dashboard/UserDashboard';
import Cart from '../components/Cart/Cart';
import Checkout from '../components/Checkout/Checkout';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<GroupBuyList />} />
      <Route path="/group-buys" element={<GroupBuyList />} />
      <Route path="/group-buy/:id" element={<GroupBuyDetail />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;