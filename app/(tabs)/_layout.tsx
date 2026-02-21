import client from '@/apollo/client';
import { ApolloProvider } from "@apollo/client/react";
import { Tabs } from 'expo-router';
import React from 'react';


import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ApolloProvider client={client}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,

          // Background color
          tabBarStyle: {
            backgroundColor: "#F5E6D3", // light beige like your cards
          },
          tabBarActiveTintColor: "#E25D00",
          tabBarInactiveTintColor: "#BFA58A",
        }}
      >
      <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={32} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color }) => <IconSymbol size={32} name="fork.knife" color={color} />,
          }}
        />
      </Tabs>
    </ApolloProvider>
  );
}
