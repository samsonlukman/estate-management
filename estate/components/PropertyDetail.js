import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../contexts/AuthContext'; // Import the useAuth hook
import { useNavigation } from '@react-navigation/native';

const PropertyDetail = ({ route }) => {
  const [property, setProperty] = useState(null);
  const { user } = useAuth(); // Use the useAuth hook to get the user object
  const propertyId = route.params.propertyId;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      try {
        const response = await axios.get(
          `http://192.168.43.179:8000/api/buildings/${propertyId}`
        );
        setProperty(response.data);
      } catch (error) {
        console.error('Error fetching property detail:', error);
        // Handle the error gracefully, e.g., display an error message to the user
      }
    };

    fetchPropertyDetail();
  }, [propertyId]);

  const renderAmenities = (amenity, name) => {
    const iconName = amenity ? 'check' : 'times'; // Dynamically choose icon based on value
    return (
      <Text style={styles.propertyDetailLabel} key={name}>
        <Icon name={iconName} size={16} style={{ marginRight: 5 }} />
        {name}: {amenity ? 'Yes' : 'No'}
      </Text>
    );
  };

  const renderPhoneNumberSection = () => {
    if (!property) return null;

    if (user && user.isAuthenticated) {
      return (
        <Text style={styles.propertyDetailLabel}>
          <Icon name="phone" size={16} style={{ marginRight: 5 }} /> Owner's phone number: {property.property_owner.phone_number}
        </Text>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginButton}>Login to see owner's phone number</Text>
        </TouchableOpacity>
      );
    }
  };

  const renderPropertyInfo = () => {
    if (!property) return null;

    return (
      <View>
        <Image source={{ uri: property.image }} style={styles.propertyImage} />
        <Text style={styles.propertyTitle}>{property.name}</Text>

        <View style={styles.propertyDetails}>
          <Text style={styles.propertyDetailLabel}>
            <Icon name="user" size={16} style={{ marginRight: 5 }} /> Owner:
            {property.property_owner.username}
          </Text>

          {renderPhoneNumberSection()}

          <Text style={styles.propertyDetailLabel}>
            <Icon name={property.property_type === 'sale' ? 'home' : 'home'} size={16} style={{ marginRight: 5 }} />
            {property.property_type} Price: {property.price}
          </Text>
          <Text style={styles.propertyDetailLabel}>
            <Icon name="building" size={16} style={{ marginRight: 5 }} /> Condition: {property.condition}
          </Text>
          <Text style={styles.propertyDetailLabel}>
            <Icon name="building" size={16} style={{ marginRight: 5 }} /> Type: {property.building_type}
          </Text>
          <Text style={styles.propertyDetailLabel}>
            <Icon name="calendar" size={16} style={{ marginRight: 5 }} /> Date Posted: {property.date_posted.substring(0, 10)}
          </Text>
          <Text style={styles.propertyDetailLabel}>
            <Icon name="bed" size={16} style={{ marginRight: 5 }} /> Bedrooms: {property.bedrooms}
          </Text>
          <Text style={styles.propertyDetailLabel}>
            <Icon name="bath" size={16} style={{ marginRight: 5 }} /> Bathrooms: {property.bathrooms}
          </Text>
          <Text style={styles.propertyDetailLabel}>
            <Icon name="" size={16} style={{ marginRight: 5 }} /> Toilets: {property.toilets}
          </Text>

          {renderAmenities(property.furnishing, 'Furnishing')}
          {renderAmenities(property.swimming_pool, 'Swimming Pool')}
          {renderAmenities(property.highspeed_internet, 'Highspeed Internet')}
          {renderAmenities(property.gym, 'Gym')}
          {renderAmenities(property.dishwasher, 'Dishwasher')}
          {renderAmenities(property.wifi, 'Wifi')}
          {renderAmenities(property.garage, 'Garage')}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderPropertyInfo()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  propertyImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  propertyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  propertyDetails: {
    marginBottom: 20,
  },
  propertyDetailLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center', // Align icons and text vertically
  },
  loginButton: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
});

export default PropertyDetail;
