import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreateGroupBuyMutation } from '@/services/api';
import { CountdownTimer } from '../CountdownTimer';
import { Avatar } from '../Avatar';
import { ShareButton } from '../ShareButton';
import styles from './GroupBuyModal.module.scss';

interface GroupBuyModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const GroupBuyModal: React.FC<GroupBuyModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const [groupSize, setGroupSize] = useState(product.minGroupSize);
  const [createGroupBuy, { isLoading }] = useCreateGroupBuyMutation();

  const handleCreateGroup = async () => {
    try {
      await createGroupBuy({
        productId: product.id,
        targetSize: groupSize,
        price: product.groupBuyPrice
      }).unwrap();
      
      onClose();
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button className={styles.closeBtn} onClick={onClose}>×</button>
            
            <div className={styles.content}>
              <img 
                src={product.images[0]} 
                alt={product.name}
                className={styles.productImage}
              />
              
              <div className={styles.info}>
                <h3>{product.name}</h3>
                <div className={styles.pricing}>
                  <span className={styles.groupPrice}>
                    ¥{product.groupBuyPrice}
                  </span>
                  <span className={styles.originalPrice}>
                    ¥{product.price}
                  </span>
                  <span className={styles.discount}>
                    {Math.round((1 - product.groupBuyPrice / product.price) * 100)}% OFF
                  </span>
                </div>

                <div className={styles.groupConfig}>
                  <label>Group Size:</label>
                  <div className={styles.sizeSelector}>
                    {Array.from(
                      { length: product.maxGroupSize - product.minGroupSize + 1 },
                      (_, i) => i + product.minGroupSize
                    ).map(size => (
                      <button
                        key={size}
                        className={groupSize === size ? styles.active : ''}
                        onClick={() => setGroupSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.timer}>
                  <CountdownTimer 
                    duration={product.expiryHours * 3600}
                    onExpire={onClose}
                  />
                </div>

                <button
                  className={styles.createBtn}
                  onClick={handleCreateGroup}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Start Group Buy'}
                </button>

                <ShareButton 
                  title={`Join my group buy for ${product.name}`}
                  text={`Get ${product.name} for just ¥${product.groupBuyPrice} (${Math.round((1 - product.groupBuyPrice / product.price) * 100)}% off)`}
                  url={window.location.href}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};