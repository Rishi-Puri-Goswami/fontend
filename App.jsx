import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import './global.css'
import OwnerDashboard from 'Components/Ownerpage/OwnerDashboard';
import Studentlogin from 'Components/Student/Studentlogin';
import LandingPage from 'Components/LandingPage/LandingPage';
import GatekeeperLogin from 'Components/Gatekeeper/GatekeeperLogin';
import WardenLogin from 'Components/Warden/WardenLogin';
import StudentPage from 'Components/Student/StudentPage';
import WardenPage from 'Components/Warden/WardenPage';
import History from 'Components/Gatekeeper/History';
import LiveStudent from 'Components/Gatekeeper/LiveStudent';
import GatekeeperPage from 'Components/Gatekeeper/GatekeeperPage';
import QRcodeScreen from 'Components/Student/QRcodeScreen';
import Wardenhistory from 'Components/Warden/Wardenhistory';

const App = () => {
  const Stack = createNativeStackNavigator();

  return (

 <SafeAreaProvider>

      <NavigationContainer>
 
        <Stack.Navigator   initialRouteName="LandingPage"   >

          <Stack.Screen
            name="Studentlogin"
            component={Studentlogin}
             options={{ headerShown: false }} 
            />
    
  <Stack.Screen
            name="History"
            component={History}
             options={{ headerShown: false }} 
            />



  <Stack.Screen
            name="LiveStudent"
            component={LiveStudent}
             options={{ headerShown: false }} 
            />

            
  <Stack.Screen
            name="GatekeeperPage"
            component={GatekeeperPage}
             options={{ headerShown: false }} 
            />
  <Stack.Screen
            name="Wardenhistory"
            component={Wardenhistory}
             options={{ headerShown: false }} 
            />


   <Stack.Screen
            name="WardenPage"
            component={WardenPage}
             options={{ headerShown: false }} 
            />

             <Stack.Screen
            name="GatekeeperLogin"
            component={GatekeeperLogin}
             options={{ headerShown: false }} 
            />


             <Stack.Screen
            name="WardenLogin"
            component={WardenLogin}
             options={{ headerShown: false }} 
            />


 <Stack.Screen
            name="LandingPage"
            component={LandingPage}
             options={{ headerShown: false }} 
            />


 <Stack.Screen
            name="StudentPage"
            component={StudentPage}
             options={{ headerShown: false }} 
            />
 <Stack.Screen
            name="QRcodeScreen"
            component={QRcodeScreen}
             options={{ headerShown: false }} 
            />


        </Stack.Navigator>

      </NavigationContainer>

            </SafeAreaProvider>



  )
}

export default App;
