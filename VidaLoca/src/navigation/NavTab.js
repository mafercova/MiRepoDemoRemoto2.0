import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';

const Tab = createBottomTabNavigator();

const tabIcons = {
  Home: ['home', 'home-outline'],
};

export default function NavTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        animation: 'fade',
        headerShown: false,
        tabBarActiveTintColor: '#E35D38',
        tabBarIcon: ({ color, focused, size }) => (
          <Ionicons
            color={color}
            name={tabIcons[route.name][focused ? 0 : 1]}
            size={size}
          />
        ),
        tabBarInactiveTintColor: '#637381',
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '700',
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E8EDF0',
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
    </Tab.Navigator>
  );
}
