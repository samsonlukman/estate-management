import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

const PropertyDisplay = () => {
  const [properties, setProperties] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
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
    axios
      .get('http://192.168.43.179:8000/api/buildings/')
      .then((response) => {
        setProperties(response.data);
      })
      .catch((error) => {
        console.error('Error fetching properties:', error);
      });

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
            { building: propertyId, user: loggedInUser.id  },
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

  const renderPropertyItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigateToPropertyDetail(item.id)}>
        <View style={styles.propertyItem}>
          <Image source={{ uri: item.image }} style={styles.propertyImage} />
          <View style={styles.propertyDetails}>
            <View style={styles.rowContainer}>
              <Text style={styles.propertyTitle}>{item.name}</Text>
              {user && user.isAuthenticated && (
                <View style={styles.iconContainer}>
                  <SaveUnsaveButton propertyId={item.id} />
                </View>
              )}
            </View>
            <Text style={styles.propertyPrice}>Price: ${item.price}</Text>    
            <Text style={styles.propertyOwner}>Country: {item.country}</Text>
            <Text style={styles.propertyOwner}>Type: {item.building_type}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
    borderRadius: 8,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: '#FFC46C',
    
  },
  propertyImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderRadius: 8,
    borderBottomLeftRadius: 80,
  },
  propertyDetails: {
    padding: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Keep icons left-aligned
  },
  iconContainer: {
    marginLeft: 8, // Adjust the margin as needed
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    flexShrink: 1, // Shrink if needed
    maxWidth: '80%', // Optional - limit title width 
  },
  propertyPrice: {
    fontSize: 16, 
  },
  propertyOwner: {
    fontSize: 14,
  },
  ownerProfileImage: {
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    marginTop: 5,
  },
});

export default PropertyDisplay;