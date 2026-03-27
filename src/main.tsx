import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { I18nProvider } from "./i18n";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "./index.css";


createRoot(document.getElementById("root")!).render(
  <I18nProvider>
    <App />
  </I18nProvider>
);
