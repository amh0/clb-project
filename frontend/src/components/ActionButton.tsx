"use client";

import { Button } from "@/components/ui/button";

interface ActionButtonProps {
    label: string;
    onClick?: () => void;
}

const ActionButton = ({ label, onClick }: ActionButtonProps) => {
    return (
        <Button
            className="w-full py-6 bg-black text-white hover:bg-black/90 rounded-md font-medium text-base"
            onClick={onClick}
        >
            {label}
        </Button>
    );
};

export default ActionButton;
