import React from "react";
import "../global.css";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#121212' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Catálogo de Vinis" }} />
      <Stack.Screen name="AddVinyl" options={{ title: "Adicionar Vinil" }} />
    </Stack>
  );
}