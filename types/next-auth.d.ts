import { DefaultSession } from "next-auth";
declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface User {
        accessToken: string;
        expires: string;
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
        expires: string;
        accessToken: string;
    }
}
