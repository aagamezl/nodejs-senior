import { Field, ObjectType } from '@nestjs/graphql';

import { Customer } from 'src/lib/entities/customer.entity';

@ObjectType()
export class SignResponse {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;

  @Field(() => Customer)
  customer: Customer;
}
