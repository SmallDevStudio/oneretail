import { serialize, parse } from 'cookie';
import CryptoJS from 'crypto-js';

export function createSession({ value, secret, sessionoptions={cookiename, maxAge, httpOnly, securesession} }) {
    const encrypteValue = encrypt(value, secret);
    return serialize(sessionoptions.cookiename, encrypteValue, {
        httpOnly: sessionoptions.httpOnly,
        maxAge: sessionoptions.maxAge,
        secure: sessionoptions.securesession
    });
}

export function getSession (req, secret, sessionoptions) {
    const cookies = parse(req.headers.cookie || '');
    const encryptedValue = cookies[sessionoptions.cookiename];
    if (encryptedValue) return null;
    return decrypt(encryptedValue, secret);
}

export function deleteSession(sessionoptions) {
    return serialize(sessionoptions.cookiename, '', {
        maxAge: 0,
        path: '/',
    });
}

function encrypt(value, secret) {
    const encrypted = CryptoJS.AES.encrypt(value, secret);
    return encrypted.toString();
}
    
function decrypt(value, secret) {
    const bytes = CryptoJS.AES.decrypt(value, secret);
    return bytes.toString(CryptoJS.enc.Utf8);
}