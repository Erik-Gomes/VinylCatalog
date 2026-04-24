import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useVinyls } from '../../src/hooks/useVinyls';

export default function EditVinyl() {
  const { id } = useLocalSearchParams();
  const { getVinylById, updateVinyl } = useVinyls();
  
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVinylById(Number(id)).then((vinyl) => {
      if (vinyl) {
        setTitle(vinyl.title);
        setArtist(vinyl.artist);
        setYear(String(vinyl.year));
      }
      setLoading(false);
    });
  }, [id]);

  const handleUpdate = async () => {
    if (!title || !artist || !year) return;

    await updateVinyl(Number(id), {
      title,
      artist,
      year: Number(year),
      isFavorite: false,
      genre: ''
    });

    router.back(); 
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#1db954" className="flex-1" />;
  }

  return (
    <View className="flex-1 p-6 bg-white">
      <Stack.Screen options={{ title: "Editar Vinil", headerTitleAlign: 'center' }} />

      <View className="space-y-4">
        <Text className="text-gray-500 mb-1 ml-1">Título do Álbum</Text>
        <TextInput
          className="p-4 border border-gray-200 rounded-xl text-lg bg-gray-50 mb-4"
          value={title}
          onChangeText={setTitle}
        />

        <Text className="text-gray-500 mb-1 ml-1">Artista / Banda</Text>
        <TextInput
          className="p-4 border border-gray-200 rounded-xl text-lg bg-gray-50 mb-4"
          value={artist}
          onChangeText={setArtist}
        />

        <Text className="text-gray-500 mb-1 ml-1">Ano de Lançamento</Text>
        <TextInput
          className="p-4 border border-gray-200 rounded-xl text-lg bg-gray-50 mb-6"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
          maxLength={4}
        />

        <TouchableOpacity 
          className="bg-blue-600 p-4 rounded-xl items-center shadow-md"
          onPress={handleUpdate}
        >
          <Text className="text-white font-bold text-lg">Atualizar Informações</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}