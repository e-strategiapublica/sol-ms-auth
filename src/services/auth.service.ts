import userRepository from "../repositories/user.repository";
import { generateToken, updateTokenWithMethod, type JWTPayload } from "../config/jwt";
import { comparePassword, generateEmailCode, isEmailCodeExpired } from "../utils/crypto";
import { sendEmailCode } from "../utils/email";
import type { AuthResponse, EmailCodeData } from "../types/auth";

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

class UserNotFoundError extends Error {
  constructor(message: string = "User not found") {
    super(message);
    this.name = "UserNotFoundError";
  }
}

const authenticateWithEmail = async (
  identifier: string,
  code: string,
  existingToken?: string
): Promise<AuthResponse> => {
  const user = await userRepository.findByEmail(identifier);
  
  if (!user) {
    throw new UserNotFoundError();
  }

  if (user.is_blocked) {
    throw new AuthenticationError("User is blocked");
  }

  if (!user.email_code || !user.email_code_expires_at) {
    throw new AuthenticationError("No active email code");
  }

  if (user.email_code !== code) {
    throw new AuthenticationError("Invalid email code");
  }

  if (isEmailCodeExpired(new Date(user.email_code_expires_at))) {
    throw new AuthenticationError("Email code expired");
  }

  // Reset failed attempts on successful authentication
  await userRepository.resetFailedAttempts(user.id);

  const timestamp = Math.floor(Date.now() / 1000);
  let token: string;

  if (existingToken) {
    try {
      token = updateTokenWithMethod(existingToken, "email", timestamp);
    } catch (error) {
      // If token is invalid, create a new one
      const payload: JWTPayload = {
        sub: user.id.toString(),
        nbf: timestamp,
        methods: { email: timestamp },
      };
      token = generateToken(payload);
    }
  } else {
    const payload: JWTPayload = {
      sub: user.id.toString(),
      nbf: timestamp,
      methods: { email: timestamp },
    };
    token = generateToken(payload);
  }

  return {
    token,
    user_id: user.id.toString(),
  };
};

const authenticateWithPassword = async (
  identifier: string,
  password: string,
  existingToken?: string
): Promise<AuthResponse> => {
  const user = await userRepository.findByEmail(identifier);
  
  if (!user) {
    throw new UserNotFoundError();
  }

  if (user.is_blocked) {
    throw new AuthenticationError("User is blocked");
  }

  if (!user.password_hash || !user.password_salt) {
    throw new AuthenticationError("Password not set for this user");
  }

  const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS || "5");
  if (user.failed_login_attempts >= maxAttempts) {
    throw new AuthenticationError("Too many failed attempts. User is temporarily blocked");
  }

  const isValidPassword = comparePassword(password, user.password_hash);
  
  if (!isValidPassword) {
    await userRepository.incrementFailedAttempts(user.id);
    throw new AuthenticationError("Invalid password");
  }

  // Reset failed attempts on successful authentication
  await userRepository.resetFailedAttempts(user.id);

  const timestamp = Math.floor(Date.now() / 1000);
  let token: string;

  if (existingToken) {
    try {
      token = updateTokenWithMethod(existingToken, "pass", timestamp);
    } catch (error) {
      // If token is invalid, create a new one
      const payload: JWTPayload = {
        sub: user.id.toString(),
        nbf: timestamp,
        methods: { pass: timestamp },
      };
      token = generateToken(payload);
    }
  } else {
    const payload: JWTPayload = {
      sub: user.id.toString(),
      nbf: timestamp,
      methods: { pass: timestamp },
    };
    token = generateToken(payload);
  }

  return {
    token,
    user_id: user.id.toString(),
  };
};

const sendEmailAuthCode = async (identifier: string): Promise<void> => {
  const user = await userRepository.findByEmail(identifier);
  
  if (!user) {
    throw new UserNotFoundError();
  }

  if (user.is_blocked) {
    throw new AuthenticationError("User is blocked");
  }

  const code = generateEmailCode();
  const expirationMinutes = parseInt(process.env.EMAIL_CODE_EXPIRATION || "300");
  const expiresAt = new Date(Date.now() + expirationMinutes * 1000);

  await userRepository.updateEmailCode(identifier, code, expiresAt);
  await sendEmailCode(identifier, code);
};

const authService = {
  authenticateWithEmail,
  authenticateWithPassword,
  sendEmailAuthCode,
  AuthenticationError,
  UserNotFoundError,
};

export default authService;