import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { Req } from '@nestjs/common';
import type { Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}    


@Post('register')
async register(
  @Body() dto: RegisterDto,
  @Res({ passthrough: true }) res: Response){

    const tokens = await this.authService.register(dto);

    res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true, secure: true, sameSite: 'lax'});
 
    return {
      accessToken: tokens.accessToken
    };
}

@Post('login')
async login(
  @Body() dto: LoginDto,
  @Res({ passthrough: true }) res: Response
) {

  const tokens = await this.authService.login(dto);

  res.cookie('refreshToken', tokens.refreshToken, {
  httpOnly: true,
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  secure: true,
  sameSite: 'none'
});

  return {
    accessToken: tokens.accessToken
  };
}
@Post('refresh')
async refresh(
  @Req() req: Request,
  @Res({ passthrough: true }) res: Response
) {

  const refreshToken = req.cookies.refreshToken;

  const tokens = await this.authService.refresh(refreshToken);

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    secure: true,
    sameSite: 'none'
  });

  return {
    accessToken: tokens.accessToken
  };
 
}

@Post('logout')
async logout(
  @Res({ passthrough: true }) res: Response
) {

  res.clearCookie('refreshToken');

  return {
    message: 'Logout successful'
  };

}


}