import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const PropertyDisplay = () => {
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
    if (csrfToken && user && user.isAuthenticated) {
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
          console.error('Error fetching user details:', error.response ? error.response.data : error.message);
        });
    }
  }, [csrfToken, user]);

  useEffect(() => {
    const fetchBuildingsAndImages = async () => {
      if (loggedInUser) {
        try {
          const buildingResponse = await axios.get('http://192.168.43.179:8000/api/buildings/');
          const buildingImagesResponse = await axios.get('http://192.168.43.179:8000/api/building-images/');

          const filteredBuildings = buildingResponse.data.filter(
            (building) => building.country === loggedInUser.country
          );

          const propertiesWithImages = filteredBuildings.map((buildingItem) => {
            const relatedImages = buildingImagesResponse.data.filter(
              (image) => image.building === buildingItem.id
            );

            return {
              ...buildingItem,
              images: relatedImages.map((imageItem) => imageItem.image),
            };
          });

          setProperties(propertiesWithImages);
        } catch (error) {
          console.error('Error fetching buildings and images:', error.response ? error.response.data : error.message);
        }
      }
    };

    fetchBuildingsAndImages();
  }, [loggedInUser]);

  const navigateToPropertyDetail = (propertyId) => {
    navigation.navigate('PropertyDetail', { propertyId });
  };

  const SaveUnsaveButton = ({ propertyId }) => {
    const [isSaved, setIsSaved] = useState(false);

    const handleToggleSaveProperty = async () => {
      try {
        if (isSaved) {
          Alert.alert("Saved")
        } else {
          await axios.post(
            'http://192.168.43.179:8000/api/saved-properties/',
            { building: propertyId, user: loggedInUser.id },
            { headers: { 'X-CSRFToken': csrfToken } }
          );
        }
        setIsSaved(!isSaved);
      } catch (error) {
        Alert.alert('Alread Saved')
      }
    };

    return (
      <TouchableOpacity onPress={handleToggleSaveProperty}>
        <Icon name='heart' size={20} color='red' />
      </TouchableOpacity>
    );
  };

  const renderCarouselItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.buildingImage} />
  );

  const renderPropertyItem = ({ item }) => (
      <View style={styles.buildingItem}>
        <View style={styles.carouselContainer}>
          <Carousel
            data={item.images}
            renderItem={renderCarouselItem}
            sliderWidth={350} // Adjust as needed
            itemWidth={350} // Adjust as needed
            onSnapToItem={(index) => setActiveImageIndex(index)}
          />
        </View> 
        <Pagination
          dotsLength={item.images.length}
          activeDotIndex={activeImageIndex}
          containerStyle={styles.paginationContainer}
          dotStyle={styles.paginationDot}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        /> 
        <TouchableOpacity onPress={() => navigateToPropertyDetail(item.id)}>
        <View style={styles.propertyDetails}>
          <View style={styles.rowContainer}> 
            <Text style={styles.propertyTitle}>{item.name}</Text>
            {user && user.isAuthenticated && (
              <View style={styles.iconContainer}>
                <SaveUnsaveButton propertyId={item.id} />
              </View>
            )}
          </View>
          <Text style={styles.propertyPrice}>Price: {item.currency}{item.price}</Text>
          <Text style={styles.propertyCountry}>Country: {item.country}</Text>
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
    padding: 10,
  },
  buildingItem: {
    marginBottom: 20,
  backgroundColor: '#FFC46C',  
    borderRadius: 8,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3, 
    width: '100%',
    borderBottomLeftRadius: 60,
    paddingBottom: 20
    

  },
  carouselContainer: {
    width: '100%',
    height: 200, 
  },
  buildingImage: { 
    width: '100%',
    height: '100%', 
    resizeMode: 'cover', 
    borderBottomLeftRadius: 60, // Add these lines
  }, 
  paginationContainer: {
    paddingVertical: 2, 
  },
  paginationDot: {
    width: 4,
    height: 4,
    borderRadius: 4,
    marginHorizontal: 3, 
    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', 
  },
  iconContainer: {
    marginLeft: 8, 
  },
  propertyDetails: { 
    paddingLeft: 40
  }, 
  propertyTitle: {
    fontSize: 16, 
    fontWeight: 'bold',
  
    flexShrink: 1, 
    maxWidth: '80%', 
  },
  propertyPrice: {
    fontSize: 12,
    top: 5
  },
  propertyCountry: {
    fontSize: 12, 
    
  },
  propertyOwner: {
    fontSize: 14,
  },
});

export default PropertyDisplay;

