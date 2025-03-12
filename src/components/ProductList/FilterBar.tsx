import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ProductFilters } from '../../types/product';

interface FilterBarProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFiltersChange }) => {
  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price', value: 'price' },
    { label: 'Rating', value: 'rating' },
  ];

  const toggleSortOrder = () => {
    onFiltersChange({
      ...filters,
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.sortButtons}>
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.sortButton,
              filters.sortBy === option.value && styles.selectedSort,
            ]}
            onPress={() => onFiltersChange({ ...filters, sortBy: option.value as any })}
          >
            <Text style={styles.sortButtonText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.orderButton}
        onPress={toggleSortOrder}
      >
        <Text>
          {filters.sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sortButtons: {
    flexDirection: 'row',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
  },
  selectedSort: {
    backgroundColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#333',
  },
  orderButton: {
    padding: 6,
  },
});