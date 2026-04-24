import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useVinyls } from '../../src/hooks/useVinyls';
import { VinylRecord } from '../../src/types/vinyl';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function VinylDetails() {
  const { id } = useLocalSearchParams();
  const { getVinylById } = useVinyls();
  
  const [vinyl, setVinyl] = useState<VinylRecord | null>(null);
  const [tracks, setTracks] = useState<{ title: string; position: number }[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(false);

  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false); 

  useEffect(() => {
    getVinylById(Number(id)).then(setVinyl);
  }, [id]);

  useEffect(() => {
    const fetchTracks = async () => {
      if (!vinyl) return;
      
      setLoadingTracks(true);
      
      try {
        const headers = {
          'User-Agent': 'VinylCatalogApp/1.0.0 ( contato@seuemail.com )',
          'Accept': 'application/json'
        };

        const baseQuery = `release:"${vinyl.title}" AND artist:"${vinyl.artist}"`;
        
        const strictQuery = vinyl.year ? `${baseQuery} AND date:${vinyl.year}` : baseQuery;

        const searchMusicBrainz = async (queryStr: string) => {
          const searchUrl = `https://musicbrainz.org/ws/2/release?query=${encodeURIComponent(queryStr)}&fmt=json`;
          const res = await fetch(searchUrl, { headers });
          return await res.json();
        };

        let searchData = await searchMusicBrainz(strictQuery);

        if ((!searchData.releases || searchData.releases.length === 0) && vinyl.year) {
          console.log("Busca com ano falhou. Tentando fallback sem o ano...");
          searchData = await searchMusicBrainz(baseQuery);
        }

        if (searchData.releases && searchData.releases.length > 0) {
          const releaseId = searchData.releases[0].id;

          setCoverUrl(`https://coverartarchive.org/release/${releaseId}/front`);

          const tracksUrl = `https://musicbrainz.org/ws/2/release/${releaseId}?inc=recordings&fmt=json`;
          const tracksRes = await fetch(tracksUrl, { headers });
          const tracksData = await tracksRes.json();

          if (tracksData.media && tracksData.media.length > 0) {
            const fetchedTracks = tracksData.media[0].tracks.map((t: any) => ({
              title: t.title,
              position: t.position
            }));
            setTracks(fetchedTracks);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar faixas do MusicBrainz:", error);
      } finally {
        setLoadingTracks(false);
      }
    };

    fetchTracks();
  }, [vinyl]);

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Stack.Screen 
        options={{ 
          title: vinyl?.title || "Detalhes",
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => router.push(`/edit/${id}`)}
              className="px-2"
            >
              <Ionicons name="create-outline" size={26} color="#FFF" />
            </TouchableOpacity>
          )
        }} 
      />
      
      {/* Cabeçalho do Disco */}
      <View className="items-center mb-8 mt-4">
        {coverUrl && !imageError ? (
          <View className="w-48 h-48 rounded-xl mb-4 shadow-lg" style={{ elevation: 5 }}>
            <Image
              source={{ uri: coverUrl }}
              className="w-48 h-48 rounded-xl mb-4"
              onError={() => setImageError(true)} 
            />
          </View>
        ) : (
          <View className="w-32 h-32 bg-gray-800 rounded-full items-center justify-center mb-4 shadow-lg" style={{ elevation: 5 }}>
            <Text className="text-white text-4xl">🎵</Text>
          </View>
        )}
        <Text className="text-2xl font-bold text-gray-900 text-center">{vinyl?.title}</Text>
        <Text className="text-lg text-gray-500 mt-1">{vinyl?.artist} • {vinyl?.year}</Text>
      </View>
      
      <Text className="text-xl font-bold mb-4 text-gray-800">Faixas</Text>
      
      {loadingTracks ? (
        <View className="py-8 items-center">
          <ActivityIndicator size="large" color="#1db954" />
          <Text className="text-gray-500 mt-4">Buscando faixas na API...</Text>
        </View>
      ) : tracks.length > 0 ? (
        <View className="bg-gray-50 rounded-xl border border-gray-100 p-2 mb-10">
          {tracks.map((track, index) => (
            <View key={index} className="flex-row py-3 px-4 border-b border-gray-200/50 last:border-0">
              <Text className="text-gray-400 w-8 font-bold">{track.position}.</Text>
              <Text className="text-gray-700 flex-1 font-medium">{track.title}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View className="bg-gray-50 p-6 rounded-xl border border-gray-100 items-center">
          <Text className="text-gray-500 text-center">Nenhuma faixa encontrada na base de dados para este álbum.</Text>
        </View>
      )}
    </ScrollView>
  );
}