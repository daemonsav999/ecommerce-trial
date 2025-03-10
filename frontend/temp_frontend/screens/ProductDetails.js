import React, { useEffect, useState } from "react";
import { View, Text, Image, Button, ActivityIndicator, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";

const ProductDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params; // Get the `id` from navigation params
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStartingGroupBuy, setIsStartingGroupBuy] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setError("Failed to load product details. Please try again.");
        setLoading(false);
      });
  }, [id]);

  const startGroupBuy = () => {
    setIsStartingGroupBuy(true);
    const token = localStorage.getItem("token"); // Ensure user is authenticated
    axios
      .post(
        "http://localhost:3000/api/groupbuy/start",
        { productId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        const groupOrderId = res.data.groupOrderId;
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Add group buy item to the cart
        cart.push({
          id: product.id,
          name: product.name,
          price: product.discountPrice || product.price,
          quantity: 1,
          groupOrderId, // Store group order ID
          isGroupBuy: true, // Flag this as a group buy item
          imageUrl: product.imageUrl,
        });

        localStorage.setItem("cart", JSON.stringify(cart));
        Alert.alert("✅ Group buy added to cart!");
        navigation.navigate("GroupOrder", { id: groupOrderId }); // Navigate to GroupOrderScreen
      })
      .catch((err) => {
        console.error("Failed to start group order:", err);
        Alert.alert("Error: Unable to start group buy. Try again.");
        setIsStartingGroupBuy(false);
      });
  };

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.discountPrice || product.price,
        quantity: 1,
        imageUrl: product.imageUrl, // Include image for Cart UI
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    Alert.alert("✅ Product added to cart!");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading product...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>
      <Text style={styles.productPrice}>
        {product.discountPrice ? (
          <>
            <Text style={styles.originalPrice}>${product.price}</Text>
            <Text style={styles.discountPrice}> ${product.discountPrice}</Text>
          </>
        ) : (
          `$${product.price}`
        )}
      </Text>

      <View style={styles.buttonContainer}>
        <Button title="Add to Cart 🛒" onPress={addToCart} color="green" />
        <Button
          title={isStartingGroupBuy ? "Starting Group Buy..." : "Start a Group Buy"}
          onPress={startGroupBuy}
          disabled={isStartingGroupBuy}
          color="blue"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  productImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
  productDescription: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  originalPrice: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  discountPrice: {
    color: "red",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
});

export default ProductDetails;