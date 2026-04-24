import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; 

export function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center p-10 mt-20">
      <View className="bg-gray-100 p-6 rounded-full mb-4">
        <Ionicons name="disc-outline" size={60} color="#9ca3af" />
      </View>
      
      <Text className="text-xl font-bold text-gray-800 text-center">
        Sua estante está vazia
      </Text>
      
      <Text className="text-gray-500 text-center mt-2 mb-6 leading-5">
        Parece que você ainda não adicionou nenhum vinil à sua coleção.
      </Text>

      <TouchableOpacity 
        className="bg-green-600 px-8 py-3 rounded-full flex-row items-center shadow-md"
        onPress={() => router.push('/AddVinyl')}
      >
        <Ionicons name="add" size={20} color="white" />
        <Text className="text-white font-bold ml-2">
          Adicionar Primeiro Disco
        </Text>
      </TouchableOpacity>
    </View>
  );
}