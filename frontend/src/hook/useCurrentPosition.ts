import { useEffect, useState } from "react";
import { usePositionStore } from "../stores/usePositionStore"; // Ajusta la ruta si es necesario

export interface Position {
    lat: number;
    lng: number;
}

export function useCurrentPosition() {
    const [localPos, setLocalPos] = useState<Position | null>(null);
    const [error, setError] = useState<string | null>(null);
    const setGlobalPosition = usePositionStore((state) => state.setPosition);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocalización no soportada");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const position = {
                    lat: coords.latitude,
                    lng: coords.longitude,
                };
                setLocalPos(position);
                setGlobalPosition(position); // Guardar en Zustand
            },
            (err) => setError(err.message),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, [setGlobalPosition]);

    return { pos: localPos, error };
}
