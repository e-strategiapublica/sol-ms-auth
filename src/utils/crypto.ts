import bcrypt from "bcryptjs";
import crypto from "crypto";

export const generateSalt = (): string => {
  return bcrypt.genSaltSync(parseInt(process.env.PASSWORD_SALT_ROUNDS || "12"));
};

export const hashPassword = (password: string, salt: string): string => {
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};

export const generateEmailCode = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

export const isEmailCodeExpired = (expiresAt: Date): boolean => {
  return new Date() > expiresAt;
};
