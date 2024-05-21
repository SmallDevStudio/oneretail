import NextAuth from "next-auth/next";
import LineProvider from "next-auth/providers/line";

export const authOptions = {
    providers: [
        LineProvider({
            clientId: process.env.NEXT_PUBLIC_LINE_CHANNEL_ID,
            clientSecret: process.env.NEXT_PUBLIC_CHANNEL_SECRET,
            client: {
                id_token_signed_response_alg: "HS256",
            },
            redirectUri: process.env.NEXT_PUBLIC_CHANNEL_REDIRECT_URI,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async session({ session, token, user }) {
            session.accessToken = token.accessToken;
            session.idtoken = token.idToken;
            return session;
        },
        async jwt({ token, account, profile }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
              token.accessToken = account.access_token;
              token.idtoken = account.id_token
            }
            return token
          },

        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            return baseUrl
        },
        async line({ token, account, profile }) {
            if (token) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    accessToken: token.accessToken,
                    ...token,
                }
            }
            return null
        }
    },

    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        maxAge: 60 * 60 * 24 * 30,
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
        generateSessionToken: () => {
            return randomUUID?.() ?? randomBytes(32).toString("hex")
          }
    },
};

export default NextAuth(authOptions);