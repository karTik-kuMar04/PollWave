import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
 


const verifyJWT = (res, req, next) => {
    try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : req.cookies?.accessToken;
        if (!token) return res.status(401).json({ message: "No token" });

        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = payload;
        next();
    } catch (error) {
        throw new apiError(401, "Invalid Token")
    }
}

export { verifyJWT }