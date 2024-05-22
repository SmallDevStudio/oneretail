import { getIronSession } from "iron-session";

export async function getSession() {
    const session = await getIronSession(cookies(), SessionOptions);
    return session;
}