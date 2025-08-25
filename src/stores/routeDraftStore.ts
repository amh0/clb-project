// src/stores/routeDraftStore.ts
import { create } from 'zustand';


export type BackendPoint = { lon: number; lat: number }; // Convención backend (lon≈-68, lat≈-16)


type RouteDraftState = {
points: BackendPoint[];
setPoints: (pts: BackendPoint[]) => void;
clear: () => void;
};


export const useRouteDraftStore = create<RouteDraftState>((set) => ({
points: [],
setPoints: (pts) => set({ points: pts }),
clear: () => set({ points: [] }),
}));