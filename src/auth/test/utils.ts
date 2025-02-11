import { User } from '../../user/entities/user.entity';

export const oneUser = new User();
oneUser.name = 'user';
oneUser.password = 'password';
oneUser.id = 1;

export const jwtToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOjEsImlhdCI6MTczNzg0MDc2MywiZXhwIjoxNzM3ODQwODIzfQ.' +
  'XkOBNHU2DAEjIaw8XeLkvviBDcjeinZjT43YpQxjjj40;';

export const mockAuthService = {
  login: jest.fn().mockReturnValue(jwtToken),
};

export const authResponse = {
  userId: oneUser.id,
  access_token: jwtToken,
};
