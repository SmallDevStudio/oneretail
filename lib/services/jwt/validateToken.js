import jwt from 'jsonwebtoken';

export const validateToken = (token) => {
    const validate = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) throw new Error(err)
    });
    return validate
}