import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import qrimage from '../../assets/qrimage.jpg';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// import { keys } from 'eslint.config';
import {API_URL} from "@env";

const GatekeeperPage = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [qrData, setQrData] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const navigate = useNavigation();


// console.log("api url" , API_URL )
console.log("api url " , API_URL);

  // qrcodescan




  const gatekeeperdata = async ()  =>{

    try {

      // AsyncStorage.clear()
      
       const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.log("⚠️ No token student has to login");
          return;
        }

        const res = await axios.get(`${API_URL}/gatekeeper/gatekeeperdata` , {

          withCredentials : true  ,

           headers: {
              Authorization: `Bearer ${token}`,
            },

        })

        if(res.data){
          console.log(res.data);
        }

      


    } catch (error) {
      console.log("error on fetch gatekeeper data" , error)
    }

  }



  useEffect(() => {
  gatekeeperdata();
  }, []);
  




    const sendqrdata = async (data) => {
      try {
// AsyncStorage.clear();
        console.log("qrdata => ",data)

        if(!data || data == null || data == undefined){
          return console.log("no qrdata");
        }


        console.log(data)

        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.log("⚠️ No token student has to login");
          return;
        }
console.log(API_URL , "sdmskdksdsk");


        const res = await axios.post(
          `${API_URL}/gatekeeper/qrcodescan`,
          { key:data},
  
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data) {
          console.log("✅ Server response:", res.data);
        }
      } catch (error) {
        console.log("❌ Error sending QR data:", error.message);
      }
    };






  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return <Text className="text-white text-lg">Requesting camera permission...</Text>;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-red-400 text-lg mb-4">No access to camera</Text>
        <TouchableOpacity
          className="bg-blue-600 px-5 py-3 rounded-xl"
          onPress={requestPermission}
        >
          <Text className="text-white text-lg font-semibold">Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleNavigate = (screen) => {
    console.log('Navigate to:', screen);
    setMenuVisible(false);
  };

  return (
  
  <SafeAreaView className='flex-1 bg-neutral-900 items-center flex flex-col '>

    <View className="flex-1 bg-neutral-900  w-full items-center flex flex-col  ">
      
      {/* Header */}
      <View className=" z-50   p-2 h-[100px]   w-full absolute top-0 left-0   bg-neutral-800 flex-row   flex   justify-between  items-start   ">
        <Text className=" text-2xl   font-bold" style={{color:"yellow"}} >Gatekeeper</Text>
          <TouchableOpacity
        className=" top-4  right-5 p-2 z-50"
        onPress={() => setMenuVisible(true)}
        >
        <Text className="text-white text-2xl">⋮</Text>
      </TouchableOpacity>
      </View>

<View className='flex-1 h-screen w-full   bg-neutral-900 items-center flex flex-col   justify-center '>

      {/* Three-dot menu button */}
    

      {/* Modal */}
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
        >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
          >
          <View className="  absolute top-[13px] right-5 bg-neutral-900 rounded-lg shadow-lg overflow-hidden" style={{position: 'absolute',
    top: 70,
    right: 20, // right-5 → 5 * 4 = 20px
    backgroundColor: '#1f2937', // bg-neutral-900
    borderRadius: 12, // rounded-lg
    overflow: 'hidden',
    // shadow-lg equivalent:
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8, }} >
            <TouchableOpacity
              className="px-4 py-3 border-b border-gray-700"
              onPress={() => navigate.navigate('History')}
              >
              <Text className="text-white text-base">History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="px-4 py-3"
              onPress={() => navigate.navigate('LiveStudent')}
              >
              <Text className="text-white text-base">Live Students</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Scanner */}
      {scanning ? (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['qr']
            }}
            onBarcodeScanned={({ data }) => {
              if (!qrData) {
                setQrData(data);
                sendqrdata(data);
                setScanning(false);
              }
            }}
            />
          
          {/* Close scanning button */}
          <TouchableOpacity
            className="absolute top-20 left-5 bg-red-600 px-4 py-2 rounded-lg"
            onPress={() => setScanning(false)}
            >
            <Text className="text-white font-bold">Close</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* QR Guide Box */}
          <View className="h-[50vh] w-[90%] border-2 border-neutral-400 bg-neutral-700 mt-20 mb-8 relative overflow-hidden rounded-xl">
            {!scanning && (
              <View className="flex-1 items-center justify-center">
                <Image
                  source={qrimage}
                  className="h-[50vh] w-full"
                  resizeMode="contain"
                  />
              </View>
            )}
          </View>
     
          {/* Start Scanning Button */}
          <TouchableOpacity
            className="bg-yellow-400 px-6 py-3 rounded-xl"
            onPress={() => {
              setQrData(null);
              setScanning(true);
            }}
            >
            <Text className="text-black text-lg font-bold">Start Scanning</Text>
          </TouchableOpacity>

          {/* Display QR Data */}
          {qrData && (
            <View className="mt-6 p-4 bg-neutral-800 rounded-xl w-[90%]">
              <Text className="text-green-400 text-lg font-bold">QR Data:</Text>
              <Text className="text-white mt-2">{qrData}</Text>
            </View>
          )}
        </>
      )}
      </View>
    </View>
</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default GatekeeperPage;
