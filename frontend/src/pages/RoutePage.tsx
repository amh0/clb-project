import Header from "../components/Header";
import RouteMap from "../components/RouteMap";
import rutaLaPaz from "../data/rutaLaPaz1";
import rutaLaPaz2 from "../data/rutaLaPaz2";

const datos = [
  { coordenadas: rutaLaPaz, color: "green" },
  { coordenadas: rutaLaPaz2, color: "red" },
];

const RoutePage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header title="Rutas"/>
            <main className="flex-1">
                <RouteMap rutas={datos} />
            </main>
        </div>
    );
};

export default RoutePage;
