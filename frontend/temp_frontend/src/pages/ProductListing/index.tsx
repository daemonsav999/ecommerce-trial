import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGetProductsQuery } from '@/services/api';
import { ProductCard } from '@/components/ProductCard';
import { FilterSidebar } from '@/components/FilterSidebar';
import { ProductSkeleton } from '@/components/ProductSkeleton';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import styles from './ProductListing.module.scss';

const ITEMS_PER_PAGE = 20;

export const ProductListing: React.FC = () => {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 10000],
    hasGroupBuy: false,
    rating: 0,
  });
  
  const [sort, setSort] = useState({
    field: 'popularity',
    direction: 'desc',
  });

  const [page, setPage] = useState(1);
  
  const { data, isLoading, isFetching } = useGetProductsQuery({
    page,
    limit: ITEMS_PER_PAGE,
    ...filters,
    sort: `${sort.field}:${sort.direction}`,
  });

  const { loadMoreRef } = useInfiniteScroll(() => {
    if (data?.hasMore && !isFetching) {
      setPage(prev => prev + 1);
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className={styles.container}>
      <FilterSidebar 
        filters={filters}
        onFilterChange={setFilters}
      />
      
      <div className={styles.content}>
        <div className={styles.sortBar}>
          <select
            value={sort.field}
            onChange={(e) => setSort(prev => ({ ...prev, field: e.target.value }))}
          >
            <option value="popularity">Popularity</option>
            <option value="price">Price</option>
            <option value="newest">Newest</option>
          </select>
          
          <button
            onClick={() => setSort(prev => ({
              ...prev,
              direction: prev.direction === 'asc' ? 'desc' : 'asc'
            }))}
          >
            {sort.direction === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {isLoading
            ? Array(8).fill(null).map((_, i) => (
                <ProductSkeleton key={`skeleton-${i}`} />
              ))
            : data?.products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
        </motion.div>

        <div ref={loadMoreRef} className={styles.loader}>
          {isFetching && <span>Loading more...</span>}
        </div>
      </div>
    </div>
  );
};