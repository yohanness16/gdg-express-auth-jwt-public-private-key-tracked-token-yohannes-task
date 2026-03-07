import {Router} from "express"
import { getUser } from "../controllers/user.controller.js";
import { authenticateAccessToken } from "../middlewares/authenticate.middleware.js";
const userRouter = Router();

userRouter.get("/me",authenticateAccessToken,getUser)

export default userRouter;