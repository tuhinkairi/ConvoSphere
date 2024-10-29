'use client'
import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { ConvexClientProvider } from "./ConvexClientProvider";

export function Provider({ children }: { children: ReactNode }) {
    return (
        <ConvexClientProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
            >

                {children}
            </ThemeProvider>
        </ConvexClientProvider>
    )
}