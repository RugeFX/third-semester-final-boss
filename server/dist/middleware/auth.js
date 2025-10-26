import HttpError from '../common/exceptions/http.error';
import { env } from '../env';
import jwt from 'jsonwebtoken';
export const authenticateJWT = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] }, (error, userPayload) => {
            if (error) {
                return next(new HttpError(401, 'Unauthorized: Invalid or expired token'));
            }
            req.user = userPayload;
            console.log('Authenticated user:', req.user);
            next();
        });
    }
    else {
        return next(new HttpError(401, 'Unauthorized: No token provided'));
    }
};
export const authorizeAdmin = (req, _res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    else {
        return next(new HttpError(403, 'Forbidden: Admins only'));
    }
};
export default { authenticateJWT, authorizeAdmin };
//# sourceMappingURL=auth.js.map