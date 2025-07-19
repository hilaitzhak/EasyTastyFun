import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { OAuth2Client } from "google-auth-library";
import { randomBytes } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
    constructor() { }

    async googleLogin(credential: string) {
        const payload = await this.verifyGoogleToken(credential);
        if (!payload) {
            throw new Error('Invalid token');
        }

        // Whitelist check
        const allowedEmails = [
            'hila87219@gmail.com',
            'yoram2121961@gmail.com',
            'kokhiy1803@gmail.com',
            'tomerzaidler@gmail.com'
        ];

        if (!allowedEmails.includes(payload.email || '')) {
            throw new Error('Unauthorized: This email is not allowed to login.');
        }

        const user = await this.findOrCreateGoogleUser(payload);
        const token = this.generateToken(user.id);

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        };
    }

    private async verifyGoogleToken(credential: string) {
        try {
            console.log('verifyGoogleToken - start', credential);
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const res = ticket.getPayload();
            console.log('verifyGoogleToken - end', { ticket, res });
            return res;
        } catch (error: any) {
            console.error('Error verifying Google token:', error);
            return null;
        }
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