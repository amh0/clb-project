// lib/endpoints.ts
import api from "./axiosConfig";

// --- ENDPOINTS LÍNEAS ---

// Crear línea de transporte
export const createLinea = async (payload: {
  number: string;
  syndicate?: string;
  points: { lat: number; lon: number }[];
}) => {
  const res = await api.post("/lines/add", payload);
  return res.data;
};

// Obtener todas las líneas
export const fetchAllLineas = async () => {
  const res = await api.get("/lines/all");
  return res.data;
};

export const fetchLineasCercanas = async (lat: number, lon: number) => {
  // Ahora pasa lat y lon como query params
  const res = await api.get("/lines/near-point", {
    params: { lat, lon },
  });
  return res.data;
};

// --- ENDPOINTS PUNTOS ---

// Obtener todos los puntos
export const fetchAllPuntos = async () => {
  const res = await api.get("/points/all");
  return res.data;
};

// Obtener el punto más cercano
export const fetchPuntoMasCercano = async (lat: number, lon: number) => {
  const res = await api.get("/points/closest-point", {
    params: { lat, lon },
  });
  return res.data;
};
