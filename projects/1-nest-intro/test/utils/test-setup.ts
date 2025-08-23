// #region Imports - Dependencies needed for testing
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { testConfig } from '../config/test.config';
import { Server } from 'http'; // 添加这个导入
// #endregion
/*
TODO:
这个文件是E2E 测试的配置和工具类，它的主要作用是：
1. 测试环境管理
2. 配置覆盖
3. 数据库清理
4. 资源管理
*/

export class TestSetup {
  // !测试环境管理
  app: INestApplication<Server>;
  dataSource: DataSource;

  // 用静态方法来封装创建测试环境的逻辑
  static async create(module: any) {
    const instance = new TestSetup();
    await instance.init(module);
    return instance;
  }

  // Sets up testing module with custom configuration
  private async init(module: any) {
    // 1. 创建测试模块
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [module],
    })
      // !2. 覆盖配置服务
      .overrideProvider(ConfigService)
      .useValue({
        get: (key: string) => {
          if (key.includes('database')) return testConfig.database;
          if (key.includes('app')) return testConfig.app;
          if (key.includes('auth')) return testConfig.auth;
          return null;
        },
      })
      .compile();

    // 3. 创建 NestJS 应用
    this.app = moduleFixture.createNestApplication();
    // 4. 配置全局管道
    this.app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    // 5. 获取数据库连接
    this.dataSource = moduleFixture.get(DataSource);
    // 6. 初始化应用（启动服务器、连接数据库等）
    await this.app.init();
  }

  // !数据库清理
  async cleanup() {
    // Get all entity metadata to find table names
    const entities = this.dataSource.entityMetadatas;
    // Create list of table names for SQL query
    const tableNames = entities
      .map((entity) => `"${entity.tableName}"`)
      .join(', ');
    // TRUNCATE removes all data
    // RESTART IDENTITY resets auto-increment counters
    // CASCADE handles foreign key relationships
    await this.dataSource.query(
      `TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`,
    );
  }
  // #endregion

  // #region Cleanup - Properly closing everything after tests
  // Properly close database and app after tests
  // !资源管理
  async teardown() {
    await this.dataSource.destroy(); // Close database connection
    await this.app.close(); // Shut down NestJS app
  }
  // #endregion
}
