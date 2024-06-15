import mongoose from "mongoose";
import Level from "@/database/models/Level";
import Point from "@/database/models/Point";

export const calculateLevel = async (totalpoint) => {
    const levels = await Level.find().sort({ requiredPoints: 1 });
    let userLevel = 0;

    for (let i = 0; i < levels.length; i++) {
        if (totalpoint >= levels[i].requiredPoints) {
            userLevel = levels[i].level;
        } else {
            break;
        }
    }

    return userLevel;
}