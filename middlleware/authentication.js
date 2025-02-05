const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require('../models/User'); // Adjust the path as needed
const SECRET_ACCESS_TOKEN = "tokensecret"; // Use an env variable in production

const authMiddleware = asyncHandler(async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, SECRET_ACCESS_TOKEN);
        
        // Fetch the user from DB (Optional: only if needed)
        const user = await User.findById(decoded.id).select("-password"); // Exclude password
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
        }

        req.user = user; // Attach user data to request object
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
});

module.exports = authMiddleware;


