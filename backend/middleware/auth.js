import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization; // "Bearer tokenstring"

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.json({ success: false, message: "Not Authorized, Login Again" });
        }

        const token = authHeader.split(" ")[1]; // Get token after "Bearer"
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = { id: decoded.id }; // Store in req.user
        next();
    } catch (error) {
        console.error("Auth error:", error);
        return res.json({ success: false, message: error.message });
    }
};

export default authMiddleware;
