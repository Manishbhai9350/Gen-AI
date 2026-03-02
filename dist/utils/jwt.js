import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.JWT_SECRET;
export const GenerateToken = (payload, expiresIn) => {
    if (expiresIn) {
        return jwt.sign(payload, secret, { expiresIn });
    }
    return jwt.sign(payload, secret);
};
export const DecodeToken = (token) => {
    return jwt.verify(token, secret);
};
//# sourceMappingURL=jwt.js.map