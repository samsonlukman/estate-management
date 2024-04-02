import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const PropertyDetail = ({ route }) => {
  const [property, setProperty] = useState(null);
  const { user } = useAuth();
  const propertyId = route.params.propertyId;
  const navigation = useNavigation();
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      try {
        const response = await axios.get(
          `http://192.168.43.179:8000/api/land/${propertyId}`
        );
        setProperty(response.data);
      } catch (error) {
        console.error('Error fetching property detail:', error);
      }
    };

    const fetchLandImages = async () => {
      try {
        const imagesResponse = await axios.get(`http://192.168.43.179:8000/api/land-images/?land=${propertyId}`);
        const filteredImages = imagesResponse.data
          .filter(image => image.land === propertyId)
          .map(image => image.image);
        setImages(filteredImages);
      } catch (error) {
        console.error('Error fetching land images:', error);
      }
    };

    fetchPropertyDetail();
    fetchLandImages();
  }, [propertyId]);

  const handleContactUser = () => {
    // Logic to handle contacting the user
    // For demonstration purposes, let's just toggle the modal visibility
    setContactModalVisible(!contactModalVisible);
  };

  const propertyInfoData = [
   
    { key: 'owner', label: 'Owner:', value: property?.owner.username },
    { key: 'country', label: 'Country:', value: property?.country },
    { key: 'phoneNumber', label: 'Phone Number:', value: property?.owner.phone_number },
    { key: 'datePosted', label: 'Date Posted:', value: property?.date_posted?.substring(0, 10) },
    { key: 'price', label: 'Price', value: property?.price},
    { key: 'description', label: 'Description:', value: property?.description },

  ];

  const renderPropertyInfoItem = ({ item }) => {
    if (item.key === 'phoneNumber' && (!user || !user.isAuthenticated)) {
      return (
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginButton}>Login to see owner's phone number</Text>
        </TouchableOpacity>
      );
    } else if (item.key === 'phoneNumber' && user && user.isAuthenticated) {
      return (
        <View style={styles.detailRow}>
          <Icon name="phone" size={16} style={styles.detailIcon} />
          <TouchableOpacity onPress={handleContactUser}>
            <Text style={[styles.detailText, styles.contactButton]}>Contact User</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.detailRow}>
        <Icon name={item.key === 'description' ? 'align-left' : 'user'} size={16} style={styles.detailIcon} />
        <Text style={styles.detailText}>
          {item.label} {item.value}
        </Text>
      </View>
    );
  };

  return (
    <View>
       <Carousel
          data={images}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.propertyImage} />
          )}
          sliderWidth={350}
          itemWidth={350}
          onSnapToItem={(index) => setActiveImageIndex(index)}
        />
        <Pagination
          dotsLength={images.length}
          activeDotIndex={activeImageIndex}
          containerStyle={styles.paginationContainer}
          dotStyle={styles.paginationDot}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      <Text style={styles.propertyTitle}>{property?.name}</Text>
      <FlatList
        data={propertyInfoData}
        renderItem={renderPropertyInfoItem}
        keyExtractor={(item) => item.key}
      />

      {/* Modal for displaying user information */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={contactModalVisible}
        onRequestClose={() => setContactModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Contact Information</Text>
            <Text style={styles.modalText}>Username: {property?.owner.username}</Text>
            <Text style={styles.modalText}>Phone Number: {property?.owner.phone_number}</Text>
            <Text style={styles.modalText}>Email: {property?.owner.email}</Text>
            {/* Add more user information here */}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setContactModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFC46C',
  },
  propertyImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    objectFit: 'contain',
    borderRadius: 8,
    marginBottom: 20,
  },
  propertyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: -20,
    paddingLeft: 10
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingLeft: 10
  },
  detailIcon: {
    marginRight: 5,
  },
  detailText: {
    flex: 1,
  },
  loginButton: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  contactButton: {
    color: 'green',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 10,
  },
  modalCloseButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    color: 'white',
    fontWeight: 'bold',
  },
  paginationContainer: {
    paddingVertical: 6,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
});

export default PropertyDetail;
