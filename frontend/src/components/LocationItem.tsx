"use client";

import { Home, Briefcase, GraduationCap } from "lucide-react";

interface LocationItemProps {
    type: "casa" | "trabajo" | "universidad";
    onClick?: () => void;
}

const LocationItem = ({ type, onClick }: LocationItemProps) => {
    const getIcon = () => {
        switch (type) {
            case "casa":
                return <Home size={24} />;
            case "trabajo":
                return <Briefcase size={24} />;
            case "universidad":
                return <GraduationCap size={24} />;
            default:
                return <Home size={24} />;
        }
    };

    const getLabel = () => {
        switch (type) {
            case "casa":
                return "Casa";
            case "trabajo":
                return "Trabajo";
            case "universidad":
                return "Universidad";
            default:
                return "";
        }
    };

    const getSubLabel = () => {
        return "Establecer";
    };

    return (
        <div
            className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-md cursor-pointer"
            onClick={onClick}
        >
            <div className="p-2 bg-gray-100 rounded-md">{getIcon()}</div>
            <div>
                <div className="font-medium">{getLabel()}</div>
                <div className="text-sm text-gray-500">{getSubLabel()}</div>
            </div>
        </div>
    );
};

export default LocationItem;
