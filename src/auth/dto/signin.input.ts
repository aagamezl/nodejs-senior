import { InputType, Field } from '@nestjs/graphql';

import { SignUpInput } from './signup.input';

@InputType()
export class SignInInput extends SignUpInput { }
