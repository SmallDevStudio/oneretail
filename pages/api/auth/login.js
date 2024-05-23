import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import jwt from "jsonwebtoken";
import axios from "axios";


const handler = async (req, res) => {
    if (req.method === "POST") {
        const session = await getIronSession(req, res, sessionOptions);
        const { idToken } = req.body;

        try {
            const response = await axios.get(`https://api.line.me/oauth2/v2.1/verify`, {
                params: {
                    id_token: idToken,
                    client_id: process.env.LINE_CHANNEL_ID
                },
            });

            const { sub: userid, name, pictureUrl } = response.data;
            const token = jwt.sign({ userid, name, pictureUrl }, process.env.JWT_SECRET, {
                expiresIn: "30d",
            });

            session.isLoggedIn = true;
            session.user = { userid, name, pictureUrl };
            session.accessToken = token;
            await session.save();
            res.status(200).json({ token });
        } catch (error) {
            res.status(400).json({ message: 'Failed to login', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default handler;