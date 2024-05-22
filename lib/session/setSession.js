"use server"
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export async function setSession({ data }) {
    const session = await getIronSession(cookies(), SessionOptions);

    session.isLoggedInLine = true;
    session.user = data;
    await session.save();

    return session
}
