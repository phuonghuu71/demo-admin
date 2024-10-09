import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            id: "servicenow",
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const response = await axios.post(
                    `${process.env.SERVICENOW_URL}/oauth_token.do`,
                    {
                        grant_type: "password",
                        client_id: process.env.SERVICENOW_CLIENT_ID,
                        client_secret: process.env.SERVICENOW_CLIENT_SECRET,
                        username: credentials?.email,
                        password: credentials?.password,
                    },
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }
                );

                // If the request is successful and we get a token
                const token = response.data.access_token;
                const expires = response.data.expires_in;

                // Fetch user
                const fetchUserList = await axios.get(
                    `${process.env.SERVICENOW_URL}/api/now/table/sys_user?sysparm_query=sys_id=javascript:gs.getUserID()`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const fetchUser: ServiceNowUser = fetchUserList.data.result[0];

                if (fetchUser) {
                    const user: UserProvider = {
                        id: fetchUser.sys_id,
                        name: fetchUser.name,
                        email: fetchUser.email,
                        accessToken: token,
                        expires: expires,
                    };
                    return user;
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null;
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.expires = user.expires;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.accessToken = token.accessToken;
            session.expires = token.expires;
            return session;
        },
        redirect() {
            return "/";
        },
    },
    pages: {
        signIn: "/login",
    },
};

interface UserProvider {
    id: string;
    name: string;
    email: string;
    accessToken: string;
    expires: string;
}

interface ServiceNowUser {
    sys_id: string;
    name: string;
    email: string;
    access_token: string;
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
