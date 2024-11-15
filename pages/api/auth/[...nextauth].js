import NextAuth from "next-auth";
import LineProvider from "next-auth/providers/line";

export const authOptions = {
    providers: [
        LineProvider({
            clientId: process.env.LINE_CHANNEL_ID,
            clientSecret: process.env.LIFF_CHANNEL_SECRET,
            authorization: {
                params: { 
                    bot_prompt: "aggressive"
                },
            },
        }),
    ],
    pages: {
        signIn: "/login",
        register: "/register",
        error: "/auth/error",
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    callbacks: {
        async redirect({ url, baseUrl }) {
            // Ensure the redirect is always using NEXTAUTH_URL
            return process.env.NEXTAUTH_URL || baseUrl;
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token, user }) {
            session.user = token.user;
            return session;
        },
    },
};

export default NextAuth(authOptions);
