import { env } from 'node:process';

import { Body, Controller, Get, Post, Request, Res } from '@nestjs/common';
import { Response } from 'express';

import { Public, RawResponse } from '../../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

function getCookieValue(req: any, name: string): string | undefined {
  const cookieHeader: string | undefined = req?.headers?.cookie;
  if (!cookieHeader) {
    return undefined;
  }
  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [key, ...rest] = cookie.trim().split('=');
    if (key === name) {
      return decodeURIComponent(rest.join('='));
    }
  }
  return undefined;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('codes')
  async getCodes(@Request() req) {
    const username = req.user?.username;
    if (!username) {
      return [];
    }
    const codes = await this.authService.getCodes(username);
    return codes;
  }

  @Post('login')
  @Public()
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { refreshToken: _refreshToken, ...data } = result;
    return data;
  }

  @Post('logout')
  @Public()
  async logout(@Request() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = getCookieValue(req, 'refresh_token');
    await this.authService.logout(refreshToken);
    res.clearCookie('refresh_token');
    return '';
  }

  @Post('refresh')
  @Public()
  @RawResponse()
  async refresh(@Request() req, @Res({ passthrough: true }) res: Response) {
    const incomingRefreshToken =
      getCookieValue(req, 'refresh_token') ?? req?.body?.refreshToken ?? '';
    const result = await this.authService.refresh(incomingRefreshToken);

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return result.accessToken;
  }
}
