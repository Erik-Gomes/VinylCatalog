import React, { useCallback } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect, router } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons'; // Importamos os ícones
import { VinylCard } from '../src/components/VinylCard';
import { useVinyls } from '../src/hooks/useVinyls';
import { EmptyState } from '../src/components/EmptyState';

export default function Index() {
  const { vinyls, loading, loadVinyls, deleteVinyl } = useVinyls();

  useFocusEffect(
    useCallback(() => {
      loadVinyls();
    }, [loadVinyls])
  );

  return (
    <View className="flex-1 bg-gray-50">
    
      {loading ? (
        <ActivityIndicator size="large" color="#1db954" className="flex-1" />
      ) : (
        <FlatList
          data={vinyls}
          keyExtractor={(item) => String(item.id)}
          contentContainerClassName="p-4 pb-28 flex-grow"
          renderItem={({ item }) => (
            <VinylCard vinyl={item} onDelete={deleteVinyl} />
          )}
          ListEmptyComponent={<EmptyState />}
        />
      )}

      <TouchableOpacity
        className="absolute bottom-8 right-6 w-16 h-16 bg-green-600 rounded-full items-center justify-center shadow-lg"
        style={{ elevation: 5 }} // Sombra extra para Android
        onPress={() => router.push('/AddVinyl')}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}