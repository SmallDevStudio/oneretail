import jwt from 'jsonwebtoken';

export const generateToken = (data) => {
    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m', algorithm: 'HS256' });
    return accessToken;
}