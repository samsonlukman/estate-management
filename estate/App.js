// Your React Native component

import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import axios from 'axios';

const YourComponent = () => {
  useEffect(() => {
    // GET request
    axios.get('http://192.168.43.179:8000/categories/')
      .then(response => {
        console.log('Properties:', response.data);
        // Handle the properties data in your component state
      })
      .catch(error => {
        console.error('Error fetching properties:', error);
      });

    // POST request (assuming you have property data to send)
    const newProperty = 
    
      {
          "name": "three bedroom'"
      }
  

    axios.post('http://192.168.43.179:8000/categories/', newProperty)
      .then(response => {
        console.log('New Property created:', response.data);
        // Handle the newly created property data in your component state
      })
      .catch(error => {
        console.error('Error creating property:', error);
      });
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <View>
      <Text>Your Component</Text>
      {/* Render your component content here */}
    </View>
  );
};

export default YourComponent;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
