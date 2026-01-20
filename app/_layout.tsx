// app/_layout.tsx
import { Tabs } from "expo-router";
import { ContactsProvider } from '../context/ContactsContext'; 

export default function RootLayout() {
  return (
    <ContactsProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#999',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
          }}
        />
        <Tabs.Screen
          name="recent"
          options={{
            title: 'Recent',
          }}
        />
      </Tabs>
    </ContactsProvider>
  );
}