import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router"; 
import { VinylRecord } from "../types/vinyl"; 

interface Props {
  vinyl: VinylRecord;
  onDelete: (id: number) => void;
}

export function VinylCard({ vinyl, onDelete }: Props) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/vinyl/${vinyl.id}`)}
      // Removido o justify-between para não dar conflito
      className="flex-row items-center p-4 mb-3 bg-gray-50 rounded-xl shadow-sm border border-gray-200"
      style={{ elevation: 2 }} 
    >
      {/* O flex-1 aqui vai garantir que o texto ocupe o espaço livre e empurre a lixeira para a direita, sem expulsá-la da tela */}
      <View className="flex-row items-center flex-1 mr-4">
        <Ionicons name="disc-outline" size={24} color="#444" />
        
        <View className="ml-3 flex-1">
          <Text className="text-base font-bold text-gray-800" numberOfLines={1}>
            {vinyl.title}
          </Text>
          <Text className="text-sm text-gray-500 mt-0.5" numberOfLines={1}>
            {vinyl.artist} • {vinyl.year}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        className="p-2"
        onPress={(e) => {
          e.stopPropagation(); 
          if (vinyl.id) onDelete(vinyl.id);
        }}
      >
        <Ionicons name="trash-outline" size={22} color="#d32f2f" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}