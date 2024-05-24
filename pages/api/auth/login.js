export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
    }
    res.status(200).json({ message: 'Login successful' });
}