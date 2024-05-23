export const sessionOptions = {
    password: process.env.SESSION_SECRET,
    cookieName: 'session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
    },
};


