import React, {useEffect} from "react";
import "../global.css";
import { Stack } from "expo-router";
import { setupDatabase } from "../src/database/database";

export default function Layout() {
  useEffect(() => {
    try {
      setupDatabase();
    } catch (e) {
      console.error("Erro ao inicializar o banco de dados:", e);
    }
  }, []);

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