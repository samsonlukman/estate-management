import React, { useState } from 'react';
import { ScrollView, Text, Switch, View, StyleSheet, Button, Alert, TextInput } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const choicesData = {
  propertyTypes: [
    { label: 'Sale', value: 'sale' },
    { label: 'Rent', value: 'rent' },
    { label: 'Lease', value: 'lease' },
  ],
  buildingTypes: [
    { label: 'Apartment', value: 'apartment' },
    { label: 'Flats', value: 'flats' },
    { label: 'Villa', value: 'villa' },
    { label: 'Bungalow', value: 'bungalow' },
    { label: 'Penthouse', value: 'penthouse' },
    { label: 'Room and Parlour', value: 'room_and_parlour' },
    { label: 'Duplex', value: 'duplex' },
    { label: 'Townhouse/Terrace', value: 'townhouse_terrace' },
    { label: 'Shared Apartments', value: 'shared_apartments' },
  ],
  conditions: [
    { label: 'Old', value: 'old' },
    { label: 'Newly Built', value: 'newly_built' },
    { label: 'Renovated', value: 'renovated' },
  ],
  furnishings: [
    { label: 'Fully Furnished', value: 'fully_furnished' },
    { label: 'Unfurnished', value: 'unfurnished' },
    { label: 'Semi-Furnished', value: 'semi_furnished' },
  ],
};

const UploadBuildingScreen = ({ navigation }) => {
  const [propertyType, setPropertyType] = useState('sale');
  const [buildingType, setBuildingType] = useState('Penthouse');
  const [condition, setCondition] = useState('');
  const [furnishing, setFurnishing] = useState('');
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

  const handleUpload = async () => {
    try {
      // Fetch CSRF token
      const csrfResponse = await axios.get('http://192.168.43.179:8000/api/get-csrf-token/');
      const csrfToken = csrfResponse.data.csrf_token;

      // Create a JSON object with the form data
      const formData = {
        name,
        price,
        property_type: propertyType,
        building_type: buildingType,
        condition,
        furnishing,
        bedrooms: parseInt(bedrooms, 10),
        bathrooms: parseInt(bathrooms, 10),
        toilets: parseInt(toilets, 10),
        swimming_pool: swimmingPool,
        highspeed_internet: highSpeedInternet,
        gym,
        dishwasher,
        wifi,
        garage,
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
      // Handle errors
      console.error('Error uploading building:', error.message);
    }
  };

  const renderBooleanField = (item) => (
    <View style={styles.booleanFieldContainer} key={item.label}>
      <Text style={styles.label}>{item.label}</Text>
      <Switch value={item.value} onValueChange={() => item.setter(!item.value)} />
    </View>
  );

  const renderPickerField = (item) => (
    <View style={styles.pickerFieldContainer} key={item.label}>
      <Text style={styles.label}>{item.label}</Text>
      <Picker
        selectedValue={item.value}
        onValueChange={(value) => item.setter(value)}
        style={styles.picker}
      >
        {choicesData[item.label.toLowerCase()] ? (
          choicesData[item.label.toLowerCase()].map((choice) => (
            <Picker.Item key={choice.value} label={choice.label} value={choice.value} />
          ))
        ) : (
          <Picker.Item label="No options available" value="" />
        )}
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
      {renderPickerField({ label: 'Property Type', value: propertyType, setter: setPropertyType })}
      {renderPickerField({ label: 'Building Type', value: buildingType, setter: setBuildingType })}
      {renderPickerField({ label: 'Condition', value: condition, setter: setCondition })}
      {renderPickerField({ label: 'Furnishing', value: furnishing, setter: setFurnishing })}
      {/* Add other fields as needed */}
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
});

export default UploadBuildingScreen;
