import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const LandDisplay = () => {
  const [properties, setProperties] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://192.168.43.179:8000/api/get-csrf-token/');
        setCsrfToken(response.data.csrf_token);
      } catch (error) {
        console.error('Error fetching CSRF token:', error.message);
      }
    };

    fetchCsrfToken();
  }, []);

  useEffect(() => {
    const fetchLandsAndImages = async () => {
      try {
        const landResponse = await axios.get('http://192.168.43.179:8000/api/land/');
        const landImagesResponse = await axios.get('http://192.168.43.179:8000/api/land-images/'); // Fetch all images

        const propertiesWithImages = landResponse.data.map((landItem) => {
          const relatedImages = landImagesResponse.data.filter(
            (image) => image.land === landItem.id
          );

          return {
            ...landItem,
            images: relatedImages.map((imageItem) => imageItem.image), // Extract image URLs
          };
        });

        setProperties(propertiesWithImages);
      } catch (error) {
        console.error('Error fetching lands and images:', error);
      }
    };

    fetchLandsAndImages();

    if (user && user.isAuthenticated) {
      axios
        .get('http://192.168.43.179:8000/api/user/', {
          headers: {
            'X-CSRFToken': csrfToken,
          },
        })
        .then((response) => {
          setLoggedInUser(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user details:', error);
        });
    }
  }, [user, csrfToken]);


  const navigateToPropertyDetail = (propertyId) => {
    navigation.navigate('Land Detail', { propertyId });
  };

  
  const SaveUnsaveButton = ({ propertyId }) => {
    const [isSaved, setIsSaved] = useState(false);

    const handleToggleSaveProperty = async () => {
      try {
        if (isSaved) {
          Alert.alert("Saved")
        } else {
          await axios.post(
            'http://192.168.43.179:8000/api/saved-land/',
            { land: propertyId, user: loggedInUser.id },
            { headers: { 'X-CSRFToken': csrfToken } }
          );
        }
        setIsSaved(!isSaved);
      } catch (error) {
        console.error('Error saving/unsaving property:', error.message);
      }
    };

    return (
      <TouchableOpacity onPress={handleToggleSaveProperty}>
        <Icon name='heart' size={40} color='red' />
      </TouchableOpacity>
    );
  };

  const renderCarouselItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.carouselImage} />
  );

  const renderPropertyItem = ({ item }) => (
    
      <View style={styles.propertyItem}>
        <Carousel
          data={item.images}
          renderItem={renderCarouselItem}
          sliderWidth={300} 
          itemWidth={300} 
          onSnapToItem={(index) => setActiveImageIndex(index)}
        />
        <Pagination
          dotsLength={item.images.length}
          activeDotIndex={activeImageIndex}
          containerStyle={styles.paginationContainer}
          dotStyle={styles.paginationDot}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      <TouchableOpacity onPress={() => navigateToPropertyDetail(item.id)}>
<         View style={styles.propertyDetails}>
          <View style={styles.titleContainer}>
            <Text style={styles.propertyTitle}>{item.name}</Text>
            {user && user.isAuthenticated && (
              <View style={styles.iconContainer}>
                <SaveUnsaveButton propertyId={item.id} />
              </View>
            )}
          </View>
          <Text style={styles.propertyPrice}>Price: ${item.price}</Text>
          <Text>
            Country: {item.country}
          </Text>
        </View>
        </TouchableOpacity>
      </View>
   
  );

  return (
    <View style={styles.container}>
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
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  propertyItem: {
    marginBottom: 20,
    backgroundColor: '#FFC46C', 
    borderRadius: 8,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3, 
  },
  carouselImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  paginationContainer: {
    paddingVertical: 10, // Add spacing around the pagination
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3, // Space between dots
    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  iconContainer: {
    marginLeft: 8,
  },
  propertyImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  propertyDetails: {
    padding: 10,
    maxWidth: '100%', // Set the maximum width for property details
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    maxWidth: '70%', // Set the maximum width for property title
  },
  propertyPrice: {
    fontSize: 16,
    color: '#333',
    maxWidth: '70%', // Set the maximum width for property price
  },
  propertyOwner: {
    fontSize: 14,
    color: '#777',
    maxWidth: '70%', // Set the maximum width for property owner
  },
});

export default LandDisplay;
