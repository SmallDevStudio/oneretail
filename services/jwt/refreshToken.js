import jwt from 'jsonwebtoken';

export const refreshToken = (data) => {
    const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1m', algorithm: 'HS256' });

    return refreshToken;
}