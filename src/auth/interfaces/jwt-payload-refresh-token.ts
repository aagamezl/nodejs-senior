import { JwtPayload } from './jwt-payload';

export interface JwtPayloadRefreshToken extends JwtPayload {
  refreshToken: string;
}
