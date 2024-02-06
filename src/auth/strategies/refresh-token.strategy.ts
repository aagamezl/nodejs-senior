import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { JwtPayload } from '../interfaces/jwt-payload';
import { JwtPayloadRefreshToken } from '../interfaces/jwt-payload-refresh-token';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      ignoreExpiration: false,
      passReqToCallback: true
    });
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadRefreshToken {
    // const refreshToken = req?.get('authorization')?.replace('Bearer', '').trim();
    const refreshToken = req?.headers?.authorization?.replace('Bearer', '').trim();

     return {
      ...payload,
      refreshToken
     };
  }
}
