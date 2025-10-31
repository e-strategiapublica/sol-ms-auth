import { Router } from "express";
const userRouter = Router();

import * as userController from "../controllers/user.controller";

userRouter.get("/", userController.getUsers);
userRouter.get("/:id", userController.getUserById);
userRouter.post("/", userController.createUser);
userRouter.delete("/:id", userController.deleteUser);
userRouter.put("/:id", userController.updateUser);

export default userRouter;
