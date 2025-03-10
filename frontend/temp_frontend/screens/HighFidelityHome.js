import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Appbar, Button, Card, ProgressBar } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";

const HighFidelityHome = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Navigation Bar */}
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={() => {}} />
        <Appbar.Content title="DealMitra" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
        <Button mode="text" onPress={() => {}}>
          Login
        </Button>
        <Button mode="text" onPress={() => {}}>
          Register
        </Button>
      </Appbar.Header>

      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <Image
          source={{ uri: "https://via.placeholder.com/400x200" }}
          style={styles.heroImage}
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Big Deals Await!</Text>
          <Text style={styles.heroSubtitle}>
            Limited-time offers – join group buys for massive discounts.
          </Text>
          <Button
            mode="contained"
            onPress={() => {}}
            style={styles.heroButton}
          >
            Shop Now
          </Button>
        </View>
      </View>

      {/* Quick Access Categories */}
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access Categories</Text>
          <View style={styles.categoryContainer}>
            {[
              { label: "Electronics", icon: "devices" },
              { label: "Fashion", icon: "checkroom" },
              { label: "Groceries", icon: "shopping-cart" },
              { label: "Home", icon: "home" },
            ].map((cat, index) => (
              <TouchableOpacity key={index} style={styles.categoryItem}>
                <Icon name={cat.icon} size={30} color="#6200ee" />
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Flash Deals & Group Buying Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flash Deals & Group Buying</Text>
          <View style={styles.productContainer}>
            {[
              { title: "Product 1", joined: "3/5 joined", progress: 0.6 },
              { title: "Product 2", joined: "4/5 joined", progress: 0.8 },
              { title: "Product 3", joined: "2/5 joined", progress: 0.4 },
            ].map((product, index) => (
              <Card key={index} style={styles.productCard}>
                <Card.Cover
                  source={{ uri: "https://via.placeholder.com/150" }}
                />
                <Card.Content>
                  <Text variant="titleLarge">{product.title}</Text>
                  <ProgressBar
                    progress={product.progress}
                    color="#6200ee"
                    style={styles.progressBar}
                  />
                  <Text variant="bodyMedium">{product.joined}</Text>
                </Card.Content>
                <Card.Actions>
                  <Button mode="contained" onPress={() => {}}>
                    Join Now
                  </Button>
                </Card.Actions>
              </Card>
            ))}
          </View>
        </View>

        {/* Recommended Products Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Products</Text>
          <View style={styles.productContainer}>
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} style={styles.productCard}>
                <Card.Cover
                  source={{ uri: "https://via.placeholder.com/150" }}
                />
                <Card.Content>
                  <Text variant="titleLarge">Product {item}</Text>
                  <Text variant="bodyMedium">₹{(item * 100) + 99}</Text>
                </Card.Content>
                <Card.Actions>
                  <Button mode="contained" onPress={() => {}}>
                    Buy Now
                  </Button>
                </Card.Actions>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Chat Button */}
      <TouchableOpacity style={styles.chatButton}>
        <Icon name="chat" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © {new Date().getFullYear()} DealMitra. All rights reserved.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  heroBanner: {
    height: 200,
    position: "relative",
    marginBottom: 16,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
  },
  heroButton: {
    backgroundColor: "#6200ee",
  },
  section: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryItem: {
    alignItems: "center",
  },
  categoryLabel: {
    marginTop: 8,
  },
  productContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
    marginBottom: 16,
  },
  progressBar: {
    marginVertical: 8,
  },
  chatButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#6200ee",
    borderRadius: 30,
    padding: 12,
  },
  footer: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#666",
  },
});

export default HighFidelityHome;