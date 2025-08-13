const winston = require('winston');

beforeAll(() => {
  winston.configure({
    level: 'error',
    transports: [
      new winston.transports.Console({ silent: true })
    ]
  });
});

afterAll(() => {
  winston.configure({
    level: 'info',
    transports: [
      new winston.transports.Console()
    ]
  });
});

global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
