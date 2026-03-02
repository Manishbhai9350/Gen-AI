import { UserModel } from "../models/user.model.js";
import { AppError } from "../middlewares/error.middleware.js";
import { decrypt, encrypt } from "../utils/encryption.js";
import { GenerateToken } from "../utils/jwt.js";
export const RegisterUserController = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        // validation
        if (!username || !email || !password) {
            return next(new AppError("All fields are required", 400));
        }
        // check existing user
        const existingUser = await UserModel.findOne({
            $or: [{ email }, { username }],
        });
        if (existingUser) {
            if (existingUser.username == username) {
                return next(new AppError("User already exists with this username", 409));
            }
            else {
                return next(new AppError("User already exists with this email", 409));
            }
        }
        const hashedPassword = encrypt(password);
        // create user
        const newUser = await UserModel.create({
            username,
            email,
            password: hashedPassword,
        });
        const Token = GenerateToken({
            email,
            username,
            id: newUser._id,
        }, 1000 * 60 * 60 * 24 * 3);
        return res
            .status(200)
            .cookie("auth_token", Token)
            .json({
            success: true,
            message: "User registered successfully",
            data: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const LoginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // validation
        if (!email || !password) {
            return next(new AppError("Email and password are required", 400));
        }
        // check user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return next(new AppError("Invalid email or password", 401));
        }
        // check password
        if (decrypt(user.password) !== password) {
            return next(new AppError("Invalid email or password", 401));
        }
        const Token = GenerateToken({
            email,
            username: user.username,
            id: user._id,
        }, 1000 * 60 * 60 * 24 * 3);
        return res
            .status(200)
            .cookie("auth_token", Token)
            .json({
            success: true,
            message: "Login successful",
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=auth.controller.js.map