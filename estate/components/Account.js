import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Account = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [userInfo, setUserInfo] = useState(null);

  const handleUploadProperty = () => {
    navigation.navigate('UploadProperty');
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://192.168.43.179:8000/api/user/');
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    if (user && user.isAuthenticated) {
      fetchUserInfo();
    }
  }, [user]);

  useEffect(() => {
    console.log('User Info:', userInfo);
  }, [userInfo]);

  return (
    <View style={styles.container}>
      {userInfo !== null ? (
        <View style={styles.userInfo}>
          {userInfo.profile_pics ? (
            <Image source={{ uri: userInfo.profile_pics }} style={styles.profileImage} />
          ) : null}
          <View>
            <Text style={styles.username}>{userInfo.username}</Text>
            <Text style={styles.email}>{userInfo.email}</Text>
          </View>
          <Button
            title="Logout"
            onPress={() => {
              logout();
              navigation.navigate('Login');
            }}
          />
           <Button title="Upload Property" onPress={handleUploadProperty} />
        </View>
      ) : (
        <View style={styles.notLoggedIn}>
          <Text>You don't have an account. Log In/Sign Up here.</Text>
          <Button
            title="Log In/Sign Up"
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: 180, // Adjust height as needed
    resizeMode: 'cover', // Stretch image to fit container
    borderRadius: 8,
    backgroundColor: 'red'
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#777',
  },
  notLoggedIn: {
    alignItems: 'center',
  },
});

export default Account;
