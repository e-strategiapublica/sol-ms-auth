export interface AuthRequest {
  identifier: string;
  params: Record<string, any>;
}

export interface EmailAuthParams {
  code: string;
}

export interface PasswordAuthParams {
  password: string;
}

export interface EmailSendRequest {
  identifier: string;
}

export interface AuthResponse {
  token: string;
  user_id: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

export interface EmailCodeData {
  code: string;
  expiresAt: Date;
}
