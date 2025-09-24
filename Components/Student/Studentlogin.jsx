import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import {API_URL} from "@env"
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
import {jwtDecode} from "jwt-decode"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

const Studentlogin = () => {
      const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [loading, setLoading] = useState(false);

console.log(API_URL  , "api url" );

const navigate = useNavigation();

useEffect(() => {
  
  const checktoken = async () =>{
try {
  
      const token = await AsyncStorage.getItem("token");


      if(!token){
      return  console.log("no token student have to login");
      }
  
  console.log("token in stroage" , token);


  const decode = jwtDecode(token);
  
      console.log(decode , "decoded token");
      
      const currenttime = Date.now()/1000 ;
  
      if(decode.exp < currenttime){
  
        await AsyncStorage.removeItem("token");
        return;
  
      }


     navigate.dispatch(
  CommonActions.reset({
    index: 0,
    routes: [{ name: 'StudentPage' }],
  })
);



} catch (error) {
  console.log("error on check token" , error)
}


  }

checktoken();

}, [])



  const HandelLogin =   () =>{
console.log("running")
    if(!phoneNo){
      return Alert.alert("phone no is required")
    }

    if(!password){
      return Alert.alert("enter the password")
    }

    console.log(phoneNo)
    console.log(password)

    const loginuser = async () =>{

  
     try {
       
         
         console.log("login running")
   
         const req = await axios.post(`${API_URL}/user/login`,{
           phoneNo , password 
         } , {
           withCredentials : true 
        
         })
         
         

         if(req.data){
          console.log(req.data);
   Alert.alert(req.data.message)
           if(req.data.status === 200 ){
   
   if(req.data.token){
   
    console.log(req.data.token , "token from backend")

     const token = await AsyncStorage.setItem("token" , req.data.token);

   
   navigate.navigate("StudentPage");
   
   }
   
   
   
   
           }
   
         }
   
     } catch (error) {
      console.log("error on login user" , error)
     }
        
        
      }
  




    loginuser();


    
  }



   





  return (
    
 <ScrollView
      className="flex-1 bg-neutral-900 p-2"
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
    >

      <View className="absolute w-full h-full bg-neutral-700 rotate-45" />

  
      <View className="max-w-md w-full bg-black p-5 rounded-xl z-10 shadow-md shadow-black space-y-8">

        <View>
          <Text className="mt-6 text-center text-3xl font-extrabold text-neutral-600">
            Sign in to your{' '}
            <Text className="text-neutral-400">account {' '}</Text>
          </Text>
        </View>

        <View className="mt-8 space-y-6">

          <View className="mb-4  ">
            <TextInput
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={phoneNo}
              onChangeText={setPhoneNo}
              className="bg-neutral-900 border border-black rounded-md px-3 py-2 text-white placeholder:text-neutral-400 shadow-md"
            />
          </View>

 
          <View className="mb-4  ">
            <TextInput
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              className="bg-neutral-900 border border-black rounded-md px-3 py-2 text-white placeholder:text-neutral-400 shadow-md"
            />
          </View>


          {error && (
            <Text className="text-red-500 text-sm text-center">{error}</Text>
          )}


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


      <View className="absolute bottom-2 flex-row">
        <Text className="text-neutral-400 text-lg">Create an account? </Text>
        <Text
          className="text-yellow-500 text-lg"
          onPress={() => navigate('/user/register')}
        >
          Register
        </Text>
      </View>
    </ScrollView>
  )
}

export default Studentlogin