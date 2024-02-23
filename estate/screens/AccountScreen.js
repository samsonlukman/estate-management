// AccountScreen.js
import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import Account from '../components/Account';

const AccountScreen = ({ navigation }) => {
  return (
    <ScrollView>
      <View>
        <Text>Account Screen</Text>
        <Account navigation={navigation} />
      </View>
    </ScrollView>
  );
};

export default AccountScreen;
