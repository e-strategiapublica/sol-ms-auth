import { Router } from "express";
import testController from "../controllers/test.controller";

const router = Router();


router.get("/", testController.getTestInfo);
router.get("/mailhog", testController.testMailHog);

export default router;
