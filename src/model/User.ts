import mongoose, { Document, Model, Schema } from "mongoose";

// Define the enum for user roles
export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}

// Type Of Users
export interface IUser extends Document {
    email: string;
    password: string;
    role: UserRole; // Add the role field here
}

// Make Schema Of Users
const userSchema: Schema<IUser> = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        match: [/.+\@.+\..+/, "Invalid Email address"],
        lowercase: true 
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    role: {
        type: String,
        enum: Object.values(UserRole), // Use the enum values
        default: UserRole.USER // Set default role
    }
});

// Here make interface of model
interface UserModel extends Model<IUser> { };

// Extend Model
const User: UserModel = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model("User", userSchema);
export default User;
