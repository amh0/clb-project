"use client";

import type React from "react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
    placeholder: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = ({ placeholder, value, onChange }: SearchInputProps) => {
    return (
        <div className="relative w-full">
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full py-6 px-4 rounded-md border-gray-300 focus:border-primary focus:ring-primary"
            />
        </div>
    );
};

export default SearchInput;
