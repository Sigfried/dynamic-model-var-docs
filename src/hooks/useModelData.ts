import { useState, useEffect } from 'react';
import { loadModelData } from '../utils/dataLoader';
import type { ModelData } from '../import_types';

interface UseModelDataResult {
  modelData: ModelData | undefined;
  loading: boolean;
  error: string | undefined;
}

/**
 * Hook to load and manage model data from the data loader.
 * Handles loading state, error state, and makes data available for debugging.
 */
export function useModelData(): UseModelDataResult {
  const [modelData, setModelData] = useState<ModelData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await loadModelData();
        setModelData(data);

        // Make modelData accessible in console for debugging
        (window as any).modelData = data;
        console.log('ModelData loaded and available as window.modelData:', data);
        console.log('Collections:', Array.from(data.collections.keys()));
        console.log('Total items loaded:', data.elementLookup.size);

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return { modelData, loading, error };
}
