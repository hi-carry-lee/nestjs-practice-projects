import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestSetup } from './utils/test-setup';

describe('AppController (e2e)', () => {
  let testSetup: TestSetup;

  beforeEach(async () => {
    testSetup = await TestSetup.create(AppModule);
  });

  afterEach(async () => {
    await testSetup.cleanup();
  });

  afterAll(async () => {
    await testSetup.teardown();
  });

  it('/ (GET)', () => {
    return request(testSetup.app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => expect(res.text).toContain('Hello World'));
  });
});
/*
"request(testSetup.app.getHttpServer())" 这行代码会提示：
  Unsafe argument of type `any` assigned to a parameter of type `App`.eslint@typescript-eslint/no-unsafe-argument
  Ctrl+click to open in new tab
  (method) INestApplication<any>.getHttpServer(): any
  Returns the underlying native HTTP server.

原因是：
getHttpServer() 方法返回 any 类型，是因为底层 HTTP 服务器可能是 Express、Fastify 等不同实现，为了保持灵活性，NestJS 选择返回 any 类型
而supertest 的 request() 函数期望接收一个 App 类型（来自 supertest/types）；

在源码里面：
1. TServer 是一个泛型参数，默认值是 any
  当你创建 INestApplication 时，如果没有指定泛型，TServer 就是 any；
2. 在 TestSetup 中
  app: INestApplication;  没有指定泛型，所以 TServer = any
  因此 getHttpServer(): any 返回 any 类型

解决方案：
在test-setup.ts文件是：
引入Server类型：import { Server } from 'http'; 
为app添加泛型 ：app: INestApplication<Server>;

why it works?
Server 是 Node.js 的 基础 HTTP 服务器类型，Express、Fastify 等框架都是基于这个 Server 类型构建的，它们都实现了相同的接口
*/
