'use client'

import { NextUIProvider } from '@nextui-org/react'

const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
    <NextUIProvider>
        {children}
    </NextUIProvider>
)

export default ThemeProvider