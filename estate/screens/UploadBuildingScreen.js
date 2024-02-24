import React, { useState, useEffect } from 'react';
import { ScrollView, Text, Switch, View, StyleSheet, Button, Alert, TextInput, Image } from 'react-native';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';

const propertyTypes = [
  { label: 'Sale', value: 'sale' },
  { label: 'Rent', value: 'rent' },
  { label: 'Lease', value: 'lease' },
];

const buildingTypes = [
  { label: 'Apartment', value: 'apartment' },
  { label: 'Flats', value: 'flats' },
  { label: 'Villa', value: 'villa' },
  { label: 'Bungalow', value: 'bungalow' },
  { label: 'Penthouse', value: 'penthouse' },
  { label: 'Room and Parlour', value: 'room_and_parlour' },
  { label: 'Duplex', value: 'duplex' },
  { label: 'Townhouse/Terrace', value: 'townhouse_terrace' },
  { label: 'Shared Apartments', value: 'shared_apartments' },
];

const conditions = [
  { label: 'Old', value: 'old' },
  { label: 'Newly Built', value: 'newly_built' },
  { label: 'Renovated', value: 'renovated' },
];

const furnishings = [
  { label: 'Fully Furnished', value: 'fully_furnished' },
  { label: 'Unfurnished', value: 'unfurnished' },
  { label: 'Semi-Furnished', value: 'semi_furnished' },
];

const UploadBuildingScreen = ({ navigation }) => {
  const [propertyType, setPropertyType] = useState(propertyTypes[0].value);
  const [buildingType, setBuildingType] = useState(buildingTypes[0].value);
  const [condition, setCondition] = useState(conditions[0].value);
  const [furnishing, setFurnishing] = useState(furnishings[0].value);
  const [bedrooms, setBedrooms] = useState('0');
  const [bathrooms, setBathrooms] = useState('0');
  const [toilets, setToilets] = useState('0');
  const [swimmingPool, setSwimmingPool] = useState(false);
  const [highSpeedInternet, setHighSpeedInternet] = useState(false);
  const [gym, setGym] = useState(false);
  const [dishwasher, setDishwasher] = useState(false);
  const [wifi, setWifi] = useState(false);
  const [garage, setGarage] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const booleanFields = [
    { label: 'Swimming Pool', value: swimmingPool, setter: setSwimmingPool },
    { label: 'High-Speed Internet', value: highSpeedInternet, setter: setHighSpeedInternet },
    { label: 'Gym', value: gym, setter: setGym },
    { label: 'Dishwasher', value: dishwasher, setter: setDishwasher },
    { label: 'WiFi', value: wifi, setter: setWifi },
    { label: 'Garage', value: garage, setter: setGarage },
  ];

  const [ownerId, setOwnerId] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      const fileName = result.assets[0].uri.split('/').pop();

      setProfileImage({
        uri: result.assets[0].uri,
        type: 'image/jpeg', // Set the correct MIME type for the image
        name: fileName,
      });

      console.log('Selected Profile Picture:', fileName);
    }
  };

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

      // Create a JSON object with the form data
      const formData = {
        property_owner: ownerId,
        name,
        price,
        property_type: propertyType,
        building_type: buildingType,
        condition,
        furnishing,
        bedrooms: parseInt(bedrooms, 10),
        bathrooms: parseInt(bathrooms, 10),
        toilets: parseInt(toilets, 10),
        swimming_pool: swimmingPool,  // Set boolean fields directly
        highspeed_internet: highSpeedInternet,
        gym,
        dishwasher,
        wifi,
        garage,
        // Append the image if available
      if (profileImage) {
        formData.append('image', profileImage);
      }
      };

      // Make the API request to upload the building
      const response = await axios.post('http://192.168.43.179:8000/api/upload/building/', formData, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
      });

      // Handle success or navigate back as needed
      console.log('Building uploaded successfully:', response.data);
      // navigation.goBack();
    } catch (error) {
      // Log the error response
      console.error('Error uploading building:', error.message, error.response?.data);

      // Display the error details if available
      if (error.response?.data && error.response.data.details) {
        Alert.alert('Error', JSON.stringify(error.response.data.details, null, 2));
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    }
  };

  const renderBooleanField = (item) => (
    <View style={styles.booleanFieldContainer} key={item.label}>
      <Text style={styles.label}>{item.label}</Text>
      <Switch
        value={item.value}
        onValueChange={(newValue) => item.setter(newValue)} // Handle onValueChange to set state
      />
    </View>
  );

  const renderPickerField = (label, value, setter, choices) => (
    <View style={styles.pickerFieldContainer} key={label}>
      <Text style={styles.label}>{label}</Text>
      <Picker
        selectedValue={value}
        onValueChange={(value) => setter(value)}
        style={styles.picker}
      >
        {choices.map((choice) => (
          <Picker.Item key={choice.value} label={choice.label} value={choice.value} />
        ))}
      </Picker>
    </View>
  );

  const renderTextField = (label, value, setter) => (
    <View style={styles.textFieldContainer} key={label}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={(text) => setter(text)}
        placeholder={`Enter ${label}`}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderTextField('Name', name, setName)}
      {renderTextField('Price', price, setPrice)}
      {renderTextField('Bedrooms', bedrooms, setBedrooms)}
      {renderTextField('Bathrooms', bathrooms, setBathrooms)}
      {renderTextField('Toilets', toilets, setToilets)}
      {booleanFields.map(renderBooleanField)}
      {renderPickerField('Property Type', propertyType, setPropertyType, propertyTypes)}
      {renderPickerField('Building Type', buildingType, setBuildingType, buildingTypes)}
      {renderPickerField('Condition', condition, setCondition, conditions)}
      {renderPickerField('Furnishing', furnishing, setFurnishing, furnishings)}
      {/* Add other fields as needed */}
      <Button title="Choose Profile Picture" onPress={handleImagePicker} />

      {profileImage && (
        <View style={styles.previewContainer}>
          <Text>Selected Profile Picture:</Text>
          <Image source={{ uri: profileImage.uri }} style={styles.previewImage} />
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Button title="Upload Property" onPress={handleUpload} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  booleanFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  pickerFieldContainer: {
    marginBottom: 15,
  },
  textFieldContainer: {
    marginBottom: 15,
  },
  picker: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
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
  previewContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  previewImage: {
    width: 100,
    height: 100,
    marginTop: 5,
  },
});

export default UploadBuildingScreen;
