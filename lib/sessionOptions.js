export const sessionOptions = {
    cookiename: 'session',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
}
