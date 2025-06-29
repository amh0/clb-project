import { Battery, Signal, Wifi } from "lucide-react";

const StatusBar = () => {
    const currentTime = "9:41";

    return (
        <div className="status-bar">
            <div>{currentTime}</div>
            <div className="flex items-center gap-1">
                <Signal size={16} />
                <Wifi size={16} />
                <Battery size={16} />
            </div>
        </div>
    );
};

export default StatusBar;
