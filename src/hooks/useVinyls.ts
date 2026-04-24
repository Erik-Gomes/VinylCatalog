import { useState, useCallback } from 'react';
import { vinylRepository } from '../database/vinylRepository';
import { VinylRecord } from '../types/vinyl';

export function useVinyls() {
  const [vinyls, setVinyls] = useState<VinylRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const loadVinyls = useCallback(async () => {
    setLoading(true);
    try {
      const data = await vinylRepository.findAll();
      setVinyls(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const addVinyl = async (vinyl: Omit<VinylRecord, 'id'>) => {
    await vinylRepository.create(vinyl);
    await loadVinyls();
  };

  const getVinylById = async (id: number) => {
    return await vinylRepository.findById(id);
  };

  const updateVinyl = async (id: number, data: Omit<VinylRecord, 'id'>) => {
    await vinylRepository.update(id, data);
    await loadVinyls();
  };

  const deleteVinyl = async (id: number) => {
    await vinylRepository.remove(id);
    await loadVinyls();
  };

  return { vinyls, loading, loadVinyls, addVinyl, deleteVinyl, getVinylById, updateVinyl };
}