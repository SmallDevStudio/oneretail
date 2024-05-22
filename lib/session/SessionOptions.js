import { SessionOption } from 'iron-session';

export const defaultSession = {
    user: {},
    isLoggedIn: false,
};

export const SessionOptions = {
    password: process.env.NEXTAUTH_SECRET,
    cookieName: 'user_info',
    cookieOptions: {
        secure: false,
    },
};