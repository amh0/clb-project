import { MapPin } from "lucide-react";

interface MapPlaceholderProps {
    message?: string;
}

const MapPlaceholder = ({
    message = "Mapa no disponible",
}: MapPlaceholderProps) => {
    return (
        <div className="map-container flex items-center justify-center flex-col bg-gray-100 rounded-lg">
            <MapPin size={32} className="text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">{message}</p>
        </div>
    );
};

export default MapPlaceholder;
