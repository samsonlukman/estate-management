import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  Alert, 
  Image, 
  ScrollView, 
  FlatList
} from 'react-native';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import countriesList from '../components/Countries'; // Assuming you have your countriesList

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

    if (!result.cancelled) {
      const fileName = result.assets[0].uri.split('/').pop();

      setProfileImage({
        uri: result.assets[0].uri,
        type: 'image/jpeg', // Set the correct MIME type for the image
        name: fileName,
      });
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

      formData.append('country', data.country);

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
        Alert.alert('Error: Check password(Min: 8 characters) and other fields.');
      } else {
        console.error('Registration error:', error.message);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <Controller
          control={control}
          render={({ field }) => (
            <TextInput 
              style={styles.inputField} 
              placeholder="Username" 
              onChangeText={(text) => field.onChange(text)} 
            />
          )}
          name="username"
          rules={{ required: 'Username is required' }}
        />
        {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

        <Controller
          control={control}
          render={({ field }) => (
            <TextInput
              style={styles.inputField}
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
            <TextInput
              style={styles.inputField}
              placeholder="First Name"
              onChangeText={(text) => field.onChange(text)}
            />
          )}
          name="first_name"
          rules={{ required: 'First Name is required' }}
        />
        {errors.first_name && <Text style={styles.errorText}>{errors.first_name.message}</Text>}

        <Controller
          control={control}
          render={({ field }) => (
            <TextInput
              style={styles.inputField}
              placeholder="Last Name"
              onChangeText={(text) => field.onChange(text)}
            />
          )}
          name="last_name"
          rules={{ required: 'Last Name is required' }}
        />
        {errors.last_name && <Text style={styles.errorText}>{errors.last_name.message}</Text>}

        <Controller
          control={control}
          render={({ field }) => (
            <TextInput
              style={styles.inputField}
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
              style={styles.inputField}
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
            <TextInput
              style={styles.inputField}
              placeholder="About"
              onChangeText={(text) => field.onChange(text)}
            />
          )}
          name="about"
          rules={{ required: 'About is required' }}
        />
        {errors.about && <Text style={styles.errorText}>{errors.about.message}</Text>}
      </View>

      <Button title="Choose Profile Picture" onPress={handleImagePicker} />
      {profileImage && ( 
        <View style={styles.previewContainer}>
          <Text>Selected Profile Picture:</Text>
          <Image source={{ uri: profileImage.uri }} style={styles.previewImage} />
        </View>
      )}

      <View style={styles.inputField}>
        <Text style={styles.label}>Country</Text>
        <Controller
          control={control}
          render={({ field }) => (
            <Picker
              selectedValue={field.value}
              onValueChange={(itemValue) => field.onChange(itemValue)}
              style={styles.picker}
            >
              {countriesList.map((country) => (
                <Picker.Item key={country} label={country} value={country} />
              ))}
            </Picker>
          )}
          name="country"
          rules={{ required: 'Country is required' }}
        />
        {errors.country && <Text style={styles.errorText}>{errors.country.message}</Text>}
      </View>

      <Button title="Register" onPress={handleSubmit(onSubmit)} />
    </ScrollView>
  );
};




const styles = StyleSheet.create({
 container: {
    flex: 1, 
    paddingLeft: 10,
    paddingRight: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20 
  },
  inputContainer: { 
    marginBottom: 15,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
   padding: 2,
    marginTop: 5
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
    width: 50,
    height: 50,
    marginTop: 5,
  },
});

export default UserRegistrationForm;
