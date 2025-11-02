import { Tabs } from "expo-router";
import { HouseIcon, MagnifyingGlassIcon, NotebookIcon, UserCircleIcon } from "phosphor-react-native";


export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#181a20",
          height: 80,
          paddingBottom: 10, 
          paddingTop: 10, 
        },
        tabBarShowLabel: true, 
        tabBarActiveTintColor: "#1ab65c",
        tabBarInactiveTintColor: "#757575",
        tabBarLabelStyle: { 
          fontSize: 10,
          marginBottom: 10, 
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home", 
          tabBarIcon: ({ color }) => ( 
            <HouseIcon size={32} color={color} weight="fill" />
          )
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: "Search", 
          tabBarIcon: ({ color }) => ( 
            <MagnifyingGlassIcon size={32} color={color} weight="fill" />
          )
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          tabBarLabel: "Booking",
          tabBarIcon: ({ color }) => (
            <NotebookIcon size={32} color={color} weight="fill" />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile", 
          tabBarIcon: ({ color }) => ( 
            <UserCircleIcon size={32} color={color} weight="fill" />
          )
        }}
      />
    </Tabs>
  );
}