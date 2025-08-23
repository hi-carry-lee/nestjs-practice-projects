import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
// The jest.mock() runs BEFORE any imports! so here bcrypt is mocked one
import * as bcrypt from 'bcrypt';

/*
TODO why mock bcrypt?
1. bcrypt is already tested by its maintainers
2. You're testing your integration logic, not the hashing algorithm
3. You want to verify your service calls bcrypt correctly
*/
/*
TODO what it does:
1. You mock bcrypt → ALL bcrypt imports become mocked
2. Your service imports bcrypt → gets the mocked version
3. Your service uses bcrypt.hash() → uses the mocked function
*/
jest.mock('bcrypt', () => ({
  // jest.fn(): Creates a mock function (also called a "spy" or "stub")
  hash: jest.fn(),
  compare: jest.fn(),
}));

/*
what's the meaning of this test file? Since the functions to be tested are simple, it seems pointless to test them
1. ensure Method Signatures & Return Types
    so if some one refactor the code with wrong signature or return type, the test will fail
2. ensure it's a Async Behavior
    so if some one refactor the code to be sync, the test will fail
*/
describe('PasswordService', () => {
  let service: PasswordService;

  // todo What Test Module Does
  // 1. Create a test environment(container)
  // 2. Register PasswordService in this environment
  // 3. Create an instance of PasswordService using the DI container
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  // todo use this test case to check if the service is defined when:
  // 1. You're using dependency injection
  // 2. Your service has dependencies
  // 3. You want early failure detection
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // hash()
  // plain text -> hash
  // for the same input -> the same output
  // 12345678 -> skjdskdjskdjskf83u8rye
  // ------------
  // bcrypt.hash -> was called
  //             -> password was passed to it & salt rounds
  // mocks & spies
  it('should hash password', async () => {
    const mockHash = 'hashed_password';
    // bcrypt.hash is the mocked function, jest.Mock is the type that Jest provides for mock functions
    // this line: Takes the mocked bcrypt.hash function,Configures it to return mockHash when called
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);
    const password = 'password123';
    const result = await service.hash(password);
    // Verify that bcrypt.hash was called with password as first argument and with 10 as second argument
    // it's not necessary for checking hash function;
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(result).toBe(mockHash);
  });

  it('should correctly verify password', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const result = await service.verify('password123', 'hashed_password');
    expect(bcrypt.compare).toHaveBeenCalledWith(
      'password123',
      'hashed_password',
    );
    expect(result).toBe(true);
  });

  /*
  todo Why this test case is redundant?
  1. To test the compare function, we have done it by the previous test case
  2. Compare function doesn't have any other business logic, it's simple;
  3. so we can delete this test case;
  */
  it('should fail on incorrect password', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    const result = await service.verify('wrong_password', 'hashed_password');
    expect(bcrypt.compare).toHaveBeenCalledWith(
      'wrong_password',
      'hashed_password',
    );
    expect(result).toBe(false);
  });
});
