import React, { useState, useEffect } from 'react';
import { View, Button, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

const PropertyDisplay = () => {
  const [properties, setProperties] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  useEffect(() => {
    // Fetch properties from the backend
    axios
      .get('http://192.168.43.179:8000/api/buildings/')
      .then((response) => {
        setProperties(response.data);
      })
      .catch((error) => {
        console.error('Error fetching properties:', error);
      });

    // Fetch user details if authenticated
    if (user && user.isAuthenticated) {
      axios
        .get('http://192.168.43.179:8000/api/user/')
        .then((response) => {
          setLoggedInUser(response.data);
          console.log(response.data)
        })
        .catch((error) => {
          console.error('Error fetching user details:', error);
        });
    }
  }, [user]);

  const navigateToPropertyDetail = (propertyId) => {
    navigation.navigate('PropertyDetail', { propertyId });
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const renderPropertyItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToPropertyDetail(item.id)}>
      <View style={styles.propertyItem}>
        <Image source={{ uri: item.image }} style={styles.propertyImage} />
        <View style={styles.propertyDetails}>
          <Text style={styles.propertyTitle}>{item.name}</Text>
          <Text style={styles.propertyPrice}>Price: ${item.price}</Text>
          <Text style={styles.propertyOwner}>
            Owner: {item.property_owner.first_name} {item.property_owner.last_name}
          </Text>
          

        </View>
      </View>
    </TouchableOpacity>
    
  );

  return (
    <View style={styles.container}>
      {user && user.isAuthenticated ? (
        <Button title="Sign Out" onPress={logout} />
      ) : (
        <Button title="Sign In" onPress={navigateToLogin} />
      )}
        <View>
  {user && user.isAuthenticated && loggedInUser && (
    <Text style={styles.propertyOwner}>
      Logged in as: {loggedInUser.username}
    </Text>
  )}
</View>
      <FlatList
        data={properties}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPropertyItem}
      />
   

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2', // Light gray background
    padding: 20,
  },
  propertyItem: {
    marginBottom: 20, // Spacing between properties
    borderRadius: 8, // Rounded corners for a softer look
    shadowColor: '#ccc', // Subtle shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3, // Additional elevation for iOS
    backgroundColor: '#fff', // White background
  },
  propertyImage: {
    width: '100%',
    height: 180, // Adjust height as needed
    resizeMode: 'cover', // Stretch image to fit container
    borderRadius: 8, // Rounded corners for image
  },
  propertyDetails: {
    padding: 10, // Padding for better text readability
  },
  propertyTitle: {
    fontSize: 18, // Bold title
    fontWeight: 'bold',
    marginBottom: 5, // Small margin below title
  },
  propertyPrice: {
    fontSize: 16, // Slightly smaller price
    color: '#333', // Grayish color for price
  },
  propertyOwner: {
    fontSize: 14, // Smallest text for owner info
    color: '#777', // Faded text color for owner info
  },
});

export default PropertyDisplay;
