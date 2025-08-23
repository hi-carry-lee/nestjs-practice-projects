import { TaskStatus } from './../src/tasks/task.model';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestSetup } from './utils/test-setup';

describe('Tasks (e2e)', () => {
  let testSetup: TestSetup;
  let authToken: string;
  let taskId: string;

  const testUser = {
    email: 'test@example.com',
    password: 'Password123!',
    name: 'Test User',
  };

  beforeEach(async () => {
    testSetup = await TestSetup.create(AppModule);

    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    const loginResponse = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send(testUser)
      .expect(201);

    // authToken = loginResponse.body.accessToken;
    authToken = (loginResponse.body as { accessToken: string }).accessToken;

    const response = await request(testSetup.app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Task',
        description: 'Test Desc',
        status: TaskStatus.OPEN,
        labels: [{ name: 'test' }],
      });

    // taskId = response.body.id;
    taskId = (response.body as { id: string }).id;
  });

  afterEach(async () => {
    await testSetup.cleanup();
  });

  afterAll(async () => {
    await testSetup.teardown();
  });

  it('should not allow access to other users tasks', async () => {
    const otherUser = { ...testUser, email: 'other@example.com' };
    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(otherUser)
      .expect(201);

    const loginResponse = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send(otherUser)
      .expect(201);

    // const otherToken = loginResponse.body.accessToken;
    const otherToken = (loginResponse.body as { accessToken: string })
      .accessToken;
    await request(testSetup.app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403);
  });

  it('should list users tasks only', async () => {
    await request(testSetup.app.getHttpServer())
      .get(`/tasks`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect((res.body as { meta: { total: number } }).meta.total).toBe(1);
      });

    const otherUser = { ...testUser, email: 'other@example.com' };
    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(otherUser)
      .expect(201);

    const loginResponse = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send(otherUser)
      .expect(201);

    // const otherToken = loginResponse.body.accessToken;
    const otherToken = (loginResponse.body as { accessToken: string })
      .accessToken;
    await request(testSetup.app.getHttpServer())
      .get(`/tasks`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(200)
      .expect((res) => {
        expect((res.body as { meta: { total: number } }).meta.total).toBe(0);
      });
  });
});

/*
!类型问题：
authToken = loginResponse.body.accessToken; 这行代码提示：Unsafe assignment of an `any` value

原因：supertest 的响应对象 response.body 返回 any 类型

解决办法：
1.类型断言（推荐）：
authToken = (loginResponse.body as { accessToken: string }).accessToken;

2.类型声明：
interface LoginResponse {
  accessToken: string;
}
authToken = (loginResponse.body as LoginResponse).accessToken;
*/
