"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import ActionButton from "../components/ActionButton";
import Logo from "../components/Logo";

const HomePage = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleContinue = () => {
        navigate("/main");
    };

    return (
        <div className="app-container">
            <div className="flex flex-col items-center justify-center h-full px-6">
                <Logo />

                <div className="w-full mt-12 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Ingresa tu correo electrónico
                        </label>
                        <Input
                            type="email"
                            placeholder="ejemplo@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="py-6"
                        />
                    </div>

                    <ActionButton label="Continuar" onClick={handleContinue} />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
