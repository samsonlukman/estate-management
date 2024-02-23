import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Favorites = () => {
  return (
    <View style={styles.container}>
      <Text>Favorites Screen</Text>
      {/* Add your favorite items or functionality here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Favorites;
