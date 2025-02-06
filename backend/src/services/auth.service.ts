import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { OAuth2Client } from "google-auth-library";
import { randomBytes } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
    constructor() {}

    // async register(name: string, email: string, password: string) {
    //     const existingUser = await User.findOne({ email });
    //     if (existingUser) throw new Error("User already exists");

    //     const hashedPassword = await bcrypt.hash(password, 10);
    //     const user = new User({ name, email, password: hashedPassword });
    //     await user.save();

    //     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    //     return { token, user };
    // }

    // async login(email: string, password: string) {
    //     const user = await User.findOne({ email });
    //     if (!user) throw new Error("Invalid credentials");

    //     const isMatch = await bcrypt.compare(password, user.password);
    //     if (!isMatch) throw new Error("Invalid credentials");

    //     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    //     return { token, user };
    // }

    async googleLogin(credential: string) {
        const payload = await this.verifyGoogleToken(credential);
        if (!payload) {
            throw new Error('Invalid token');
        }
 
        const user = await this.findOrCreateGoogleUser(payload);
        const token = this.generateToken(user?._id);
 
        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        };
    }
 
    private async verifyGoogleToken(credential: string) {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        return ticket.getPayload();
    }
 
    private async findOrCreateGoogleUser(payload: any) {
        let user = await User.findOne({ email: payload.email });
        if (!user) {
            user = await User.create({
                name: payload.name,
                email: payload.email,
                password: randomBytes(20).toString('hex')
            });
        }
        return user;
    }
 
    private generateToken(userId: string | any) {
        return jwt.sign(
            { userId: userId.toString() },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );
    }
}