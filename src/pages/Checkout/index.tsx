import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { useCreateOrderMutation } from '@/services/api';
import { clearCart } from '@/store/slices/cartSlice';
import { CheckoutForm } from '@/components/CheckoutForm';
import { PaymentMethod } from '@/components/PaymentMethod';
import { OrderSummary } from '@/components/OrderSummary';
import { AddressForm } from '@/components/AddressForm';
import styles from './Checkout.module.scss';

export const Checkout: React.FC = () => {
  const [step, setStep] = useState(1);
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [formData, setFormData] = useState({
    address: {},
    paymentMethod: '',
    notes: ''
  });

  const handleSubmit = async () => {
    try {
      await createOrder({
        items: cart.items,
        ...formData
      }).unwrap();

      dispatch(clearCart());
      // Navigate to success page
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className={styles.checkout}>
      <motion.div
        className={styles.steps}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Progress indicator */}
        <div className={styles.progress}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`${styles.step} ${s === step ? styles.active : ''} ${
                s < step ? styles.completed : ''
              }`}
            >
              Step {s}
            </div>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="address"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AddressForm
                onSubmit={(address) => {
                  setFormData(prev => ({ ...prev, address }));
                  setStep(2);
                }}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <PaymentMethod
                onSelect={(method) => {
                  setFormData(prev => ({ ...prev, paymentMethod: method }));
                  setStep(3);
                }}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <OrderSummary
                items={cart.items}
                address={formData.address}
                paymentMethod={formData.paymentMethod}
              />
              <button
                className={styles.submitBtn}
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Place Order'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};