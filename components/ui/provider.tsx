"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

export interface ProviderProps {
    children: React.ReactNode;
    session: Session;
}

export function Provider({ children, session }: ProviderProps) {
    return <SessionProvider session={session}>{children}</SessionProvider>;
}

export default Provider;
