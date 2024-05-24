import { createSession, getSession, deleteSession } from "@/lib/session";

export default function handler(req, res) {
    if (req.method === "POST") {

        const { value, secret, sessionoptions } = req.body;
        const cookie = createSession({ value, secret, sessionoptions });
        res.setHeader("Set-Cookie", cookie);
        res.status(200).json({ message: "Session created successfully" });
    } else if (req.method === "GET") {
        const session = getSession(req, cookiename, secret);
        if (!session) {
            res.status(404).json({ message: "No session found" });
        } else {
            res.status(200).json({ session });
        }
    } else if (req.method === "DELETE") {
        const cookie = deleteSession(cookiename);
        res.setHeader("Set-Cookie", cookie);
        res.status(200).json({ message: "Session deleted successfully" });
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}