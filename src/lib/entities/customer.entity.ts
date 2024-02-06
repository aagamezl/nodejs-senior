import { Field, ObjectType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

import { Base } from 'lib/entities/base.entity';

@ObjectType()
export class Customer extends Base {
  @Field(() => String)
  email: string;

  @Field(() => Role)
  role: string;

  @Field(() => String)
  activationCode: string;
}
