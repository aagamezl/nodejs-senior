import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from '@prisma/client';

import UniqueFilter from './unique.filter.pipe';
import { Customer } from 'lib/entities/customer.entity';
import { CustomerService } from './customer.service';
import { GetCustomerInput, WhereCustomerUniqueInput } from './dto/customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { Roles } from 'src/auth/decorators/roles.decorator';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { AuthService } from 'src/auth/auth.service';
// import { LoginAuthInput } from 'src/auth/dto/login-auth.input';
// import { LoginResponse } from 'src/auth/dto/login.response';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) { }

  // @UseGuards(JwtAuthGuard)
  @Query(() => [Customer])
  async customers(@Args('data') { skip, take, where }: GetCustomerInput) {
    return this.customerService.findAll({ skip, take, where });
  }

  @Query(() => Customer)
  async customer(@Args('where', UniqueFilter) where: WhereCustomerUniqueInput) {
    return this.customerService.findUnique(where);
  }

  @Mutation(() => Boolean, { nullable: true })
  @Roles(Role.ADMIN)
  async deleteCustomer(
    @Args('where', UniqueFilter) where: WhereCustomerUniqueInput
  ): Promise<boolean> {
    await this.customerService.delete(where);

    return true;
  }

  @Mutation(() => Customer)
  @Roles(Role.ADMIN)
  async updateCustomer(
    @Args('data') data: UpdateCustomerInput,
    @Args('where', UniqueFilter) where: WhereCustomerUniqueInput
  ) {
    return this.customerService.update(data, where);
  }

  @Mutation(() => Boolean, { nullable: true })
  async activateAccount(@Args('activationCode') activationCode: string): Promise<boolean> {
    const customer = await this.customerService.activateAccount(activationCode);

    return !!customer;
  }
}
