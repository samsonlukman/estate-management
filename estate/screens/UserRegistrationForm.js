import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';

const UserRegistrationForm = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
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

  const onSubmit = async (data) => {
    try {
      const csrfResponse = await axios.get('http://192.168.43.179:8000/api/get-csrf-token/');
      const csrfToken = csrfResponse.data.csrf_token;

      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('about', data.about);
      formData.append('email', data.email);
      formData.append('phone_number', data.phone_number);
      formData.append('password', data.password);

      // Append the image if available
      if (profileImage) {
        formData.append('profile_pics', profileImage);
      }

      const response = await axios.post('http://192.168.43.179:8000/api/register/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': csrfToken,
        },
      });

      Alert.alert('Registration Successful', 'User registered successfully');
      navigation.navigate('Login');
    } catch (error) {
      if (error.response && error.response.data) {
        Alert.alert('Registration Error', error.response.data.detail);
      } else {
        console.error('Registration error:', error.message);
      }
    }
  };
  return (
    <View style={styles.container}>
      <Text>User Registration</Text>

<Controller
  control={control}
  render={({ field }) => (
    <TextInput placeholder="Username" onChangeText={(text) => field.onChange(text)} />
  )}
  name="username"
  rules={{ required: 'Username is required' }}
/>
{errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

<Controller
  control={control}
  render={({ field }) => (
    <TextInput
      placeholder="Password"
      secureTextEntry
      onChangeText={(text) => field.onChange(text)}
    />
  )}
  name="password"
  rules={{ required: 'Password is required' }}
/>
{errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

<Controller
  control={control}
  render={({ field }) => (
    <TextInput placeholder="First Name" onChangeText={(text) => field.onChange(text)} />
  )}
  name="first_name"
  rules={{ required: 'First Name is required' }}
/>
{errors.first_name && <Text style={styles.errorText}>{errors.first_name.message}</Text>}

<Controller
  control={control}
  render={({ field }) => (
    <TextInput placeholder="Last Name" onChangeText={(text) => field.onChange(text)} />
  )}
  name="last_name"
  rules={{ required: 'Last Name is required' }}
/>
{errors.last_name && <Text style={styles.errorText}>{errors.last_name.message}</Text>}

<Controller
  control={control}
  render={({ field }) => (
    <TextInput
      placeholder="Email"
      onChangeText={(text) => field.onChange(text)}
      keyboardType="email-address"
    />
  )}
  name="email"
  rules={{ required: 'Email is required' }}
/>
{errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

<Controller
  control={control}
  render={({ field }) => (
    <TextInput
      placeholder="Phone Number"
      onChangeText={(text) => field.onChange(text)}
      keyboardType="numeric"
    />
  )}
  name="phone_number"
  rules={{ required: 'Phone Number is required' }}
/>
{errors.phone_number && <Text style={styles.errorText}>{errors.phone_number.message}</Text>}

<Controller
  control={control}
  render={({ field }) => (
    <TextInput placeholder="About" onChangeText={(text) => field.onChange(text)} />
  )}
  name="about"
/>

<Button title="Choose Profile Picture" onPress={handleImagePicker} />

{profileImage && (
  <View style={styles.previewContainer}>
    <Text>Selected Profile Picture:</Text>
    <Image source={{ uri: profileImage.uri }} style={styles.previewImage} />
  </View>
)}

<Button title="Register" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
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

export default UserRegistrationForm;
