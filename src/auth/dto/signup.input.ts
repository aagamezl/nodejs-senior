import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  @Length(8, 20)
  email: string;
  
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  password: string;
}
