// middleware/authorizeRoles.js
const jwt = require("jsonwebtoken");

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: "Access denied" });
            }

            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
    };
};

module.exports = authorizeRoles;
