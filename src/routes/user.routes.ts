import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
const userRouter = Router();

const controller = new UserController();

userRouter.get("/", controller.getUsers);
userRouter.get("/:id", controller.getUserById);
userRouter.post("/", controller.createUser);
userRouter.delete("/:id", controller.deleteUser);
userRouter.patch("/:id", controller.updateUser);

export default userRouter;
