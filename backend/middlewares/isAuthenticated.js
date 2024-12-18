import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "User Not Authenticated", success: false });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        // Attach user ID to the request object
        req.id = decoded.userId;

        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Authentication Error: ", error);
        return res.status(401).json({ message: "Invalid or expired token", success: false });
    }
};

export default isAuthenticated;
