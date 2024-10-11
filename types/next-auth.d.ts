import { DefaultSession } from "next-auth";
declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface User {
        accessToken: string;
        refreshToken: string;
        expires: number;
    }
    interface Session {
        user: {
            /** Oauth access token */
            accessToken: accessToken;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        expires: number;
        refreshToken: string;
        accessToken: string;
    }
}
