import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

// Nestjs has a built-in testing framework called Jest.
// the first argument is the name of the test suite. you can use arbitrary names, but it's a good practice to use descriptive names. The name should be descriptive and meaningful so that when tests fail, you can quickly understand what functionality is broken
// the second argument is a function that contains the tests.
describe('CreateUserDto', () => {
  let dto = new CreateUserDto();

  beforeEach(() => {
    dto = new CreateUserDto();
    dto.email = 'test@test.com';
    dto.name = 'Piotr';
    dto.password = '123456A#';
  });

  // 多个it测试方法，按照定义的顺序执行
  it('should validate complete valid data', async () => {
    // Arrange
    // Act
    const errors = await validate(dto);
    // Assert
    expect(errors.length).toBe(0);
  });

  it('should fail on invalid email', async () => {
    // Arrange
    dto.email = 'test';
    // Act
    const errors = await validate(dto);
    // Assert
    expect(errors.length).toBe(1);
    // console.log(errors);
    // 下面的判断基于输出的errors信息
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  // * the following is a Test-Driven Development (TDD) approach
  const testPassword = async (password: string, message: string) => {
    dto.password = password;
    const errors = await validate(dto);
    const passwordError = errors.find((error) => error.property === 'password');
    expect(passwordError).not.toBeUndefined();
    const messages = Object.values(passwordError?.constraints ?? {});
    expect(messages).toContain(message);
  };

  // 1) At least 1 uppercase letter
  // 2) At least 1 number
  // 3) At least 1 special character
  it('should fail without 1 uppercase letter', async () => {
    await testPassword(
      'abcdef',
      'Password must contain at least 1 uppercase letter',
    );
  });

  it('should fail without at least 1 number', async () => {
    await testPassword('abdefaA', 'Password must contain at least 1 number');
  });

  it('should fail without at least 1 special character', async () => {
    await testPassword(
      'abdefaA1',
      'Password must contain at least 1 special character',
    );
  });
});
