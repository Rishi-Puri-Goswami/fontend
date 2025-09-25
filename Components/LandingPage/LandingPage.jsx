import React from 'react'
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import Studentlogin from 'Components/Student/Studentlogin';
import WardenLogin from 'Components/Warden/WardenLogin';
import GatekeeperLogin from 'Components/Gatekeeper/GatekeeperLogin';
const LandingPage = () => {

  
    const navigate = useNavigation();




  return (
<View className='h-[106vh] w-full bg-black p-4  '>

<SafeAreaView className='w-full h-screen p-5 '>

<View className='h-[30vh] w-full  flex items-center justify-center '>
<View className='w-full h-[10vh]  flex items-center  justify-center '>
   
   
    <View>

<Text className='text-4xl font-semibold  text-white  ' >
SR-Xit 👋
</Text>
    </View>


</View>
</View>


<View className='flex gap-4 pt-5  p-4 items-center justify-center mt-5 bg-neutral-800  h-[50vh] rounded-2xl   '>

<TouchableOpacity
  onPress={() => navigate.navigate(Studentlogin)}
  activeOpacity={0.7}
  className="h-[10vh] w-full bg-neutral-700 rounded-2xl flex items-center justify-center"
>


  <View>
    <Text className="text-3xl text-white">
Student
    </Text>
  </View>



</TouchableOpacity>

<TouchableOpacity
onPress={() => navigate.navigate(WardenLogin)}
  activeOpacity={0.7}
  className="h-[10vh] w-full bg-neutral-700 rounded-2xl flex items-center justify-center"
>


  <View>
    <Text className="text-3xl text-white">
      Warden
    </Text>
  </View>


</TouchableOpacity>

<TouchableOpacity
onPress={() => navigate.navigate(GatekeeperLogin)}
  activeOpacity={0.7}
  className="h-[10vh] w-full bg-neutral-700 rounded-2xl flex items-center justify-center"
>


  <View>
    <Text className="text-3xl text-white">
      Gatekeeper
    </Text>
  </View>



</TouchableOpacity>



</View>
   

</SafeAreaView>

</View>
  )
}

export default LandingPage