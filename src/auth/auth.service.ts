import { Injectable,ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

 
  async register(dto: RegisterDto) {
    
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    
    const hash = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
      },
    });

    return this.generateTokens(user.id, user.email);
  }

 
  async generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(dto: LoginDto) {

  const user = await this.prisma.user.findUnique({
    where: { email: dto.email }
  });

  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const passwordValid = await argon2.verify(user.password, dto.password);

  if (!passwordValid) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const tokens = await this.generateTokens(user.id, user.email);

  return tokens;
}

async refresh(refreshToken: string) {

  try {

    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET
    });

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub }
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const tokens = await this.generateTokens(user.id, user.email);

    return tokens;

  } catch {
    throw new UnauthorizedException('Invalid refresh token');
  }

}

}