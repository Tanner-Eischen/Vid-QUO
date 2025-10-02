import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MacbookAir } from "./screens/MacbookAir/MacbookAir";
import { Standard } from "./screens/Standard/Standard";
import { Premium } from "./screens/Premium/Premium";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/basic" replace />} />
        <Route path="/basic" element={<MacbookAir />} />
        <Route path="/standard" element={<Standard />} />
        <Route path="/premium" element={<Premium />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
