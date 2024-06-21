import NextAuth from "next-auth/next";
import LineProvider from "next-auth/providers/line";

export const authOptions = {
    providers: [
        LineProvider({
            clientId: process.env.LINE_CHANNEL_ID,
            clientSecret: process.env.LIFF_CHANNEL_SECRET,
            params: { 
                bot_prompt: "aggressive" 
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
        async redirect({ url, baseUrl }) {
            return baseUrl;
        },
    },
   

};

export default NextAuth(authOptions);