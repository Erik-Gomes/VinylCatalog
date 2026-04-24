import { db } from './database';
import { VinylRecord } from '../types/vinyl';

export const vinylRepository = {
  create: async (vinyl: Omit<VinylRecord, 'id'>) => {
    const result = await db.runAsync(
      'INSERT INTO vinyls (title, artist, year, isFavorite) VALUES (?, ?, ?, ?);',
      [vinyl.title, vinyl.artist, vinyl.year, vinyl.isFavorite ? 1 : 0]
    );
    return result.lastInsertRowId;
  },

  findAll: async () => {
    return await db.getAllAsync<VinylRecord>('SELECT * FROM vinyls ORDER BY title ASC;');
  },

  findById: async (id: number) => {
    return await db.getFirstAsync<VinylRecord>('SELECT * FROM vinyls WHERE id = ?;', [id]);
  },

  update: async (id: number, vinyl: Omit<VinylRecord, 'id'>) => {
    await db.runAsync(
      'UPDATE vinyls SET title = ?, artist = ?, year = ?, isFavorite = ? WHERE id = ?;',
      [vinyl.title, vinyl.artist, vinyl.year, vinyl.isFavorite ? 1 : 0, id]
    );
  },

  remove: async (id: number) => {
    await db.runAsync('DELETE FROM vinyls WHERE id = ?;', [id]);
  }
};