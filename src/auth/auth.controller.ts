import type { Request, Response } from 'express';
import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

// Định nghĩa kiểu dữ liệu cấu trúc Session tùy chỉnh
interface CustomSession {
  views?: number;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: RegisterDto) {
    return this.authService.login(loginDto);
  }

  @Get('test-cookie-session')
  testCookieSession(@Req() req: Request, @Res() res: Response) {
    res.cookie('my_cookie', 'NestJS_Codespace_Test', {
      maxAge: 900000,
      httpOnly: true,
    });

    // Ép kiểu ép buộc về cấu trúc CustomSession rõ ràng
    const session = req.session as CustomSession;
    session.views = (session.views || 0) + 1;

    return res.send({
      message: 'Set Cookie thành công!',
      session_views: `Bạn đã xem trang này ${session.views} lần.`,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return {
      message: 'Bạn đã truy cập thành công API bảo mật bằng JWT!',
      user: req.user,
    };
  }
}
