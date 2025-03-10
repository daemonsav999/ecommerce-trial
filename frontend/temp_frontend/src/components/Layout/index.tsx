import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { FloatingCart } from '../FloatingCart';
import { Toast } from '../Toast';
import { RootState } from '@/store';
import styles from './Layout.module.scss';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { notifications } = useSelector((state: RootState) => state.ui);
  
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.main}>
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>
      <FloatingCart />
      <Footer />
      
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <Toast message={notification.message} type={notification.type} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};