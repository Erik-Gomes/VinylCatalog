export interface VinylRecord {
  id?: number;
  title: string;
  artist: string;
  year: number | null;
  genre: string;
  isFavorite: boolean; 
}
