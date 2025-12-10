// Manual validation for development (tsx compatibility)
// Production will use Typia with proper build process

export interface EmailAuthRequest {
  identifier: string;
  params: {
    code: string;
  };
}

export interface PasswordAuthRequest {
  identifier: string;
  params: {
    password: string;
  };
}

export interface EmailSendRequest {
  identifier: string;
}

export interface AuthResponse {
  token: string;
}

export interface ErrorResponse {
  error: string;
  message?: string;
}

interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password complexity regex: at least 1 lowercase, 1 uppercase, 1 number, 8+ chars
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

// 6-digit code regex
const CODE_REGEX = /^[0-9]{6}$/;

export const validateEmailAuth = (data: any): ValidationResult<EmailAuthRequest> => {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { success: false, errors: ['Invalid request body'] };
  }

  if (!data.identifier || typeof data.identifier !== 'string') {
    errors.push('identifier is required and must be a string');
  } else if (!EMAIL_REGEX.test(data.identifier)) {
    errors.push('identifier must be a valid email address');
  }

  if (!data.params || typeof data.params !== 'object') {
    errors.push('params is required and must be an object');
  } else {
    if (!data.params.code || typeof data.params.code !== 'string') {
      errors.push('params.code is required and must be a string');
    } else if (!CODE_REGEX.test(data.params.code)) {
      errors.push('params.code must be exactly 6 digits');
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      identifier: data.identifier,
      params: {
        code: data.params.code
      }
    }
  };
};

export const validatePasswordAuth = (data: any): ValidationResult<PasswordAuthRequest> => {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { success: false, errors: ['Invalid request body'] };
  }

  if (!data.identifier || typeof data.identifier !== 'string') {
    errors.push('identifier is required and must be a string');
  } else if (!EMAIL_REGEX.test(data.identifier)) {
    errors.push('identifier must be a valid email address');
  }

  if (!data.params || typeof data.params !== 'object') {
    errors.push('params is required and must be an object');
  } else {
    if (!data.params.password || typeof data.params.password !== 'string') {
      errors.push('params.password is required and must be a string');
    } else {
      if (data.params.password.length < 8) {
        errors.push('params.password must be at least 8 characters long');
      }
      if (data.params.password.length > 128) {
        errors.push('params.password must not exceed 128 characters');
      }
      if (!PASSWORD_REGEX.test(data.params.password)) {
        errors.push('params.password must contain at least one lowercase letter, one uppercase letter, and one number');
      }
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      identifier: data.identifier,
      params: {
        password: data.params.password
      }
    }
  };
};

export const validateEmailSend = (data: any): ValidationResult<EmailSendRequest> => {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { success: false, errors: ['Invalid request body'] };
  }

  if (!data.identifier || typeof data.identifier !== 'string') {
    errors.push('identifier is required and must be a string');
  } else if (!EMAIL_REGEX.test(data.identifier)) {
    errors.push('identifier must be a valid email address');
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      identifier: data.identifier
    }
  };
};
