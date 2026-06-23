import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Yêu cầu 3: Đăng ký + Mã hóa băm mật khẩu
  async register(registerDto: RegisterDto): Promise<User> {
    const { username, password } = registerDto;

    const userExist = await this.userRepository.findOne({
      where: { username },
    });
    if (userExist) {
      throw new BadRequestException('Tài khoản đã tồn tại!');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.userRepository.create({
      username,
      password: hashedPassword,
    });

    return await this.userRepository.save(newUser);
  }

  // Yêu cầu 4: Đăng nhập lấy JWT
  async login(loginDto: RegisterDto) {
    const { username, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username: user.username, sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu!');
  }
}
