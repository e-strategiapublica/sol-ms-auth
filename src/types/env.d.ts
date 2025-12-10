declare namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    NODE_ENV: "development" | "staging" | "production" | "test";
    DB_HOST: string;
    DB_PORT: number;
    DB_NAME: string;
    DB_USER: string;
    DB_PASSWORD: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    API_PREFIX: string;
    RATE_LIMIT_WINDOW: number;
    RATE_LIMIT_MAX_REQUESTS: number;
    LOG_LEVEL: "debug" | "info" | "warn" | "error";
  }
}
