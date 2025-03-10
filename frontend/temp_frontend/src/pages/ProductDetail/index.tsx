import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductQuery } from '@/services/api';
import { SocialShare } from '@/components/SocialShare';
import { ProductGallery } from '@/components/ProductGallery';
import { GroupBuyModal } from '@/components/GroupBuyModal';
import styles from './ProductDetail.module.scss';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useGetProductQuery(id);
  const [isGroupBuyModalOpen, setIsGroupBuyModalOpen] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className={styles.productDetail}>
      <div className={styles.mainContent}>
        <ProductGallery images={product.images} />
        
        <div className={styles.info}>
          <h1>{product.name}</h1>
          
          <div className={styles.pricing}>
            <div className={styles.prices}>
              <span className={styles.originalPrice}>
                ${product.price}
              </span>
              <span className={styles.groupPrice}>
                ${product.groupBuyPrice}
              </span>
              <span className={styles.discount}>
                {Math.round((1 - product.groupBuyPrice / product.price) * 100)}% OFF
              </span>
            </div>

            {/* Place SocialShare here for product sharing */}
            <div className={styles.shareContainer}>
              <SocialShare
                productId={product.id}
                title={product.name}
                price={product.price}
                groupPrice={product.groupBuyPrice}
                image={product.images[0]}
                discount={Math.round((1 - product.groupBuyPrice / product.price) * 100)}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button 
              className={styles.groupBuyButton}
              onClick={() => setIsGroupBuyModalOpen(true)}
            >
              Start Group Buy
            </button>
            <button className={styles.addToCartButton}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <GroupBuyModal
        isOpen={isGroupBuyModalOpen}
        onClose={() => setIsGroupBuyModalOpen(false)}
        product={product}
      />
    </div>
  );
};