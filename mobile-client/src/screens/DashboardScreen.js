import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const DashboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop Owner Dashboard</Text>
      <Button title="Manage Inventory" onPress={() => navigation.navigate('Inventory')} />
      <Button title="View Orders" onPress={() => navigation.navigate('Orders')} />
      {/* TODO: Add shop registration, statistics */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default DashboardScreen;
