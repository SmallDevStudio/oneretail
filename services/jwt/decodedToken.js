import jwt from 'jsonwebtoken';

export const decodedToken = (token, secret) => {
    return jwt.decode(token, { complete: true }, secret);
}