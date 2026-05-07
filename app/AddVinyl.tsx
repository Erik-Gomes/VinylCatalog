import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, Keyboard } from 'react-native';
import { router } from 'expo-router'; 
import { VinylService } from '../src/services/vinylService';

export default function AddVinyl() {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [year, setYear] = useState('');

  const handleSave = async () => {
      if (!title.trim() || !artist.trim()) {
        Alert.alert("Erro", "Por favor, preencha os campos álbum e artista.");
        return;
      }

      let yearNum: number | null = null;

      if (year.trim()) {
        yearNum = parseInt(year);
        const currentYear = new Date().getFullYear();

        if (isNaN(yearNum) || yearNum < 1800 || yearNum > currentYear) {
          Alert.alert("Erro", "Insira um ano válido ou deixe em branco.");
          return;
        }
      }

      try {
        await VinylService.create({
          title,
          artist,
          year: yearNum,
          genre: "",
          isFavorite: false
        });

        Alert.alert("Sucesso", "Disco adicionado à coleção!");
        Keyboard.dismiss();
        router.back();
      } catch (error) {
        Alert.alert("Erro", "Não foi possível salvar o disco.");
      }
    };

  return (
    <View className="flex-1 p-6 bg-white">
      <TextInput
        className="p-4 m-2 border border-gray-200 rounded-xl text-lg bg-gray-50 text-gray-950"
        placeholder="Título do Álbum"
        placeholderTextColor="#9ca3af"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        className="p-4 m-2 border border-gray-200 rounded-xl text-lg bg-gray-50 text-gray-950"
        placeholder="Artista / Banda"
        placeholderTextColor="#9ca3af"
        value={artist}
        onChangeText={setArtist}
      />
      <TextInput
        className="p-4 m-2 border border-gray-200 rounded-xl text-lg bg-gray-50 text-gray-950"
        placeholder="Ano de Lançamento"
        placeholderTextColor="#9ca3af"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
        maxLength={4}
      />

      <TouchableOpacity 
        className="bg-green-600 p-4 rounded-xl items-center shadow-md mt-4 m-2"
        onPress={handleSave}
      >
        <Text className="text-white font-bold text-lg">Salvar no Catálogo</Text>
      </TouchableOpacity>
    </View>
  );
}