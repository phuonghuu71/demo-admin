import { signIn, signOut } from "next-auth/react";
import AuthError from "next-auth";

export async function handleServiceNowSignIn({
    email,
    password,
}: {
    email: string;
    password: string;
}) {
    try {
        await signIn("servicenow", { email, password });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error) {
                default:
                    return {
                        message: "Something went wrong.",
                    };
            }
        }
        throw error;
    }
}

export async function handleServiceNowSignInOauth() {
    try {
        await signIn("servicenow_oauth2");
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error) {
                default:
                    return {
                        message: "Something went wrong.",
                    };
            }
        }
        throw error;
    }
}

export async function handleSignOut() {
    await signOut();
}
