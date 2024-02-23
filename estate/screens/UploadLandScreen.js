import React, { useState, useEffect } from 'react';
import { ScrollView, Text, Button, Alert, TextInput, View, StyleSheet } from 'react-native';
import axios from 'axios';

const UploadLandScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [ownerId, setOwnerId] = useState(null);

  // Fetch the logged-in user's information when the component mounts
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Make a request to your authentication system to get the user information
        // Modify this URL to match your authentication endpoint
        const userInfoResponse = await axios.get('http://192.168.43.179:8000/api/user/');

        // Set the owner ID based on the retrieved user information
        console.log(userInfoResponse.data.id)
        setOwnerId(userInfoResponse.data.id);
      } catch (error) {
        console.error('Error fetching user information:', error.message);
      }
    };

    // Call the function to fetch user information
    fetchUserInfo();
  }, []);

  const handleUpload = async () => {
    try {
      // Fetch CSRF token
      const csrfResponse = await axios.get('http://192.168.43.179:8000/api/get-csrf-token/');
      const csrfToken = csrfResponse.data.csrf_token;

      // Create a JSON object with the form data, including the owner ID
      const formData = {
        name,
        price,
        description,
        owner: ownerId,
      };

      // Make the API request to upload the land
      const response = await axios.post('http://192.168.43.179:8000/api/upload/land/', formData, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
      });

      // Handle success or navigate back as needed
      console.log('Land uploaded successfully:', response.data);
      // navigation.goBack();
    } catch (error) {
      // Log the error response
      console.error('Error uploading land:', error.message, error.response?.data);

      // Display the error details if available
      if (error.response?.data && error.response.data.details) {
        Alert.alert('Error', JSON.stringify(error.response.data.details, null, 2));
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.textInput}
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder="Enter Name"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Price</Text>
        <TextInput
          style={styles.textInput}
          value={price}
          onChangeText={(text) => setPrice(text)}
          placeholder="Enter Price"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textInput}
          value={description}
          onChangeText={(text) => setDescription(text)}
          placeholder="Enter Description"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Upload Land" onPress={handleUpload} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
  label: {
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default UploadLandScreen;
