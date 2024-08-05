import mongoose, { Schema } from "mongoose";

interface UserDAO extends Document {
    _id: string;
    email: string;
    username: string;
    google_id: string;
}

const userSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        google_id: {
            type: String,
            required: true,
        },
        picture: {
            type: String,
            required: true,
        }
    } as const,
    { _id: false },
);

export const User = mongoose.model<UserDAO>("User", userSchema);
