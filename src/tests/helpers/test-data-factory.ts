// Factory para criar dados de teste consistentes
export const TestDataFactory = {
  createMockUser: (overrides: Partial<any> = {}) => ({
    id: 1,
    email: "test@example.com",
    email_code: "123456",
    email_code_expires_at: new Date(Date.now() + 10000),
    password_hash: "$2a$10$hash...",
    failed_attempts: 0,
    ...overrides,
  }),

  createValidEmailCodeUser: (overrides: Partial<any> = {}) => ({
    id: 1,
    email: "test@example.com",
    email_code: "123456",
    email_code_expires_at: new Date(Date.now() + 10000),
    failed_attempts: 0,
    ...overrides,
  }),

  createExpiredEmailCodeUser: (overrides: Partial<any> = {}) => ({
    id: 1,
    email: "test@example.com",
    email_code: "123456",
    email_code_expires_at: new Date(Date.now() - 10000),
    failed_attempts: 0,
    ...overrides,
  }),

  createValidPasswordUser: (overrides: Partial<any> = {}) => ({
    id: 1,
    email: "test@example.com",
    password_hash: "$2a$10$hash...",
    failed_attempts: 0,
    ...overrides,
  }),

  createLockedUser: (overrides: Partial<any> = {}) => ({
    id: 1,
    email: "test@example.com",
    email_code: "123456",
    email_code_expires_at: new Date(Date.now() + 10000),
    password_hash: "$2a$10$hash...",
    failed_attempts: 10,
    ...overrides,
  }),

  createAuthResponse: (overrides: Partial<any> = {}) => ({
    token: "jwt.token.here",
    user_id: "1",
    ...overrides,
  }),
};
