import { app } from "../app.js";
import authRouter from "../modules/auth/auth.route.js";
import userRouter from "../modules/user/user.route.js";

app.use('/api/v1/auth', authRouter);

app.use("/api/v1/user", userRouter
)