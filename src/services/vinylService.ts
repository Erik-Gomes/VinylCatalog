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
