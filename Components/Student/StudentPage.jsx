import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage, { useAsyncStorage } from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode';
import { CommonActions, useNavigation } from '@react-navigation/native';
import {API_URL} from "@env";
import axios from 'axios';
;
const StudentPage = () => {
  const [navebar, setnavebar] = useState(false);
  const [destination, setdestination] = useState("");
  const [studentdata, setstudentdata] = useState([]);
  const [wardendata, setwardendata] = useState([]);

  console.log("api skndskdns " , API_URL );
  
const navigate = useNavigation();
  

// student

useEffect(() => {
  
  const checktoken = async () =>{
   
try {
  
      const token = await AsyncStorage.getItem("token");


      if(!token){
      return     navigate.dispatch(
  CommonActions.reset({
    index: 0,
    routes: [{ name: 'Studentlogin' }],
  })
);

      }
  
  console.log("token in stroage" , token);


  const decode = jwtDecode(token);
  
      console.log(decode , "decoded token");
      
      const currenttime = Date.now()/1000 ;
  
      if(decode.exp < currenttime){
  
        await AsyncStorage.removeItem("token");
           navigate.dispatch(
  CommonActions.reset({
    index: 0,
    routes: [{ name: 'Studentlogin' }],
  })
);
        return;
  
      }


  console.log("Valid user");



} catch (error) {
  console.log("error on check token" , error)
}


  }

checktoken();

}, [])
      




useEffect(() => {
  
  


  const fetchStudent = async ()=>{


    const token = await AsyncStorage.getItem("token");

    if(!token){
      return console.log("invalid user");
    }


    try {

      const req = await axios.get(`${API_URL}/user/student` , {
        withCredentials : true,
       headers : {
            Authorization: `Bearer ${token}`
        }

      })
      
      

      if(req.data){
        console.log(req.data.student._id , "user fetch");
        setstudentdata(req.data.student)
if(req.data.student.permission  === "accepted"){
  console.log("sdnsjndjsndjsndjsdns");
  
  navigate.navigate("QRcodeScreen" , {
    id : req.data.student._id
    // id : "034304dfdfdf343434"
  });
}
      }



    } catch (error) {
      console.log("error on fetch student details" , error);;
    }

  }

  fetchStudent();

}, [])




const SendRequestToWarden = async (id) =>{

  if(!destination){
    return Alert.alert("⬆️ enter your destination")
  }

  try {

const token = await AsyncStorage.getItem("token");

    if(!token){
      return console.log("invalid user");
    }


console.log( "skkmdsd" ,id)

    const res = await axios.post(`${API_URL}/user/request/${id}` , {

      destination 

    },{
      withCredentials : true ,
     headers : {
            Authorization: `Bearer ${token}`
        }
    })

    


if(res.data){
  console.log(res.data);
  console.log(res.data.message);
  if(res.data.message === "already"){
    Alert.alert("request already sent wait for reply");
  }
}


    console.log("request send");
  
    setdestination(" ");

  } catch (error) {
    console.log("error on sending request" , error);
  }


}




const checkwardenPremission = async () =>{

  try {
    
    

  } catch (error) {
    console.log("erron on check warden premission" , error);
  }
}












useEffect(() => {
 
    const FetchAllWarden = async () =>{


    const token = await AsyncStorage.getItem("token");

    if(!token){
      return console.log("invalid user");
    }


      try {

        const req = await axios.get(`${API_URL}/user/allwarden`, {
          withCredentials  : true ,
  
        
          headers : {
            Authorization: `Bearer ${token}`
        }
        })
        
        if(req.data){
          console.log(req.data.warden, "warden  fetch successfully")
          setwardendata(req.data.warden)
        }

      } catch (error) {
        console.log("error on warden fetch" , error ) ;
      }

    }

    FetchAllWarden();


}, [])








  return (
<View className=' h-[106vh]  w-full bg-neutral-950  '>



<SafeAreaView className="flex-1 bg-neutral-950  relative  ">

{
  navebar && 

     <View className="  rounded-2xl  w-[60vw] flex absolute top-12 right-2  z-10   bg-neutral-800  p-3 flex-col pt-14 ">
      
      
      <TouchableOpacity className="py-3 border-b border-white  flex flex-row gap-4  ">
        <Text>
<FontAwesome name="pencil-square-o" color="#fff" size={24} />
        </Text>
          <Text className="  text-neutral-200 text-2xl  font-semibold">Profile</Text>
      </TouchableOpacity>

 
      <TouchableOpacity className="py-3 border-b border-white   flex flex-row gap-4 "  >
        <Text>
<MaterialIcons name="history" color="#fff" size={24} />
        </Text>
           <Text className="  text-neutral-200 text-2xl  font-semibold">History</Text>
      </TouchableOpacity>


      <TouchableOpacity className="py-3 flex  flex-row gap-4 ">
        <Text>
<MaterialIcons name="logout" size={24} color="red" />
        </Text>
         <Text className="  text-red-500 text-2xl  font-semibold" >Logout</Text>
      </TouchableOpacity>

    </View>

}
 








      <View className="h-[9vh] w-full   px-4 flex  flex-row   p-3 items-center justify-between    ">
        <View>

        <Text className="text-neutral-300 text-[29px] font-semibold  ">Hi, {studentdata.name}</Text>
        </View>
        


<TouchableOpacity
  onPress={() => setnavebar(!navebar)}
  activeOpacity={0.7}
className= {`h-full w-[16vw] z-20    rounded-2xl  flex items-center  justify-center  `}
>
 
 {
  navebar ? 
   <Entypo name="cross" size={33} color="white" /> : <Entypo name="menu" size={33} color="white" /> 
 } 
</TouchableOpacity>



  
      </View>
<View className='w-full h-[1px] bg-neutral-200 '/>


<ScrollView className=' p-5 flex-col flex gap-4 '>

<TextInput className='h-12 mb-4 rounded-xl p-2  text-xl font-semibold  placeholder:text-neutral-400   border-[1px] border-neutral-500  text-white w-full   mt-4 '
value={destination}
onChangeText={setdestination}
placeholder='Enter your destination...'

>

</TextInput>




{
  wardendata.length > 0 ? wardendata.map((item , index)=>(
    <View key={item._id}     className='mt-5  w-full h-[10vh]  bg-neutral-800 border-neutral-600  border-[1px]  shadow-md   p-2  overflow-hidden  rounded-2xl justify-between  items-center flex flex-row '>
<View className='h-full w-[65vw]   flex items-center  flex-row  '>

<View className='flex-col flex  justify-center  '> 

<Text className='text-2xl  text-white font-semibold '>
{item.name}
</Text>

<Text className='text-xl  text-neutral-200  font-semibold '>
{item.phoneNo}
</Text>

</View>
</View>

<View className='h-full w-[25vw]  items-center justify-center flex   pr-4  '> 

<TouchableOpacity
  onPress={() => SendRequestToWarden(item._id)}
  activeOpacity={0.7}
className= {`h-[44px] w-[20vw] z-20  bg-neutral-900   rounded-[30px]  flex items-center  justify-center  `}
>

 <AntDesign name="arrowright" color="#fff" size={30} />




</TouchableOpacity>


</View>

<View>

</View>
<View>

   
</View>

</View> 
  )) : null
}



</ScrollView>


    </SafeAreaView>



</View>

  )
}

export default StudentPage;

