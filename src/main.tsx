import { createRoot } from "react-dom/client";
import "@/lib/i18n";
import { initClarity } from "@/lib/analytics";
import App from "./App.tsx";
import "./index.css";

initClarity();

createRoot(document.getElementById("root")!).render(<App />);
