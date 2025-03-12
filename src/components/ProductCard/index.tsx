import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: Product;
  onGroupBuyClick?: () => void;
  onAddToCart?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onGroupBuyClick,
  onAddToCart
}) => {
  return (
    <motion.div 
      className={styles.card}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className={styles.imageContainer}>
        <img 
          src={product.images[0]} 
          alt={product.name}
          loading="lazy"
        />
        {product.stock < 10 && (
          <span className={styles.stockBadge}>
            Only {product.stock} left!
          </span>
        )}
      </div>
      
      <div className={styles.content}>
        <h3>{product.name}</h3>
        <div className={styles.prices}>
          <span className={styles.originalPrice}>
            ¥{product.price}
          </span>
          <span className={styles.groupPrice}>
            ¥{product.groupBuyPrice}
            <small>Group Buy</small>
          </span>
        </div>
        
        <div className={styles.stats}>
          <span>⭐ {product.ratings}</span>
          <span>📝 {product.reviews} reviews</span>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={styles.groupBuyBtn}
            onClick={onGroupBuyClick}
          >
            Start Group Buy
            <small>{product.minGroupSize} people</small>
          </button>
          
          <button 
            className={styles.cartBtn}
            onClick={onAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );

  // Base component with shared logic
import { Platform } from 'react-native';
import { ProductCardWeb } from './ProductCard.web';
import { ProductCardMobile } from './ProductCard.native';

export const ProductCard = Platform.select({
  web: ProductCardWeb,
  default: ProductCardMobile,
});
};