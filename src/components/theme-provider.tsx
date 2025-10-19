import { ThemeProvider as NextThemeProvider } from "next-themes";
import { type PropsWithChildren } from "react";

interface ThemeProviderProps extends PropsWithChildren {
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  storageKey?: string;
}

export const ThemeProvider = ({
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  storageKey = "moy-date-theme",
  children,
}: ThemeProviderProps) => {
  return (
    <NextThemeProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      storageKey={storageKey}
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
};
