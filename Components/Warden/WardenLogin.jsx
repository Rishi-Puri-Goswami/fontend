import React, { useEffect, useState } from 'react';
import { 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Text, 
  Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // ✅ Correct import
import { API_URL } from "@env";
import { useNavigation, CommonActions } from '@react-navigation/native';

const WardenLogin = () => {
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation(); 
console
.log("API_URL => ",API_URL)
  const HandelLogin = async () => {
    if (!phoneNo) {
      return Alert.alert("Enter the phone number");
    }
    if (!password) {
      return Alert.alert("Enter the password");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/warden/login`,
        { phoneNo, password },
        { withCredentials: true }
      );

      if (res.data?.token) {
        await AsyncStorage.setItem("token", res.data.token);

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'WardenPage' }],
          })
        );
      } else {
        setError(res.data?.message || "Login failed.");
      }
    } catch (err) {
      console.log("error on login user", err);
      setError("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Auto check token on app load

  useEffect(() => {
    const checktoken = async () => {
      try {
        // AsyncStorage.clear()
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          return console.log("no token, warden must login");
        }

        const decode = jwtDecode(token);
        const currenttime = Date.now() / 1000;

        if (decode.exp < currenttime) {
          await AsyncStorage.removeItem("token");
          return;
        }

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'WardenPage' }],
          })
        );
      } catch (err) {
        console.log("error on check token", err);
      }              
    };

    checktoken();
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-neutral-900 p-2"
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <View className="absolute w-full h-full bg-neutral-700 rotate-45" />

      <View className="max-w-md w-full bg-black p-5 rounded-xl z-10 shadow-md shadow-black space-y-8">
        <View>
          <Text className="mt-6 text-center text-3xl font-extrabold text-neutral-600">
            Login as a{' '}
            <Text className="text-white">Warden</Text>
          </Text>
        </View>

        <View className="mt-8 space-y-6">
          {/* Phone Number Input */}
          <View className="mb-4">
            <TextInput
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={phoneNo}
              onChangeText={setPhoneNo}
              className="bg-neutral-900 border border-black rounded-md px-3 py-2 text-white placeholder:text-neutral-400 shadow-md"
            />
          </View>

          {/* Password Input */}
          <View className="mb-4">
            <TextInput
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              className="bg-neutral-900 border border-black rounded-md px-3 py-2 text-white placeholder:text-neutral-400 shadow-md"
            />
          </View>

          {/* Error Message */}
          {error ? (
            <Text className="text-red-500 text-sm text-center">{error}</Text>
          ) : null}

          {/* Submit Button */}
          <TouchableOpacity
            onPress={HandelLogin}
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white bg-yellow-500 justify-center items-center ${
              loading ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-white text-sm font-medium">
              {loading ? 'Signing in...' : 'Sign in'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Register Redirect */}
      <View className="absolute bottom-2 flex-row">
        <Text className="text-neutral-400 text-lg">Create an account? </Text>
        <Text
          className="text-yellow-500 text-lg"
          onPress={() =>
            navigation.navigate("Register") // ✅ Correct way in React Navigation
          }
        >
          Register
        </Text>
      </View>
    </ScrollView>
  );
};

export default WardenLogin;
