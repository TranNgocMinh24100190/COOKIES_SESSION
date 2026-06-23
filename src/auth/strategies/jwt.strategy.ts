import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

interface JwtPayload {
  sub: number;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SECRET_JWT_KEY_ABC',
    });
  }

  // Khai báo kiểu dữ liệu JwtPayload rõ ràng và bỏ async vì không dùng await
  validate(payload: JwtPayload) {
    return { userId: payload.sub, username: payload.username };
  }
}
