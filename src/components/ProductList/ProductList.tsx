import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, StyleSheet } from 'react-native';
import { useGetProductsQuery } from '../../services/api';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';
import { ProductFilters, Product } from '../../types/product';
import { FilterBar } from './FilterBar';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorView } from '../common/ErrorView';

export const ProductList: React.FC = () => {
  const [filters, setFilters] = useState<ProductFilters>({
    sortBy: 'newest',
    sortOrder: 'desc',
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    data: products,
    isLoading,
    isError,
    refetch
  } = useGetProductsQuery(undefined);

  const filteredProducts = React.useMemo(() => {
    if (!products) return [];
    
    return products.filter(product => {
      // Apply category filter
      if (filters.category && product.categoryId !== filters.category) {
        return false;
      }
      
      // Apply price filter
      if (filters.minPrice && product.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && product.price > filters.maxPrice) {
        return false;
      }
      
      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price':
          return filters.sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
        case 'rating':
          return filters.sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
        case 'newest':
          return filters.sortOrder === 'asc' 
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
  }, [products, filters, searchQuery]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorView onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <CategoryFilter
        selectedCategory={filters.category}
        onSelectCategory={(categoryId) => 
          setFilters(prev => ({ ...prev, category: categoryId }))
        }
      />
      
      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
      />
      
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productGrid}
        onRefresh={refetch}
        refreshing={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
  },
  productGrid: {
    padding: 8,
  },
});