// Constantes para testes
export const TEST_CONSTANTS = {
  // Emails
  VALID_EMAIL: "test@example.com",
  NONEXISTENT_EMAIL: "nonexistent@example.com",
  LOCKED_EMAIL: "locked@example.com",

  // Códigos
  VALID_CODE: "123456",
  INVALID_CODE: "wrong-code",
  EXPIRED_CODE: "expired",

  // Senhas
  VALID_PASSWORD: "SecurePass123!",
  INVALID_PASSWORD: "wrong-password",
  SPECIAL_CHARS_PASSWORD: "P@ssw0rd!#$%^&*()",

  // Tokens
  VALID_TOKEN: "jwt.token.here",
  EXISTING_TOKEN: "existing.token",
  INVALID_TOKEN: "invalid.token",
  UPDATED_TOKEN: "updated.jwt.token",
  NEW_TOKEN: "new.jwt.token",

  // IDs
  USER_ID: 1,
  USER_ID_STRING: "1",

  // Timestamps
  TEN_SECONDS_MS: 10000,
  FUTURE_DATE: () => new Date(Date.now() + TEST_CONSTANTS.TEN_SECONDS_MS),
  PAST_DATE: () => new Date(Date.now() - TEST_CONSTANTS.TEN_SECONDS_MS),

  // Hash
  PASSWORD_HASH: "$2a$10$hash...",

  // Tentativas
  NO_FAILED_ATTEMPTS: 0,
  FEW_FAILED_ATTEMPTS: 5,
  MANY_FAILED_ATTEMPTS: 10,

  // Token Payloads
  EMAIL_TOKEN_PAYLOAD: { sub: "1", nbf: 0, methods: { email: 0 } },
  PASS_TOKEN_PAYLOAD: { sub: "1", nbf: 0, methods: { pass: 0 } },
};
