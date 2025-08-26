
// --- Tipos ---
export interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: [string, string, string, string];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon?: string;
}

type SearchRequest = {
  query: string;
  resolve: (result: NominatimResult[] | null) => void;
  reject: (error: Error) => void;
};

// --- Lógica de Cola y Debounce ---

const requestQueue: SearchRequest[] = [];
let isProcessing = false;

async function processQueue() {
  if (isProcessing || requestQueue.length === 0) {
    return;
  }
  isProcessing = true;
  const { query, resolve, reject } = requestQueue.shift()!;

  try {
    const viewbox = "-68.2342694,-16.4434225,-68.0234735,-16.5910481";
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&limit=5&viewbox=${viewbox}&bounded=1&countrycodes=bo`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CienciaLink-Transporte-App/1.0 (Para pruebas academicas)',
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la red: ${response.statusText}`);
    }

    const results: NominatimResult[] = await response.json();

    if (results && results.length > 0) {
      resolve(results);
    } else {
      resolve(null); // No se encontraron resultados
    }
  } catch (error) {
    console.error('Error en la búsqueda de geocodificación:', error);
    reject(error instanceof Error ? error : new Error('Error desconocido'));
  } finally {
    isProcessing = false;
    // Procesa el siguiente en la cola después de un breve respiro
    setTimeout(processQueue, 100); // Evita sobrecargar la API
  }
}

export function searchLocation(query: string): Promise<NominatimResult[] | null> {
  return new Promise((resolve, reject) => {
    // Agrega la nueva solicitud a la cola
    requestQueue.push({ query, resolve, reject });
    // Inicia el procesamiento si no está ya en marcha
    processQueue();
  });
}
