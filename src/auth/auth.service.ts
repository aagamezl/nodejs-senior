import { randomBytes } from 'node:crypto';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Customer } from '@prisma/client';

import sha512 from 'src/utils/sha512';
// import { Customer } from 'src/lib/entities/customer.entity';
import { PrismaService } from 'src/prisma.service';
import { SignInInput } from './dto/signin.input';
import { SignUpInput } from './dto/signup.input';
import { config } from 'src/config';
import { JwtPayload } from './interfaces/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {
  }

  async activateAccount(activationCode: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { activationCode }
    });

    if (!customer) {
      return null; // Invalid activation code
    }

    return this.prisma.customer.update({
      where: { activationCode },
      data: { activated: true }
    });
  }

  async signIn(signInInput: SignInInput) {
    const customer = await this.prisma.customer.findFirst({
      where: {
        email: signInInput.email,
        password: sha512(signInInput.password)
      }
    });

    if (!customer || !customer.activated) {
      throw new UnauthorizedException('Access Denied');
    }

    const { accessToken, refreshToken } = await this.createTokens(customer);

    await this.updateRefreshToken(customer.id, refreshToken);

    return { accessToken, refreshToken, customer };
  }

  async signUp(signUpInput: SignUpInput) {
    const customer = await this.prisma.customer.create({
      data: {
        ...signUpInput,
        password: sha512(signUpInput.password),
        activationCode: this.generateActivationCode()
      }
    });

    return customer.activationCode;

    // const { accessToken, refreshToken } = await this.createTokens(customer);

    // await this.updateRefreshToken(customer.id, refreshToken);

    // return { accessToken, refreshToken, customer };
  }

  // private async createTokens({ id, email, role }: Customer) {
  private async createTokens(payload: JwtPayload) {
    // const accessToken = await this.jwtService.signAsync({
    //   id,
    //   email,
    //   role
    // }, {
    //   expiresIn: config.accessTokenExpireIn,
    //   secret: config.accessTokenSecret
    // });
    const accessToken = await this.sign(
      payload,
      config.accessTokenSecret,
      config.accessTokenExpireIn
    );

    // const refreshToken = await this.jwtService.signAsync({
    //   id,
    //   email,
    //   role,
    //   accessToken
    // }, {
    //   expiresIn: config.refreshTokenExpireIn,
    //   secret: config.refreshTokenSecret
    // });
    const refreshToken = await this.sign(
      { ...payload, accessToken },
      config.accessTokenSecret,
      config.accessTokenExpireIn
    );

    return { accessToken, refreshToken };
  }

  async logout (id: string) {
    await this.prisma.customer.updateMany({
      where: {
        id,
        refreshToken: { not: null }
      },
      data: { refreshToken: null }
    });

    return { loggedOut: true };
  }

  async getNewTokens(id: string, oldRefreshToken: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });

    if (!customer) {
      throw new UnauthorizedException('Access Denied');
    }

    const doRefreshTohenMatch = customer.refreshToken === sha512(oldRefreshToken);

    if (!doRefreshTohenMatch) {
      throw new UnauthorizedException('Access Denied');
    }

    const { accessToken, refreshToken } = await this.createTokens(customer);

    await this.updateRefreshToken(customer.id, refreshToken);

    return { accessToken, refreshToken, customer };
  }

  private async updateRefreshToken(id: string, refreshToken: string) {
    await this.prisma.customer.update({
      where: {
        id
      },
      data: {
        refreshToken: sha512(refreshToken)
      }
    })
  }

  private async sign(payload: object, secret: string, expiresIn: string) {
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn
    });
  }

  private generateActivationCode(): string {
    return randomBytes(32).toString('hex');
  }
}
