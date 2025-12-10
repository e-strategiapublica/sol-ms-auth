import { EmailAuthStrategy } from "../../strategies/email-auth.strategy";
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

describe("EmailAuthStrategy - SOLID Unit Tests", () => {
  let emailAuthStrategy: EmailAuthStrategy;
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
    emailAuthStrategy = new EmailAuthStrategy(
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
    it("should authenticate successfully with valid email code", async () => {
      const mockUser = TestDataFactory.createValidEmailCodeUser();

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockTimingSafeService.safeCompareEmailCode.mockResolvedValue(true);
      mockCryptoService.isEmailCodeExpired.mockReturnValue(false);
      mockTokenService.createTokenPayload.mockReturnValue(TEST_CONSTANTS.EMAIL_TOKEN_PAYLOAD);
      mockTokenService.generateToken.mockReturnValue(TEST_CONSTANTS.VALID_TOKEN);

      const result = await emailAuthStrategy.authenticate(TEST_CONSTANTS.VALID_EMAIL, { code: TEST_CONSTANTS.VALID_CODE });

      expect(result).toEqual({
        token: TEST_CONSTANTS.VALID_TOKEN,
        user_id: TEST_CONSTANTS.USER_ID_STRING,
      });
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(TEST_CONSTANTS.VALID_EMAIL);
      expect(mockUserRepository.incrementFailedAttempts).toHaveBeenCalledWith(TEST_CONSTANTS.USER_ID);
      expect(mockUserRepository.resetFailedAttempts).toHaveBeenCalledWith(TEST_CONSTANTS.USER_ID);
      expect(mockTimingSafeService.safeCompareEmailCode).toHaveBeenCalledWith(
        TEST_CONSTANTS.VALID_CODE,
        TEST_CONSTANTS.VALID_CODE,
        true
      );
    });

    it("should update existing token when provided", async () => {
      const mockUser = TestDataFactory.createValidEmailCodeUser();

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockTimingSafeService.safeCompareEmailCode.mockResolvedValue(true);
      mockCryptoService.isEmailCodeExpired.mockReturnValue(false);
      mockTokenService.updateTokenWithMethod.mockReturnValue(TEST_CONSTANTS.UPDATED_TOKEN);

      const result = await emailAuthStrategy.authenticate(
        TEST_CONSTANTS.VALID_EMAIL,
        { code: TEST_CONSTANTS.VALID_CODE },
        TEST_CONSTANTS.EXISTING_TOKEN
      );

      expect(result.token).toBe(TEST_CONSTANTS.UPDATED_TOKEN);
      expect(mockTokenService.updateTokenWithMethod).toHaveBeenCalled();
    });

    it("should generate new token if update fails", async () => {
      const mockUser = TestDataFactory.createValidEmailCodeUser();

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockTimingSafeService.safeCompareEmailCode.mockResolvedValue(true);
      mockCryptoService.isEmailCodeExpired.mockReturnValue(false);
      mockTokenService.updateTokenWithMethod.mockImplementation(() => {
        throw new Error("Invalid token");
      });
      mockTokenService.createTokenPayload.mockReturnValue(TEST_CONSTANTS.EMAIL_TOKEN_PAYLOAD);
      mockTokenService.generateToken.mockReturnValue(TEST_CONSTANTS.NEW_TOKEN);

      const result = await emailAuthStrategy.authenticate(
        TEST_CONSTANTS.VALID_EMAIL,
        { code: TEST_CONSTANTS.VALID_CODE },
        TEST_CONSTANTS.INVALID_TOKEN
      );

      expect(result.token).toBe(TEST_CONSTANTS.NEW_TOKEN);
      expect(mockTokenService.generateToken).toHaveBeenCalled();
    });
  });

  describe("authenticate - Failure scenarios", () => {
    it("should throw error when email code is invalid", async () => {
      const mockUser = TestDataFactory.createValidEmailCodeUser();

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockTimingSafeService.safeCompareEmailCode.mockResolvedValue(false);
      mockCryptoService.isEmailCodeExpired.mockReturnValue(false);

      await expect(
        emailAuthStrategy.authenticate(TEST_CONSTANTS.VALID_EMAIL, { code: TEST_CONSTANTS.INVALID_CODE })
      ).rejects.toThrow(AuthenticationError);

      expect(mockUserRepository.incrementFailedAttempts).toHaveBeenCalledWith(TEST_CONSTANTS.USER_ID);
      expect(mockUserRepository.resetFailedAttempts).not.toHaveBeenCalled();
    });

    it("should throw error when email code is expired", async () => {
      const mockUser = TestDataFactory.createExpiredEmailCodeUser();

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockTimingSafeService.safeCompareEmailCode.mockResolvedValue(true);
      mockCryptoService.isEmailCodeExpired.mockReturnValue(true);

      await expect(
        emailAuthStrategy.authenticate(TEST_CONSTANTS.VALID_EMAIL, { code: TEST_CONSTANTS.VALID_CODE })
      ).rejects.toThrow("Email code expired");
    });

    it("should throw error when no email code exists", async () => {
      const mockUser = TestDataFactory.createValidEmailCodeUser({ email_code: null, email_code_expires_at: null });

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockTimingSafeService.safeCompareEmailCode.mockResolvedValue(false);

      await expect(
        emailAuthStrategy.authenticate(TEST_CONSTANTS.VALID_EMAIL, { code: TEST_CONSTANTS.VALID_CODE })
      ).rejects.toThrow("No active email code");
    });

    it("should throw error when user does not exist", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockTimingSafeService.safeCompareEmailCode.mockResolvedValue(false);

      await expect(
        emailAuthStrategy.authenticate(TEST_CONSTANTS.NONEXISTENT_EMAIL, { code: TEST_CONSTANTS.VALID_CODE })
      ).rejects.toThrow("Invalid credentials");

      expect(mockUserRepository.incrementFailedAttempts).not.toHaveBeenCalled();
    });

    it("should throw error when user validation fails", async () => {
      const mockUser = TestDataFactory.createLockedUser();

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockTimingSafeService.safeCompareEmailCode.mockResolvedValue(true);
      mockUserValidator.validateUserAccess.mockImplementation(() => {
        throw new AuthenticationError("Account locked");
      });

      await expect(
        emailAuthStrategy.authenticate(TEST_CONSTANTS.VALID_EMAIL, { code: TEST_CONSTANTS.VALID_CODE })
      ).rejects.toThrow("Account locked");

      expect(mockUserRepository.incrementFailedAttempts).toHaveBeenCalledWith(TEST_CONSTANTS.USER_ID);
    });
  });

  describe("authenticate - Security scenarios", () => {
    it("should always increment failed attempts before validation", async () => {
      const mockUser = TestDataFactory.createValidEmailCodeUser();

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockTimingSafeService.safeCompareEmailCode.mockResolvedValue(false);

      try {
        await emailAuthStrategy.authenticate(TEST_CONSTANTS.VALID_EMAIL, { code: TEST_CONSTANTS.INVALID_CODE });
      } catch (error) {
        // Expected
      }

      expect(mockUserRepository.incrementFailedAttempts).toHaveBeenCalledBefore(
        mockTimingSafeService.safeCompareEmailCode as jest.Mock
      );
    });

    it("should use timing-safe comparison for email codes", async () => {
      const mockUser = TestDataFactory.createValidEmailCodeUser();

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockTimingSafeService.safeCompareEmailCode.mockResolvedValue(true);
      mockCryptoService.isEmailCodeExpired.mockReturnValue(false);
      mockTokenService.createTokenPayload.mockReturnValue(TEST_CONSTANTS.EMAIL_TOKEN_PAYLOAD);
      mockTokenService.generateToken.mockReturnValue("token");

      await emailAuthStrategy.authenticate(TEST_CONSTANTS.VALID_EMAIL, { code: TEST_CONSTANTS.VALID_CODE });

      expect(mockTimingSafeService.safeCompareEmailCode).toHaveBeenCalledWith(
        TEST_CONSTANTS.VALID_CODE,
        TEST_CONSTANTS.VALID_CODE,
        true
      );
    });

    it("should return generic error message for user enumeration protection", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockTimingSafeService.safeCompareEmailCode.mockResolvedValue(false);

      await expect(
        emailAuthStrategy.authenticate(TEST_CONSTANTS.NONEXISTENT_EMAIL, { code: TEST_CONSTANTS.VALID_CODE })
      ).rejects.toThrow("Invalid credentials");
    });
  });
});
