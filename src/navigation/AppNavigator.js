import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DashboardScreen from "../screens/DashboardScreen";
import DeviceScreen from "../screens/DeviceScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import SettingsScreen from "../screens/SettingScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
      />

      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
      />

      <Stack.Screen
        name="Device"
        component={DeviceScreen}
      />

      <Stack.Screen
  name="Settings"
  component={SettingsScreen}
/>
    </Stack.Navigator>
  );
}
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { Pressable, Text } from "react-native";
// import WelcomeScreen from "../screens/WelcomeScreen";
// import LoginScreen from "../screens/LoginScreen";
// import RegisterScreen from "../screens/RegisterScreen";
// import DashboardScreen from "../screens/DashboardScreen";
// import DeviceScreen from "../screens/DeviceScreen";

// import { removeToken } from "../storage/authStorage";

// const Stack = createNativeStackNavigator();

// export default function AppNavigator() {

//   const handleLogout = async (navigation) => {
//     try {
//       await removeToken();

//       navigation.reset({
//         index: 0,
//         routes: [
//           {
//             name: "Login",
//           },
//         ],
//       });

//     } catch (error) {
//       console.log(
//         "Błąd wylogowania:",
//         error
//       );
//     }
//   };

//   return (
//     <Stack.Navigator>

//       {/* LOGIN */}

//       <Stack.Screen
//         name="Login"
//         component={LoginScreen}
//         options={{
//           headerShown: false,
//         }}
//       />

//       {/* REJESTRACJA */}

//       <Stack.Screen
//         name="Register"
//         component={RegisterScreen}
//       />

//       {/* DASHBOARD */}

//       <Stack.Screen
//         name="Dashboard"
//         component={DashboardScreen}
//         options={({ navigation }) => ({
//           title: "Dashboard",

//           headerRight: () => (
//             <Pressable
//               onPress={() =>
//                 handleLogout(navigation)
//               }
//               style={{
//                 marginRight: 5,
//               }}
//             >
//               <Text
//                 style={{
//                   color: "#c62828",
//                   fontSize: 15,
//                   fontWeight: "600",
//                 }}
//               >
//                 Wyloguj
//               </Text>
//             </Pressable>
//           ),
//         })}
//       />

//       {/* URZĄDZENIE */}

//       <Stack.Screen
//         name="Device"
//         component={DeviceScreen}
//         options={{
//           title: "Urządzenie",
//         }}
//       />

//     </Stack.Navigator>
//   );
// }