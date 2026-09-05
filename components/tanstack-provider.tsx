"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

interface TansstackProviderProps {
    children: React.ReactNode;
}

export const TanstackProvider = ({ children }: TansstackProviderProps) => {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};