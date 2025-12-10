// Setup file para testes Jest
// Este arquivo é executado antes de todos os testes

// Configurar matchers personalizados para Jest
expect.extend({
  toHaveBeenCalledBefore(received: jest.Mock, expected: jest.Mock) {
    const receivedCalls = received.mock.invocationCallOrder || [];
    const expectedCalls = expected.mock.invocationCallOrder || [];

    if (receivedCalls.length === 0) {
      return {
        message: () => `Expected ${received.getMockName()} to have been called before ${expected.getMockName()}, but it was never called`,
        pass: false,
      };
    }

    if (expectedCalls.length === 0) {
      return {
        message: () => `Expected ${expected.getMockName()} to have been called, but it was never called`,
        pass: false,
      };
    }

    const pass = receivedCalls[0]! < expectedCalls[0]!;

    if (pass) {
      return {
        message: () => `Expected ${received.getMockName()} not to have been called before ${expected.getMockName()}`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected ${received.getMockName()} to have been called before ${expected.getMockName()}`,
        pass: false,
      };
    }
  },
});

// Estender tipagem do Jest para incluir matcher customizado
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveBeenCalledBefore(expected: jest.Mock): R;
    }
  }
}

// Configurar variáveis de ambiente para testes
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1h';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'test_db';
process.env.DB_USER = 'test_user';
process.env.DB_PASSWORD = 'test_password';

// Mock console para reduzir ruído nos testes (opcional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
// };
