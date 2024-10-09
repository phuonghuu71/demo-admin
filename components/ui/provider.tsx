"use client";

import { SessionProvider } from "next-auth/react";

export interface ProviderProps {
    children: React.ReactNode;
    session: never;
}

export function Provider({ children, session }: ProviderProps) {
    return <SessionProvider session={session}>{children}</SessionProvider>;
}

export default Provider;
