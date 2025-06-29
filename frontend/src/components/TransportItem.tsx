"use client";

import { Bus, Car } from "lucide-react";

interface TransportItemProps {
    type: "bus" | "trufi";
    label: string;
    onClick?: () => void;
}

const TransportItem = ({ type, label, onClick }: TransportItemProps) => {
    const getIcon = () => {
        switch (type) {
            case "bus":
                return <Bus size={24} />;
            case "trufi":
                return <Car size={24} />;
            default:
                return <Bus size={24} />;
        }
    };

    return (
        <div
            className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-md cursor-pointer"
            onClick={onClick}
        >
            <div className="p-2 bg-gray-100 rounded-md">{getIcon()}</div>
            <div className="font-medium">{label}</div>
        </div>
    );
};

export default TransportItem;
