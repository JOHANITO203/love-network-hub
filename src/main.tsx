import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { I18nProvider } from "./i18n";
import { ThemeProvider } from "@/components/theme-provider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <I18nProvider>
      <App />
    </I18nProvider>
  </ThemeProvider>
);
