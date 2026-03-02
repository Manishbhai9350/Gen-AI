import { configDotenv } from "dotenv";
import express, { urlencoded } from "express";
import { Connect } from "./config/db.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import CookieParser from "cookie-parser";
import { AuthRouter } from "./routes/auth.route.js";
configDotenv();
const app = express();
Connect();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(CookieParser());
app.use(urlencoded({ extended: true }));
app.use(errorHandler);
app.use("/auth", AuthRouter);
app.get("/", (req, res) => {
    return res.status(201).json({
        message: "Hallo From GEN AI:<manish>",
        success: true,
    });
});
app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map