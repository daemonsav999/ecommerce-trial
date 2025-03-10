import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigation = useNavigation(); // ✅ Use React Navigation instead of react-router-dom

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(items);
  }, []);

  const updateCart = (items) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const increaseQuantity = (id) => {
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cartItems
      .map(item => item.id === id ? { ...item, quantity: item.quantity - 1 } : item)
      .filter(item => item.quantity > 0);
    updateCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    updateCart(updatedCart);
  };

  const checkout = () => {
    Alert.alert("✅ Proceeding to Checkout!");
    navigation.navigate("Checkout"); // ✅ Use React Navigation
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>🛒 Shopping Cart</Text>

      {cartItems.length === 0 ? (
        <Text>Your cart is empty. <TouchableOpacity onPress={() => navigation.navigate("Home")}><Text style={{ color: "blue" }}>Go Shopping</Text></TouchableOpacity></Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View>
                <Text style={{ fontSize: 18 }}>{item.name}</Text>
                <Text>Price: ${item.price}</Text>
                {item.isGroupBuy && (
                  <Text style={{ color: "green" }}>🌟 Group Buy Order - ID: {item.groupOrderId}</Text>
                )}
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                  <TouchableOpacity onPress={() => decreaseQuantity(item.id)} style={{ backgroundColor: "gray", padding: 8, borderRadius: 5, marginHorizontal: 5 }}>
                    <Text style={{ color: "white" }}>➖</Text>
                  </TouchableOpacity>
                  <Text>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => increaseQuantity(item.id)} style={{ backgroundColor: "gray", padding: 8, borderRadius: 5, marginHorizontal: 5 }}>
                    <Text style={{ color: "white" }}>➕</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress={() => removeItem(item.id)} style={{ backgroundColor: "red", padding: 10, borderRadius: 5 }}>
                <Text style={{ color: "white" }}>❌ Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {cartItems.length > 0 && (
        <TouchableOpacity onPress={checkout} style={{ backgroundColor: "blue", padding: 15, borderRadius: 5, marginTop: 20 }}>
          <Text style={{ color: "white", textAlign: "center" }}>Proceed to Checkout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CartScreen;
