import { Router } from "express";
const userRouter = Router();

import userController from "../controllers/user.controller";

userRouter.get("/", userController.getUsers);

export default userRouter;
