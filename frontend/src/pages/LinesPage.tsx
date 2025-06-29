"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SearchInput from "../components/SearchInput";
import ActionButton from "../components/ActionButton";

const LinesPage = () => {
    const [lineNumber, setLineNumber] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        navigate("/route");
    };

    return (
        <div className="space-y-6 pb-16">
            <Header title="Ciencia Link" />

            <div className="space-y-4">
                <p className="text-sm font-medium">
                    Ingresa la línea de minibuses o trufis
                </p>

                <SearchInput
                    placeholder="271"
                    value={lineNumber}
                    onChange={(e) => setLineNumber(e.target.value)}
                />

                <ActionButton label="Buscar" onClick={handleSearch} />
            </div>

            <div className="rounded-2xl border shadow p-4 bg-background/95 backdrop-blur-lg">
                <h2 className="text-lg font-medium">Información</h2>

                <div className="space-y-6 bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-1">
                        <h3 className="font-medium">Minibus 271</h3>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm text-gray-500">Paradas</p>
                        <p className="font-medium">Zona Sur: C. 30 Cota Cota</p>
                        <p className="font-medium">Alto Tejar</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm text-gray-500">Horario</p>
                        <p className="font-medium">6:00 - 23:00</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm text-gray-500">Contacto</p>
                        <p className="font-medium">67458565 - 2245852</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm text-gray-500">Tarifa</p>
                        <p className="font-medium">Ruta corta: Bs 2.40</p>
                    </div>

                    <div className="space-y-2">
                        <SearchInput placeholder="271" />
                        <ActionButton
                            label="Ruta"
                            onClick={() => navigate("/route")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LinesPage;
