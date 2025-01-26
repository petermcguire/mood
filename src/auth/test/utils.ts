import { User } from '../../user/entities/user.entity';

export const oneUser = new User();
oneUser.name = 'user';
oneUser.password = 'password';

export const jwtToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTczNzg0MDc2MywiZXhwIjoxNzM3ODQwODIzfQ.XkOBNHU2DAEjIaw8XeLkvviBDcjeinZjT43YpQxjjj40;';
