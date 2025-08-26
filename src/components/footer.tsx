import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Crosshair, MapPin, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { searchLocation, NominatimResult } from "@/lib/geocoding";
import { LatLng } from "leaflet";

import { useDebounce } from "@/lib/hooks";
import { useMapStore } from "@/stores/useMapStore";

export default function FooterPage() {
  const {
    startElegirDestino,
    startElegirOrigen,
    handleSetCurrentLocation,
    setCoordenadasOrigen,
    setCoordenadasDestino,
  } = useMapStore();

  const [origenOpen, setOrigenOpen] = useState(false);
  const [destinoOpen, setDestinoOpen] = useState(false);

  const [origenQuery, setOrigenQuery] = useState("");
  const [destinoQuery, setDestinoQuery] = useState("");

  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);

  const debouncedOrigenQuery = useDebounce(origenQuery, 500);
  const debouncedDestinoQuery = useDebounce(destinoQuery, 500);

  const handleSearch = async (type: "origen" | "destino") => {
    const query = type === "origen" ? debouncedOrigenQuery : debouncedDestinoQuery;
    if (query.length < 3) {
      setError("Ingrese al menos 3 caracteres para buscar.");
      return;
    }

    setIsSearching(true);
    setError(null);
    setSearchResults([]);

    try {
      const results = await searchLocation(query);
      if (results && results.length > 0) {
        setSearchResults(results);
      } else {
        setError(`No se encontraron resultados para "${query}".`);
      }
    } catch (err) {
      setError("Ocurrió un error al buscar la ubicación.");
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = (result: NominatimResult, type: "origen" | "destino") => {
    const coords = new LatLng(parseFloat(result.lat), parseFloat(result.lon));
    if (type === "origen") {
      setCoordenadasOrigen(coords);
      setOrigenOpen(false);
    } else {
      setCoordenadasDestino(coords);
      setDestinoOpen(false);
    }
    setSearchResults([]);
    setOrigenQuery("");
    setDestinoQuery("");
  };

  const handleOrigenCurrentLocation = () => {
    handleSetCurrentLocation("origen");
    setOrigenOpen(false);
  };

  const handleDestinoCurrentLocation = () => {
    handleSetCurrentLocation("destino");
    setDestinoOpen(false);
  };

  const handleElegirOrigenMapa = () => {
    startElegirOrigen();
    setOrigenOpen(false);
  };

  const handleElegirDestinoMapa = () => {
    startElegirDestino();
    setDestinoOpen(false);
  };

  // Reset state on dialog close
  useEffect(() => {
    if (!origenOpen) {
      setOrigenQuery("");
      setSearchResults([]);
      setError(null);
    }
  }, [origenOpen]);

  useEffect(() => {
    if (!destinoOpen) {
      setDestinoQuery("");
      setSearchResults([]);
      setError(null);
    }
  }, [destinoOpen]);

  return (
    <div className="flex bg-white rounded-t-3xl md:rounded-3xl md:w-80 md:ml-2">
      <div className="flex flex-col w-full">
        {/* Dialog de ORIGEN */}
        <div className="border-2 border-transparent">
          <Dialog open={origenOpen} onOpenChange={setOrigenOpen}>
            <div className="flex justify-center items-center md:justify-start border-2 border-transparent">
              <DialogTrigger asChild>
                <div className="mx-4 mt-2 w-full md:w-72 rounded-2xl border-1 border-bg1 text-xl bg-bg-light flex justify-between cursor-pointer">
                  <p className="text-white p-2 font-bold flex-1 text-center">
                    Seleccionar Origen
                  </p>
                </div>
              </DialogTrigger>
            </div>
            <DialogContent className="sm:max-w-md bg-white text-black rounded-2xl p-6 z-[100] border-none">
              <DialogHeader>
                <DialogTitle className="text-start">
                  Seleccionar Origen
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-full">
                  <Input
                    type="text"
                    placeholder="Ingrese el nombre del origen"
                    className="w-full border border-[#14a292] text-gray-700 placeholder:text-gray-400 caret-[#14a292] focus-visible:outline-none focus-visible:border-[#14a292] focus-visible:ring-2 focus-visible:ring-[#14a292] focus-visible:ring-offset-2 hover:shadow-[0_0_0_2px_rgba(20,162,146,0.12)] pr-10"
                    value={origenQuery}
                    onChange={(e) => setOrigenQuery(e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0"
                    onClick={() => handleSearch("origen")}
                    disabled={isSearching}
                  >
                    {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                  </Button>
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

                {searchResults.length > 0 && (
                  <div className="w-full border rounded-md max-h-48 overflow-y-auto mt-2">
                    {searchResults.map((result) => (
                      <div
                        key={result.place_id}
                        className="p-2 border-b cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSelectResult(result, "origen")}
                      >
                        <p className="text-sm font-medium">{result.display_name}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="w-full space-y-2 mt-2">
                    <Button
                      variant="ghost"
                      className="w-full dark:text-white"
                      onClick={handleOrigenCurrentLocation}
                    >
                      <Crosshair /> Su ubicación actual
                    </Button>
                    <Button
                      variant={"variant1"}
                      className="w-full"
                      onClick={handleElegirOrigenMapa}
                    >
                      <MapPin /> Buscar en el mapa
                    </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Dialog de DESTINO */}
        <div>
          <Dialog open={destinoOpen} onOpenChange={setDestinoOpen}>
            <div className="flex justify-center items-center md:justify-start">
              <DialogTrigger asChild>
                <div className="mx-4 my-2 w-full md:w-72 rounded-2xl border-1 border-bg1 text-xl bg-bg-light flex justify-between cursor-pointer">
                  <p className="text-white p-2 font-bold flex-1 text-center">
                    Seleccionar Destino
                  </p>
                </div>
              </DialogTrigger>
            </div>
            <DialogContent className="sm:max-w-md text-black bg-white rounded-2xl p-6 z-[100] border-none">
              <DialogHeader>
                <DialogTitle className="text-start">
                  Seleccionar Destino
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-full">
                  <Input
                    type="text"
                    placeholder="Ingrese punto de Destino"
                    className="w-full border border-[#14a292] text-gray-700 placeholder:text-gray-400 caret-[#14a292] focus-visible:outline-none focus-visible:border-[#14a292] focus-visible:ring-2 focus-visible:ring-[#14a292] focus-visible:ring-offset-2 hover:shadow-[0_0_0_2px_rgba(20,162,146,0.12)] pr-10"
                    value={destinoQuery}
                    onChange={(e) => setDestinoQuery(e.target.value)}
                  />
                   <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0"
                    onClick={() => handleSearch("destino")}
                    disabled={isSearching}
                  >
                    {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                  </Button>
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

                {searchResults.length > 0 && (
                  <div className="w-full border rounded-md max-h-48 overflow-y-auto mt-2">
                    {searchResults.map((result) => (
                      <div
                        key={result.place_id}
                        className="p-2 border-b cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSelectResult(result, "destino")}
                      >
                        <p className="text-sm font-medium">{result.display_name}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="w-full space-y-2 mt-2">
                    <Button
                      variant="ghost"
                      className="w-full dark:text-white"
                      onClick={handleDestinoCurrentLocation}
                    >
                      <Crosshair /> Su ubicación actual
                    </Button>
                    <Button
                      variant="variant1"
                      className="w-full dark:text-white"
                      onClick={handleElegirDestinoMapa}
                    >
                      <MapPin /> Buscar en el mapa
                    </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}