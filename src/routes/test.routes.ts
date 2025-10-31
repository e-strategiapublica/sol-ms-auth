import { Router } from "express";
import testController from "../controllers/test.controller";

const router = Router();

/**
 * Rotas de teste - disponíveis apenas em desenvolvimento
 * Prefixo: /test
 */

// GET /test - Informações sobre testes disponíveis
router.get("/", testController.getTestInfo);

// GET /test/mailhog - Testa integração com MailHog
router.get("/mailhog", testController.testMailHog);

export default router;
