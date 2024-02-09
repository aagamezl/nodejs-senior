import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-customer.decorator';
import { NewTokensResponse } from './dto/new-tokens.response';
import { Public } from './decorators/public.decorator';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { SignInInput } from './dto/signin.input';
import { SigninResponse } from './dto/signin.response';
import { SignUpInput } from './dto/signup.input';
import { JwtPayloadRefreshToken } from './interfaces/jwt-payload-refresh-token';
import { LogoutResponse } from './dto/logout.response';
import { Customer } from 'src/lib/entities/customer.entity';
import { SignupResponse } from './dto/signup.response';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }
  
  @Public()
  @Mutation(() => Boolean, { nullable: true })
  async activateAccount(@Args('activationCode') activationCode: string): Promise<boolean> {
    const customer = await this.authService.activateAccount(activationCode);

    return !!customer;
  }

  @Public()
  @Mutation(() => SigninResponse)
  signIn(@Args('signInInput') signInInput: SignInInput) {
    return this.authService.signIn(signInInput);
  }

  @Public()
  @Mutation(() => Customer)
  signUp(@Args('signUpInput') signUpInput: SignUpInput) {
    return this.authService.signUp(signUpInput);
  }

  @Public()
  @Mutation(() => LogoutResponse)
  logout(@Args('id', { type: () => String }) id: string) {
    return this.authService.logout(id);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => NewTokensResponse)
  getNewTokens(
    // @CurrentUser('id') id: string,
    // @CurrentUser('refreshToken') refreshToken: string,
    @CurrentUser() { id, refreshToken }: JwtPayloadRefreshToken
  ) {
    return this.authService.getNewTokens(id, refreshToken);
  }

  @Query(() => String)
  hello() {
    return 'Hello World!';
  }
}
