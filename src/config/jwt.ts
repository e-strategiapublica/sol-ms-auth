import jwt from "jsonwebtoken";

export interface JWTPayload {
  sub: string; // user ID
  nbf: number; // not before timestamp
  methods: {
    [method: string]: number; // timestamp of last authentication with this method
  };
}

export interface JWTConfig {
  secret: string;
  expiresIn: string;
}

export const jwtConfig: JWTConfig = {
  secret: process.env.JWT_SECRET || "your-secret-key",
  expiresIn: process.env.JWT_EXPIRES_IN || "24h",
};

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, jwtConfig.secret) as JWTPayload;
};

export const updateTokenWithMethod = (
  existingToken: string,
  method: string,
  timestamp: number
): string => {
  try {
    const decoded = verifyToken(existingToken);
    decoded.methods[method] = timestamp;
    decoded.nbf = timestamp;
    return generateToken(decoded);
  } catch (error) {
    throw new Error("Invalid token");
  }
};