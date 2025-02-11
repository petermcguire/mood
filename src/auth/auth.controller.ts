import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from './constants';
import { AuthResponseDto } from './dto/authResponse.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req): AuthResponseDto {
    const response = new AuthResponseDto();
    response.userId = req.user.id;
    response.access_token = this.authService.login(req.user);
    return response;
  }
}
