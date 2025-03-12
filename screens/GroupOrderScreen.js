import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import io from "socket.io-client";
import axios from "axios"; // Ensure this import is correct

const socket = io("http://localhost:5000"); // Backend server URL

const GroupOrderScreen = ({ route }) => {
  const { id } = route.params; // Use `route.params` to get the `id` passed from navigation
  const [groupOrder, setGroupOrder] = useState(null);

  useEffect(() => {
    // Fetch group order details
    axios.get(`http://localhost:5000/api/groupbuy/${id}`)
      .then((res) => setGroupOrder(res.data))
      .catch((err) => console.error("Error fetching group order:", err));

    // Join the group order room
    socket.emit("joinGroupOrder", id);

    // Listen for updates to the group order
    socket.on("groupOrderUpdated", (updatedOrder) => {
      if (updatedOrder.id === id) {
        setGroupOrder(updatedOrder);
      }
    });

    // Clean up socket listener
    return () => {
      socket.off("groupOrderUpdated");
    };
  }, [id]);

  if (!groupOrder) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join a Group Buy</Text>
      <Text>Product: {groupOrder.product.name}</Text>
      <Text>
        Members: {groupOrder.members.length}/{groupOrder.targetSize}
      </Text>
      <View style={styles.progressBar}>
        <View
          style={{
            width: `${(groupOrder.members.length / groupOrder.targetSize) * 100}%`,
            height: "100%",
            backgroundColor: "green",
          }}
        />
      </View>
      <Text>Status: {groupOrder.status}</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  progressBar: {
    height: 10,
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginVertical: 10,
    overflow: "hidden",
  },
});

export default GroupOrderScreen;