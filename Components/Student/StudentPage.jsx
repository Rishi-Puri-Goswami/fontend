import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { API_URL } from "@env";
import axios from 'axios';
import {initSocket} from 'Components/Socket';

const StudentPage = () => {
  const [navebar, setnavebar] = useState(false);
  const [destination, setdestination] = useState("");
  const [studentdata, setstudentdata] = useState({});
  const [wardendata, setwardendata] = useState([]);

  const navigate = useNavigation();
        

  console.log(API_URL , "a")
   
  // Check token
  useEffect(() => {
    const checktoken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          return navigate.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Studentlogin' }],
            })
          );
        }

        const decode = jwtDecode(token);
        const currenttime = Date.now() / 1000;
        if (decode.exp < currenttime) {
          await AsyncStorage.removeItem("token");
          return navigate.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Studentlogin' }],
            })
          );
        }
      } catch (error) {
        console.log("error on check token", error);
      }
    };
    checktoken();
  }, []);

  // Socket listener
useEffect(() => {
  let isMounted = true;
  let socketInstance = null; // <-- define outside

  const setupSocket = async () => {
    socketInstance = await initSocket(); // wait for async token
    if (!socketInstance) return;
    if (!isMounted) return;

    socketInstance.on("outpass_permission", ({ permission, wardenname }) => {
      console.log("Permission:", permission);

      if (permission === "accepted") {
        Alert.alert("Permission accepted by:", wardenname);
        navigate.navigate("QRcodeScreen");
      }

      if (permission === "rejected") {
        Alert.alert("Permission declined by:", wardenname);
      }
    });
  };

  setupSocket();

  return () => {
    isMounted = false;
    if (socketInstance) socketInstance.off("outpass_permission"); // cleanup
  };
}, []);

      

  // Fetch student details


   useFocusEffect(
    React.useCallback(() => {
  
    }, [])
  );

  
useEffect(() => {
  const fetchStudent = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return console.log("invalid user");

    try {
      const req = await axios.get(`${API_URL}/user/student`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (req.data) {
        setstudentdata(req.data.student);


        console.log(req.data.student , "req.data.student");

        // If student is outside, redirect to QR page and prevent back navigation
        
        
          if (req.data.student.permission === "accepted") {

            console.log(req.data.student._id , " req.data.student._id");


            navigate.navigate("QRcodeScreen", { id: req.data.student._id });

          }



        if (req.data.student.gatepermission === "outside") {
          await AsyncStorage.setItem("gatePermission", "outside");

          navigate.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: "QRcodeScreen",
                  params: { id: req.data.student._id },
                },
              ],
            })
          );
        }

      }


    } catch (error) {
      console.log("error on fetch student details", error);
    }
  };

  fetchStudent();
}, []);



  // Fetch all wardens
  useEffect(() => {
    const FetchAllWarden = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return console.log("invalid user");
      try {
        const req = await axios.get(`${API_URL}/user/allwarden`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        });
        if (req.data) setwardendata(req.data.warden);
      } catch (error) {
        console.log("error on warden fetch", error);
      }
    };
    FetchAllWarden();
  }, []);

  // Send request
  const SendRequestToWarden = async (id) => {
    if (!destination) return Alert.alert("⬆️ enter your destination");
    const token = await AsyncStorage.getItem("token");
    if (!token) return console.log("invalid user");

    try {
      const res = await axios.post(`${API_URL}/user/request/${id}`, { destination }, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.message === "already") {
        Alert.alert("Request already sent, wait for reply");
      }
      setdestination("");
    } catch (error) {
      console.log("error on sending request", error);
    }
  };






  return (
    <View className='h-[106vh] w-full bg-neutral-950'>
      <SafeAreaView className="flex-1 bg-neutral-950 relative">

        {navebar &&
          <View className="rounded-2xl w-[60vw] absolute top-12 right-2 z-10 bg-neutral-800 p-3 flex-col pt-14">
            <TouchableOpacity className="py-3 border-b border-white flex flex-row gap-4">
              <FontAwesome name="pencil-square-o" color="#fff" size={24} />
              <Text className="text-neutral-200 text-2xl font-semibold">Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity className="py-3 border-b border-white flex flex-row gap-4">
              <MaterialIcons name="history" color="#fff" size={24} />
              <Text className="text-neutral-200 text-2xl font-semibold">History</Text>
            </TouchableOpacity>
            <TouchableOpacity className="py-3 flex flex-row gap-4">
              <MaterialIcons name="logout" size={24} color="red" />
              <Text className="text-red-500 text-2xl font-semibold">Logout</Text>
            </TouchableOpacity>
          </View>
        }

        <View className="h-[9vh] w-full px-4 flex flex-row p-3 items-center justify-between">
          <Text className="text-neutral-300 text-[29px] font-semibold">Hi, {studentdata.name}</Text>
          <TouchableOpacity onPress={() => setnavebar(!navebar)} activeOpacity={0.7}
            className="h-full w-[16vw] z-20 rounded-2xl flex items-center justify-center">
            {navebar ? <Entypo name="cross" size={33} color="white" /> : <Entypo name="menu" size={33} color="white" />}
          </TouchableOpacity>
        </View>

        <View className='w-full h-[1px] bg-neutral-200' />

        <ScrollView className='p-5 flex-col flex gap-4'>
          <TextInput
            className='h-12 mb-4 rounded-xl p-2 text-xl font-semibold placeholder:text-neutral-400 border-[1px] border-neutral-500 text-white w-full mt-4'
            value={destination}
            onChangeText={setdestination}
            placeholder='Enter your destination...'
          />

          {wardendata.length > 0 && wardendata.map((item) => (
            <View key={item._id} className='mt-5 w-full h-[10vh] bg-neutral-800 border-neutral-600 border-[1px] shadow-md p-2 rounded-2xl flex flex-row justify-between items-center'>
              <View className='h-full w-[65vw] flex flex-row items-center'>
                <View className='flex-col flex justify-center'>
                  <Text className='text-2xl text-white font-semibold'>{item.name}</Text>
                  <Text className='text-xl text-neutral-200 font-semibold'>{item.phoneNo}</Text>
                </View>
              </View>
              <View className='h-full w-[25vw] flex items-center justify-center pr-4'>
                <TouchableOpacity onPress={() => SendRequestToWarden(item._id)} activeOpacity={0.7}
                  className='h-[44px] w-[20vw] z-20 bg-neutral-900 rounded-[30px] flex items-center justify-center'>
                  <AntDesign name="arrowright" color="#fff" size={30} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

      </SafeAreaView>
    </View>
  );
};

export default StudentPage;
