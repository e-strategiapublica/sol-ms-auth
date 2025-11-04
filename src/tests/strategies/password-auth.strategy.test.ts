import { PasswordAuthStrategy } from "../../strategies/password-auth.strategy";
import type {
  IUserRepository,
  ITokenService,
  ICryptoService,
  IUserValidator,
  ITimingSafeService,
} from "../../interfaces/auth.interfaces";
import { AuthenticationError } from "../../services/user-validator.service";
import { MockFactory } from "../helpers/mock-factory";
import { TestDataFactory } from "../helpers/test-data-factory";
import { TEST_CONSTANTS } from "../constants/test-constants";

describe("PasswordAuthStrategy - SOLID Unit Tests", () => {
  let passwordAuthStrategy: PasswordAuthStrategy;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockTokenService: jest.Mocked<ITokenService>;
  let mockCryptoService: jest.Mocked<ICryptoService>;
  let mockUserValidator: jest.Mocked<IUserValidator>;
  let mockTimingSafeService: jest.Mocked<ITimingSafeService>;

  beforeEach(() => {
    // SRP: Criar mocks usando factory para consistência
    const mocks = MockFactory.createAllMocks();
    mockUserRepository = mocks.mockUserRepository;
    mockTokenService = mocks.mockTokenService;
    mockCryptoService = mocks.mockCryptoService;
    mockUserValidator = mocks.mockUserValidator;
    mockTimingSafeService = mocks.mockTimingSafeService;

    // DIP: Injeção de dependências via construtor
    passwordAuthStrategy = new PasswordAuthStrategy(
      mockUserRepository,
      mockTokenService,
      mockCryptoService,
      mockUserValidator,
      mockTimingSafeService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("authenticate - Success scenarios", () => {
    it("should authenticate successfully with valid password", async () => {
      const mockUser = TestDataFactory.createValidPasswordUser();

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockTimingSafeService.safeComparePassword.mockResolvedValue(true);
      mockTokenService.createTokenPayload.mockReturnValue(TEST_CONSTANTS.PASS_TOKEN_PAYLOAD);
      mockTokenService.generateToken.mockReturnValue(TEST_CONSTANTS.VALID_TOKEN);

      const result = await passwordAuthStrategy.authenticate(TEST_CONSTANTS.VALID_EMAIL, {
        password: TEST_CONSTANTS.VALID_PASSWORD,
      });

      expect(result).toEqual({
        token: TEST_CONSTANTS.VALID_TOKEN,
        user_id: TEST_CONSTANTS.USER_ID_STRING,
      });
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(TEST_CONSTANTS.VALID_EMAIL);
      expect(mockUserRepository.incrementFailedAttempts).toHaveBeenCalledWith(TEST_CONSTANTS.USER_ID);
      expect(mockUserRepository.resetFailedAttempts).toHaveBeenCalledWith(TEST_CONSTANTS.USER_ID);
      expect(mockTimingSafeService.safeComparePassword).toHaveBeenCalledWith(
        TEST_CONSTANTS.VALID_PASSWORD,
        TEST_CONSTANTS.PASSWORD_HASH,
        true
      );
    });

    it("should update existing token when provided", async () => {
      const mockUser = TestDataFactory.createValidPasswordUser();

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockTimingSafeService.safeComparePassword.mockResolvedValue(true);
      mockTokenService.updateTokenWithMethod.mockReturnValue(TEST_CONSTANTS.UPDATED_TOKEN);

      const result = await passwordAuthStrategy.authenticate(
        TEST_CONSTANTS.VALID_EMAIL,
        { password: TEST_CONSTANTS.VALID_PASSWORD },
        TEST_CONSTANTS.EXISTING_TOKEN
      );

      expect(result.token).toBe(TEST_CONSTANTS.UPDATED_TOKEN);
      expect(mockTokenService.updateTokenWithMethod).toHaveBeenCalledWith(
        TEST_CONSTANTS.EXISTING_TOKEN,
        "pass",
        expect.any(Number)
      );
    });

    it("should generate new token if update fails", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password_hash: "$2a$10$hash...",
        failed_attempts: 0,
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockTimingSafeService.safeComparePassword.mockResolvedValue(true);
      mockTokenService.updateTokenWithMethod.mockImplementation(() => {
        throw new Error("Invalid token");
      });
      mockTokenService.createTokenPayload.mockReturnValue({ sub: "1", method: "pass" });
      mockTokenService.generateToken.mockReturnValue("new.jwt.token");

      const result = await passwordAuthStrategy.authenticate(
        "test@example.com",
        { password: "SecurePass123!" },
        "invalid.token"
      );

      expect(result.token).toBe("new.jwt.token");
      expect(mockTokenService.generateToken).toHaveBeenCalled();
    });

    it("should call all validator methods for valid user", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password_hash: "$2a$10$hash...",
        failed_attempts: 0,
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockTimingSafeService.safeComparePassword.mockResolvedValue(true);
      mockTokenService.createTokenPayload.mockReturnValue({ sub: "1" });
      mockTokenService.generateToken.mockReturnValue("token");

      await passwordAuthStrategy.authenticate("test@example.com", {
        password: "SecurePass123!",
      });

      expect(mockUserValidator.validateUserAccess).toHaveBeenCalledWith(mockUser);
      expect(mockUserValidator.validatePassword).toHaveBeenCalledWith(mockUser);
      expect(mockUserValidator.validatePasswordAttempts).toHaveBeenCalledWith(mockUser);
    });
  });

  describe("authenticate - Failure scenarios", () => {
    it("should throw error when password is invalid", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password_hash: "$2a$10$hash...",
        failed_attempts: 0,
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockTimingSafeService.safeComparePassword.mockResolvedValue(false);

      // Act & Assert
      await expect(
        passwordAuthStrategy.authenticate("test@example.com", { password: "wrong-password" })
      ).rejects.toThrow(AuthenticationError);

      expect(mockUserRepository.incrementFailedAttempts).toHaveBeenCalledWith(1);
      expect(mockUserRepository.resetFailedAttempts).not.toHaveBeenCalled();
    });

    it("should throw error when user does not exist", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockTimingSafeService.safeComparePassword.mockResolvedValue(false);

      await expect(
        passwordAuthStrategy.authenticate("nonexistent@example.com", { password: "password" })
      ).rejects.toThrow("Invalid credentials");

      expect(mockUserRepository.incrementFailedAttempts).not.toHaveBeenCalled();
    });

    it("should throw error when user has no password set", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password_hash: null,
        failed_attempts: 0,
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockTimingSafeService.safeComparePassword.mockResolvedValue(false);
      mockUserValidator.validatePassword.mockImplementation(() => {
        throw new AuthenticationError("No password set");
      });

      await expect(
        passwordAuthStrategy.authenticate("test@example.com", { password: "password" })
      ).rejects.toThrow("No password set");
    });

    it("should throw error when user account is locked", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password_hash: "$2a$10$hash...",
        failed_attempts: 10,
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockTimingSafeService.safeComparePassword.mockResolvedValue(true);
      mockUserValidator.validateUserAccess.mockImplementation(() => {
        throw new AuthenticationError("Account locked");
      });

      await expect(
        passwordAuthStrategy.authenticate("test@example.com", { password: "password" })
      ).rejects.toThrow("Account locked");
    });

    it("should throw error when password attempts exceeded", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password_hash: "$2a$10$hash...",
        failed_attempts: 5,
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockTimingSafeService.safeComparePassword.mockResolvedValue(true);
      mockUserValidator.validatePasswordAttempts.mockImplementation(() => {
        throw new AuthenticationError("Too many failed attempts");
      });

      await expect(
        passwordAuthStrategy.authenticate("test@example.com", { password: "password" })
      ).rejects.toThrow("Too many failed attempts");

      expect(mockUserRepository.incrementFailedAttempts).toHaveBeenCalled();
    });
  });

  describe("authenticate - Security scenarios", () => {
    it("should always increment failed attempts before validation", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password_hash: "$2a$10$hash...",
        failed_attempts: 0,
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockTimingSafeService.safeComparePassword.mockResolvedValue(false);

      try {
        await passwordAuthStrategy.authenticate("test@example.com", { password: "wrong" });
      } catch (error) {
        // Expected
      }

      expect(mockUserRepository.incrementFailedAttempts).toHaveBeenCalledBefore(
        mockTimingSafeService.safeComparePassword as jest.Mock
      );
    });

    it("should use timing-safe comparison for passwords", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password_hash: "$2a$10$hash...",
        failed_attempts: 0,
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockTimingSafeService.safeComparePassword.mockResolvedValue(true);
      mockTokenService.createTokenPayload.mockReturnValue({ sub: "1" });
      mockTokenService.generateToken.mockReturnValue("token");

      await passwordAuthStrategy.authenticate("test@example.com", {
        password: "SecurePass123!",
      });

      expect(mockTimingSafeService.safeComparePassword).toHaveBeenCalledWith(
        "SecurePass123!",
        "$2a$10$hash...",
        true
      );
    });

    it("should return generic error message for user enumeration protection", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockTimingSafeService.safeComparePassword.mockResolvedValue(false);

      await expect(
        passwordAuthStrategy.authenticate("nonexistent@example.com", { password: "password" })
      ).rejects.toThrow("Invalid credentials");
    });

    it("should handle special characters in password correctly", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password_hash: "$2a$10$hash...",
        failed_attempts: 0,
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockTimingSafeService.safeComparePassword.mockResolvedValue(true);
      mockTokenService.createTokenPayload.mockReturnValue({ sub: "1" });
      mockTokenService.generateToken.mockReturnValue("token");

      const result = await passwordAuthStrategy.authenticate("test@example.com", {
        password: "P@ssw0rd!#$%^&*()",
      });

      expect(result).toBeDefined();
      expect(mockTimingSafeService.safeComparePassword).toHaveBeenCalledWith(
        "P@ssw0rd!#$%^&*()",
        "$2a$10$hash...",
        true
      );
    });
  });

  describe("authenticate - LSP Principle", () => {
    it("should be interchangeable with any IAuthenticationStrategy implementation", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password_hash: "$2a$10$hash...",
        failed_attempts: 0,
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockTimingSafeService.safeComparePassword.mockResolvedValue(true);
      mockTokenService.createTokenPayload.mockReturnValue({ sub: "1" });
      mockTokenService.generateToken.mockReturnValue("token");

      const strategy: import("../../interfaces/auth.interfaces").IAuthenticationStrategy =
        passwordAuthStrategy;
      const result = await strategy.authenticate("test@example.com", {
        password: "password",
      });

      expect(result).toHaveProperty("token");
      expect(result).toHaveProperty("user_id");
    });
  });
});
