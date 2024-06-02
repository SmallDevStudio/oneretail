import { createContext, useContext, useState } from "react";

export const UserContext = createContext({
    user: null,
    isRegistered: false,
});