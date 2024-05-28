import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

export function signJwt(payload) {
    return jwt.sign(payload, secret, { expiresIn: '30d' });
}

export function verifyJwt(token) {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
}

export function decodeJwt(token) {
    try {
        return jwt.decode(token, { complete: true });
    } catch (error) {
        return null;
    }
}