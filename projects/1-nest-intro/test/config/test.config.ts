export const testConfig = {
  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: '123456',
    database: 'tasks_e2e',
    synchronize: true,
  },
  app: {
    messagePrefix: '',
  },
  auth: {
    jwt: {
      secret: 'secret-123',
      expiresIn: '1m',
    },
  },
};
