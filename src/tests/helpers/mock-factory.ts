import type {
  IUserRepository,
  ITokenService,
  ICryptoService,
  IUserValidator,
  ITimingSafeService,
} from "../../interfaces/auth.interfaces";

// Factory para criar mocks consistentes
export const MockFactory = {
  createMockUserRepository: (): jest.Mocked<IUserRepository> => ({
    findByEmail: jest.fn(),
    resetFailedAttempts: jest.fn(),
    incrementFailedAttempts: jest.fn(),
    updateEmailCode: jest.fn(),
  }),

  createMockTokenService: (): jest.Mocked<ITokenService> => ({
    generateToken: jest.fn(),
    updateTokenWithMethod: jest.fn(),
    createTokenPayload: jest.fn(),
  }),

  createMockCryptoService: (): jest.Mocked<ICryptoService> => ({
    comparePassword: jest.fn(),
    generateEmailCode: jest.fn(),
    isEmailCodeExpired: jest.fn(),
  }),

  createMockUserValidator: (): jest.Mocked<IUserValidator> => ({
    validateUserAccess: jest.fn(),
    validatePasswordAttempts: jest.fn(),
    validateEmailCode: jest.fn(),
    validatePassword: jest.fn(),
  }),

  createMockTimingSafeService: (): jest.Mocked<ITimingSafeService> => ({
    safeComparePassword: jest.fn(),
    safeCompareEmailCode: jest.fn(),
  }),

  // Helper para criar todos os mocks de uma vez
  createAllMocks: () => ({
    mockUserRepository: MockFactory.createMockUserRepository(),
    mockTokenService: MockFactory.createMockTokenService(),
    mockCryptoService: MockFactory.createMockCryptoService(),
    mockUserValidator: MockFactory.createMockUserValidator(),
    mockTimingSafeService: MockFactory.createMockTimingSafeService(),
  }),
};
