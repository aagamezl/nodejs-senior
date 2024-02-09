import { Field, ObjectType } from '@nestjs/graphql';

import { Customer } from 'src/lib/entities/customer.entity';

@ObjectType()
export class SignupResponse {
  @Field(() => String)
  activationCode: string;

  @Field(() => Customer)
  customer: Customer;
}
