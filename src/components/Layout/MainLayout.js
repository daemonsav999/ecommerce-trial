import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FloatingAction } from './FloatingAction';
import { useAuth } from '../../hooks/useAuth';

const MainLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        {children}
      </main>

      {isAuthenticated && <FloatingAction />}
      <Footer />
    </div>
  );
};

export default MainLayout;