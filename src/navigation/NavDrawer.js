import Ionicons from '@expo/vector-icons/Ionicons';
import { createDrawerNavigator } from '@react-navigation/drawer';

import CurrencyConverter from '../components/CurrencyConverter';
import DiceGame from '../components/DiceGame';
import MemoryGame from '../components/MemoryGame';
import TicTacToe from '../components/TicTacToe';
import NavTab from './NavTab';

const Drawer = createDrawerNavigator();

const drawerIcons = {
  Main: ['home', 'home-outline'],
  Dice: ['dice', 'dice-outline'],
  TicTacToe: ['grid', 'grid-outline'],
  Memory: ['copy', 'copy-outline'],
  Currency: ['cash', 'cash-outline'],
};

export default function NavDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        drawerActiveBackgroundColor: '#FDE9E3',
        drawerActiveTintColor: '#C94728',
        drawerIcon: ({ color, focused, size }) => (
          <Ionicons
            color={color}
            name={drawerIcons[route.name][focused ? 0 : 1]}
            size={size}
          />
        ),
        drawerInactiveTintColor: '#526675',
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: '700',
        },
        headerStyle: {
          backgroundColor: '#12263A',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '800',
        },
      })}
    >
      <Drawer.Screen
        name="Main"
        component={NavTab}
        options={{ drawerLabel: 'Inicio', title: 'VidaLoca' }}
      />
      <Drawer.Screen
        name="Dice"
        component={DiceGame}
        options={{ drawerLabel: 'Dados', title: 'Lanzar dados' }}
      />
      <Drawer.Screen
        name="TicTacToe"
        component={TicTacToe}
        options={{ drawerLabel: 'Tic Tac Toe', title: 'Tic Tac Toe' }}
      />
      <Drawer.Screen
        name="Memory"
        component={MemoryGame}
        options={{ drawerLabel: 'Memorama', title: 'Memorama' }}
      />
      <Drawer.Screen
        name="Currency"
        component={CurrencyConverter}
        options={{ drawerLabel: 'Divisas', title: 'Conversion de divisas' }}
      />
    </Drawer.Navigator>
  );
}
