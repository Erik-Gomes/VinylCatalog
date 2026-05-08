import React, { useState, useMemo, useCallback } from 'react';
import { Alert, View, TextInput, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect, router } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons'; // Importamos os ícones
import { VinylCard } from '../src/components/VinylCard';
import { useVinyls } from '../src/hooks/useVinyls';
import { EmptyState } from '../src/components/EmptyState';

export default function Index() {
  const { vinyls, loading, loadVinyls, deleteVinyl } = useVinyls();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useFocusEffect(
    useCallback(() => {
      loadVinyls();
    }, [loadVinyls])
  );

  const filteredVinyls = useMemo(() => {
    let result = vinyls;

    if (searchQuery.trim()){
      const query = searchQuery.toLowerCase();
      result = result.filter((v) => 
        v.title.toLowerCase().includes(query) ||
        v.artist.toLowerCase().includes(query)
      );
    }

    result = [...result].sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      if (titleA < titleB) return sortOrder === 'asc' ? -1 : 1;
      if (titleA > titleB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return result;

  }, [vinyls, searchQuery, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const confirmDelete = (id: number, title: string) => {
    Alert.alert(
      "Excluir Disco",
      `Tem certeza que deseja excluir "${title}" da sua coleção?`,
      [
        {
          text: "Cancelar",
          style: "cancel", // Mantém a ação neutra/padrão
        },
        {
          text: "Excluir",
          style: "destructive", // Fica em vermelho no iOS
          onPress: () => deleteVinyl(id), // Executa a exclusão apenas se clicar aqui
        },
      ],
      { cancelable: true } // Permite fechar clicando fora da caixa no Android
    );
  };

  return (
    <View className="flex-1 bg-gray-50">

      <View className="flex-row items-center mb-4 space-x-2">
        <TextInput
          className="flex-1 p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 m-4"
          placeholder="Buscar álbum ou artista..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          className="p-3 bg-gray-100 border border-gray-200 rounded-xl ml-2 mr-4"
          onPress={toggleSortOrder}
        >
          <Text className="text-gray-800 font-bold">
            {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          </Text>
        </TouchableOpacity>
      </View>
    
      {loading ? (
        <ActivityIndicator size="large" color="#1db954" className="flex-1" />
      ) : (
        <FlatList
          data={filteredVinyls}
          keyExtractor={(item) => String(item.id)}
          contentContainerClassName="p-4 pb-28 flex-grow"
          renderItem={({ item }) => (
            <VinylCard vinyl={item} onDelete={() => confirmDelete(item.id!, item.title)} onPress={() => router.push(`/vinyl/${item.id}`)} />
          )}
          ListEmptyComponent={<EmptyState />}
          showsVerticalScrollIndicator={false}
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