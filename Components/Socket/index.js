import {io} from  "socket.io-client";
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const checkToken = async () =>{

    try {
        
        const token = await AsyncStorage.getItem("token");
        // check role  
        if(!token){
            return  Alert.alert("invalid user");
        }


        const decoded = jwtDecode(token);

        console.log(decoded.role);

return token;
        
    } catch (error) {
        console.log("error on check token" , error)
    }

}




const token = checkToken();


        const socket = io("https://my-expo-app-7rbc.onrender.com", {
  auth: { token }, // send token in handshake
});
    
socket.on("connect", () => {
  console.log("Connected to server with socket ID:", socket.id);
});

// Log connection errors
socket.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
});




export default socket;

