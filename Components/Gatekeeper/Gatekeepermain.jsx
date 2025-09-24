import React from 'react'
import { Text, View } from 'react-native'
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"
import GatekeeperPage from './GatekeeperPage';
import GatekeeperLogin from './GatekeeperLogin';
export const Gatekeepermain = () => {

    const Tab = createBottomTabNavigator();

  return (
  <>
  
<Tab.Navigator

 screenOptions={{ headerShown: false }}
//  tabBar={(props) => } 

>

<Tab.Screen name="GatekeeperPage" component={GatekeeperPage} />
<Tab.Screen name="GatekeeperLogin" component={GatekeeperLogin} />

</Tab.Navigator>



  
  </>
  )
}
