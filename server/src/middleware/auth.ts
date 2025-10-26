import { Request, Response, NextFunction } from 'express';
import HttpError from '../common/exceptions/http.error';
import { env } from '../env';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

// Extend Express Request interface to include 'user' property
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

/**
 * Middleware to authenticate and authorize JWT tokens
 * @param {Request} req - Express request object
 * @param {Response} _res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {void}
 */
export const authenticateJWT = (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        // Verify token
        jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] }, (error, userPayload) => {
            // If token is invalid or expired
            if (error) {
                return next(new HttpError(401, 'Unauthorized: Invalid or expired token'));
            }

            // Attach user payload to the request object
            req.user = userPayload as JwtPayload;

            console.log('Authenticated user:', req.user);

            next();
        });
    } else {
        return next(new HttpError(401, 'Unauthorized: No token provided'));
    }
}


/**
 * Middleware to authorize admin users only
 * @param {Request} req - Express request object
 * @param {Response} _res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {void}
 */
export const authorizeAdmin = (req: Request, _res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        return next(new HttpError(403, 'Forbidden: Admins only'));
    }
}

export default { authenticateJWT, authorizeAdmin };