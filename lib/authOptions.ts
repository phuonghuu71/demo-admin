import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { JWT } from "next-auth/jwt";

interface ServiceNowUser {
    sys_id: string;
    name: string;
    email: string;
    access_token: string;
}

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: JWT) {
    console.log("Refreshing");
    try {
        const url = `${process.env.SERVICENOW_URL}/oauth_token.do`;
        const params = new URLSearchParams();
        params.append("grant_type", "refresh_token");
        params.append("client_id", process.env.SERVICENOW_CLIENT_ID || "");
        params.append(
            "client_secret",
            process.env.SERVICENOW_CLIENT_SECRET || ""
        );
        params.append("refresh_token", token.refreshToken);

        const response = await axios.post(url, params.toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        return {
            ...token,
            accessToken: response.data.access_token,
            expires: Date.now() + response.data.expires_in * 1000,
            refreshToken: response.data.refresh_token ?? token.refreshToken, // Fall back to old refresh token
        };
    } catch (error) {
        console.log(error);

        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

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
                const accessToken = response.data.access_token;
                const refreshToken = response.data.refresh_token;
                const expires = response.data.expires_in;

                // Fetch user
                const fetchUserList = await axios.get(
                    `${process.env.SERVICENOW_URL}/api/now/table/sys_user?sysparm_query=sys_id=javascript:gs.getUserID()`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                const fetchUser: ServiceNowUser = fetchUserList.data.result[0];

                if (fetchUser) {
                    const user = {
                        id: fetchUser.sys_id,
                        name: fetchUser.name,
                        email: fetchUser.email,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        expires: Date.now() + expires * 1000, // Store the expiration timestamp,
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
                token.refreshToken = user.refreshToken;
            }
            if (Date.now() < token.expires) return token;
            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            session.user.accessToken = token.accessToken;
            session.expires = token.expires.toString();
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
