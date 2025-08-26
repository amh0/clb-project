import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { LatLng } from 'leaflet';
import { fetchLineasCercanas } from '@/lib/endpoints';
import { LineaCercana } from '@/types/linea';

type MapState = {
  coordenadasOrigen: LatLng | null;
  coordenadasDestino: LatLng | null;
  elegirEnMapaOrigen: boolean;
  elegirEnMapaDestino: boolean;
  lineasCercanas: LineaCercana[];
  selectedLineaIndex: number;
  headerSeccion: 1 | 2 | 3;
  isSheetOpen: boolean;
};

type MapActions = {
  setCoordenadasOrigen: (coords: LatLng) => void;
  setCoordenadasDestino: (coords: LatLng) => void;
  startElegirOrigen: () => void;
  startElegirDestino: () => void;
  stopElegirUbicacion: () => void;
  clearUbicaciones: () => void;
  buscarLineasCercanas: () => Promise<void>;
  setSelectedLineaIndex: (index: number) => void;
  setIsSheetOpen: (isOpen: boolean) => void;
  setHeaderSeccion: (section: 1 | 2 | 3) => void;
  handleSetCurrentLocation: (type: 'origen' | 'destino') => void;
};

const initialState: MapState = {
  coordenadasOrigen: null,
  coordenadasDestino: null,
  elegirEnMapaOrigen: false,
  elegirEnMapaDestino: false,
  lineasCercanas: [],
  selectedLineaIndex: 0,
  headerSeccion: 1,
  isSheetOpen: false,
};

export const useMapStore = create<MapState & MapActions>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setCoordenadasOrigen: (coords) => {
        set({ coordenadasOrigen: coords, elegirEnMapaOrigen: false, headerSeccion: 1 });
      },

      setCoordenadasDestino: (coords) => {
        set({ coordenadasDestino: coords, elegirEnMapaDestino: false, headerSeccion: 1 });
      },

      startElegirOrigen: () => {
        set({ elegirEnMapaOrigen: true, headerSeccion: 2 });
      },

      startElegirDestino: () => {
        set({ elegirEnMapaDestino: true, headerSeccion: 2 });
      },

      stopElegirUbicacion: () => {
        set({ elegirEnMapaOrigen: false, elegirEnMapaDestino: false, headerSeccion: 1 });
      },

      clearUbicaciones: () => {
        set({
          ...initialState,
        });
      },

      buscarLineasCercanas: async () => {
        const { coordenadasDestino } = get();
        if (!coordenadasDestino) {
          // Maybe handle this with an alert or a toast notification in the component
          console.warn("Se intentó buscar líneas sin un destino seleccionado.");
          return;
        }
        try {
          const response = await fetchLineasCercanas(coordenadasDestino.lng, coordenadasDestino.lat);
          const lines = response.data.lines;
          set({ lineasCercanas: lines, selectedLineaIndex: 0, isSheetOpen: true, headerSeccion: 3 });
        } catch (error) {
          console.error("Error al buscar líneas cercanas:", error);
          // Handle error in the UI
        }
      },

      setSelectedLineaIndex: (index) => {
        set({ selectedLineaIndex: index });
      },

      setIsSheetOpen: (isOpen) => {
        set({ isSheetOpen: isOpen });
      },

      setHeaderSeccion: (section) => {
        set({ headerSeccion: section });
      },

      handleSetCurrentLocation: (type) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const newCoords = new LatLng(latitude, longitude);
              if (type === 'origen') {
                get().setCoordenadasOrigen(newCoords);
              } else {
                get().setCoordenadasDestino(newCoords);
              }
            },
            (error) => {
              console.error("Error getting location", error);
              alert("No se pudo obtener la ubicación actual.");
            }
          );
        } else {
          alert("La geolocalización no es soportada por este navegador.");
        }
      }
    }),
    { name: 'MapStore' }
  )
);
