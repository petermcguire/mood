import { JwtStrategy } from '../jwt.strategy'; // Adjust the path if necessary

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(() => {
    jwtStrategy = new JwtStrategy();
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return the user object with userId and username', async () => {
      const payload = {
        sub: '12345',
        username: 'testuser',
      };

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({
        userId: payload.sub,
        username: payload.username,
      });
    });
  });
});
