import NextAuth from "next-auth/next";
import LineProvider from "next-auth/providers/line";

export const authOptions = {
    providers: [
        LineProvider({
            clientId: process.env.LINE_CHANNEL_ID,
            clientSecret: process.env.LIFF_CHANNEL_SECRET,
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
        async signIn(user, account, profile) {
            const userId = profile.userId;
      
            // ตรวจสอบว่าผู้ใช้ได้เพิ่ม LINE OA แล้วหรือยัง
            const response = await axios.get(`https://api.line.me/v2/bot/friendship/status?userId=${userId}`, {
              headers: {
                Authorization: `Bearer ${process.env.LIFF_CHANNEL_ACCESS_TOKEN}`,
              },
            });
      
            if (response.data.friendFlag === true) {
              // ผู้ใช้ได้เพิ่ม LINE OA แล้ว
              return true;
            } else {
              // ผู้ใช้ยังไม่ได้เพิ่ม LINE OA
              return false;
            }
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
        async redirect({ url, baseUrl }) {
            return baseUrl;
        },
    },
   

};

export default NextAuth(authOptions);