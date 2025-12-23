import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OrdersScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>
      <Text>Incoming orders will appear here</Text>
      {/* TODO: Display orders with urgency indicators */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default OrdersScreen;
