import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(items);
  }, []);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = () => {
    Alert.alert("✅ Order placed successfully!");
    localStorage.removeItem("cart"); // Clear cart after order
    navigation.navigate("Home"); // Navigate back to Home
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Checkout</Text>
      {cartItems.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        <View>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text>Price: ${item.price} x {item.quantity}</Text>
              {item.isGroupBuy && <Text style={styles.groupBuyText}>🌟 Group Buy</Text>}
            </View>
          ))}
          <Text style={styles.totalAmount}>Total: ${totalAmount.toFixed(2)}</Text>
          <Button title="Place Order ✅" onPress={placeOrder} color="green" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  cartItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  groupBuyText: {
    color: "green",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
  },
});

export default CheckoutScreen;