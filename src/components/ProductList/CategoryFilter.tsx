import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { useGetCategoriesQuery } from '../../services/api';
import { Category } from '../../types/product';

interface CategoryFilterProps {
  selectedCategory?: string;
  onSelectCategory: (categoryId: string | undefined) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { data: categories = [] } = useGetCategoriesQuery();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      <TouchableOpacity
        style={[
          styles.categoryItem,
          !selectedCategory && styles.selectedCategory,
        ]}
        onPress={() => onSelectCategory(undefined)}
      >
        <Text style={styles.categoryText}>All</Text>
      </TouchableOpacity>

      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryItem,
            selectedCategory === category.id && styles.selectedCategory,
          ]}
          onPress={() => onSelectCategory(category.id)}
        >
          {category.imageUrl && (
            <Image
              source={{ uri: category.imageUrl }}
              style={styles.categoryImage}
            />
          )}
          <Text style={styles.categoryText}>{category.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryItem: {
    marginRight: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
  },
  categoryImage: {
    width: 24,
    height: 24,
    marginRight: 8,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
});