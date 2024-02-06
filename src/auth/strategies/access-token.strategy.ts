import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      ignoreExpiration: false,
    });
  }

  validate(payload: JwtPayload) {
    return payload;
    // const user = await this.authService.validateJwtPayload(payload);

    // if (!user) {
    //   throw new UnauthorizedException(
    //     'Could not log-in with the provided credentials',
    //   );
    // }

    // return user;
  }
}
