import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class FirebaseAuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {
        // Initialize Firebase Admin SDK if not already initialized
        if (!admin.apps.length) {
            const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
            if (!serviceAccountPath) {
                throw new Error('FIREBASE_SERVICE_ACCOUNT_PATH env variable not set');
            }
            const serviceAccount = require(serviceAccountPath);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        }
    }

    /**
     * Verify a Firebase ID token, find or create a corresponding user, and return a JWT.
     */
    async verifyFirebaseToken(idToken: string): Promise<{ accessToken: string; user: any }> {
        let decodedToken: admin.auth.DecodedIdToken;
        try {
            decodedToken = await admin.auth().verifyIdToken(idToken);
        } catch (e) {
            throw new UnauthorizedException('Invalid Firebase ID token');
        }

        const firebaseUid = decodedToken.uid;
        const email = decodedToken.email || null;
        const phone = decodedToken.phone_number || null;

        // Find existing user by firebaseUid (stored in a custom field `firebaseUid`), or create one.
        let user = await this.usersService.findOneByFirebaseUid(firebaseUid);
        if (!user) {
            // Create a new user with role CUSTOMER by default.
            user = await this.usersService.createWithFirebase(firebaseUid, email, phone, UserRole.CUSTOMER);
        }

        // Generate JWT for the user.
        const payload = { sub: user.id, phone: user.phone, role: user.role };
        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            user: { id: user.id, phone: user.phone, role: user.role, email: user.email },
        };
    }
}
