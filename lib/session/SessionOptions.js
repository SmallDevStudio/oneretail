import { SessionOption } from 'iron-session';

export const SessionData = {
    isLoggedIn: false,
};

export const SessionOptions = {
    password: process.env.NEXTAUTH_SECRET,
    cookieName: 'lama-session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
};