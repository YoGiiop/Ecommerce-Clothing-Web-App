import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized - No token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "admin") {
            return res.status(403).json({ success: false, message: 'Unauthorized - Admin access required' });
        }

        next();
    } catch (error) {
        console.error(error);
        const statusCode = error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError' ? 401 : 500;
        const message = statusCode === 401 ? 'Session expired. Please log in again.' : 'Error authenticating';
        res.status(statusCode).json({ success: false, message, error: error.message });
    }
};

export default adminAuth;
