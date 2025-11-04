import type { Request, Response } from "express";

/**
 * Controller para testes de desenvolvimento
 * Disponível apenas em ambiente de desenvolvimento
 */
class TestController {
  /**
   * Testa a conexão com MailHog
   * GET /test/mailhog
   */
  async testMailHog(req: Request, res: Response): Promise<void> {
    // Verifica se estamos em desenvolvimento
    if (process.env.NODE_ENV !== "development") {
      res.status(403).json({
        error: "Forbidden",
        message: "Test endpoints are only available in development environment",
        statusCode: 403,
      });
      return;
    }

    try {
      console.log("🧪 Testing MailHog via API endpoint...");
      
      res.status(200).json({
        message: "MailHog test endpoint available",
        mailhogUrl: "http://localhost:8025",
        instructions: "Use POST /method/email/send to test email functionality",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ MailHog test failed:", error);
      
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to test MailHog",
        details: error instanceof Error ? error.message : "Unknown error",
        statusCode: 500,
      });
    }
  }

  /**
   * Informações sobre os testes disponíveis
   * GET /test
   */
  async getTestInfo(req: Request, res: Response): Promise<void> {
    if (process.env.NODE_ENV !== "development") {
      res.status(403).json({
        error: "Forbidden",
        message: "Test endpoints are only available in development environment",
        statusCode: 403,
      });
      return;
    }

    res.status(200).json({
      message: "Development test endpoints",
      environment: process.env.NODE_ENV,
      availableTests: {
        mailhog: {
          endpoint: "GET /test/mailhog",
          description: "Test MailHog email capturing info",
        },
        emailFlow: {
          endpoint: "POST /method/email/send",
          description: "Test complete email authentication flow",
        },
      },
      architecture: {
        status: "SOLID principles applied",
        emailService: "Refactored with dependency injection",
        providers: ["MailHog (dev)", "SMTP (prod)"],
      },
    });
  }
}

const testController = new TestController();

export default {
  testMailHog: testController.testMailHog.bind(testController),
  getTestInfo: testController.getTestInfo.bind(testController),
};
