import { JwtStrategy } from '../jwt.strategy';
import { UnauthorizedException } from '@nestjs/common'; // Adjust the path if necessary

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  const req = { params: { id: '12345' } };

  beforeEach(() => {
    jwtStrategy = new JwtStrategy();
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return the user object with userId and username', async () => {
      const payload = { sub: 12345, username: 'testuser' };

      const result = await jwtStrategy.validate(req, payload);

      expect(result).toEqual({
        userId: payload.sub,
        username: payload.username,
      });
    });

    it('should throw an error when JWT userId does not match params id', async () => {
      const payload = { sub: 12346, username: 'testuser' };

      await expect(jwtStrategy.validate(req, payload)).rejects.toThrow(
        new UnauthorizedException(),
      );
    });
  });
});
