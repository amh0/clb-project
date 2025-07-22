// stores/lineasStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Point {
  _id: string;
  lat: number;
  lon: number;
  coordinates: [number, number];
  type?: string;
}

interface Linea {
  _id: string;
  number: number;
  syndicate?: string;
  points: Point[];
}

interface LineasState {
  lineas: Linea[] | null;
  setLineas: (data: Linea[]) => void;
}

export const useLineasStore = create<LineasState>()(
  devtools(
    (set) => ({
      lineas: null,
      setLineas: (data) => set({ lineas: data }, false, 'setLineas'),
    }),
    { name: 'LineasStore' }
  )
);
