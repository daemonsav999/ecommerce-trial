import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import AppRoutes from './routes';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <WebSocketProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <AppRoutes />
          </div>
        </CartProvider>
      </WebSocketProvider>
    </Router>
  );
};

export default App;