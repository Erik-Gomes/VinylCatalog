import { db } from "../database/database";
import { VinylRecord } from "../types/vinyl";

export const VinylService = {

  create: async (vinyl: VinylRecord): Promise<number> => {
    const result = await db.runAsync(
      "INSERT INTO vinyls (title, artist, year, isFavorite) VALUES (?, ?, ?, ?);",
      [vinyl.title, vinyl.artist, vinyl.year, vinyl.isFavorite ? 1 : 0],
    );
    return result.lastInsertRowId;
  },

  findAll: async (): Promise<VinylRecord[]> => {
    const results = await db.getAllAsync<VinylRecord>(
      "SELECT * FROM vinyls ORDER BY title ASC;",
    );
    return results;
  },

  fetchYear: async(title: string, artist: string): Promise<number | null> => {
    try {
      const query = `release:${title} AND artist:${artist}`;
      const response = await fetch(
        `https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(query)}&fmt=json`,
        {headers: {'User-Agent': 'VinylCatalogApp/1.0.0 (erik@example.com)'}}
      );

      const data = await response.json();

      if (data.releases && data.releses.length > 0) {
        const dateStr = data.releases[0].date;
        return dateStr ? parseInt(dateStr.substring(0, 4)) : null;
      }
      return null;
    }catch (error) {
      console.error("Erro ao buscar ano no MusicBrainz:", error);
      return null;
    }
  },

  updateFavorite: async (id: number, isFavorite: boolean): Promise<void> => {
    await db.runAsync("UPDATE vinyls SET isFavorite = ? WHERE id = ?;", [
      isFavorite ? 1 : 0,
      id,
    ]);
  },

  remove: async (id: number): Promise<void> => {
    await db.runAsync("DELETE FROM vinyls WHERE id = ?;", [id]);
  },
};
