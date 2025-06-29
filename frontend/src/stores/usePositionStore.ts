// src/stores/usePositionStore.ts
import { create } from "zustand";

export interface Position {
    lat: number;
    lng: number;
}

interface PositionState {
    position: Position | null;
    setPosition: (pos: Position) => void;
}

export const usePositionStore = create<PositionState>((set) => ({
    position: null,
    setPosition: (pos) => set({ position: pos }),
}));
