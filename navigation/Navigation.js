import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Home } from '../screens/Home'
import { Search } from '../screens/Search'

Icon.loadFont();

const BottomTab = createBottomTabNavigator();

export const Navigation = ({ navigation }) => {
  return (
    <>
      <BottomTab.Navigator
        initialRouteName="Home"
        tabBarOptions={{ activeTintColor: 'purple' }}>
        <BottomTab.Screen
          name="Map"
          component={Home}
          options={{
            tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
          }}
        />
        <BottomTab.Screen 
          name="Search" 
          component={Search} 
          options={{
            tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color}/>,
          }}
          />
      </BottomTab.Navigator>

    </>
  );
}

function TabBarIcon(props) {
  return <Icon size={25} {...props} />;
}