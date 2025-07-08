import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import MainPage from "./pages/MainPage";
import SearchPage from "./pages/SearchPage";
import LinesPage from "./pages/LinesPage";
import RoutePage from "./pages/RoutePage";
import "./App.css";

function App() {
    return (
        <ThemeProvider defaultTheme="light" storageKey="ciencia-link-theme">
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/" element={<Layout />}>
                        <Route path="/main" element={<MainPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/lines" element={<LinesPage />} />
                        <Route path="/route" element={<RoutePage />} />
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
