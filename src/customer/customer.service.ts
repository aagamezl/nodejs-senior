import { Injectable } from '@nestjs/common';
import { Customer, Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma.service';
import { GetCustomerInput, WhereCustomerUniqueInput } from './dto/customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) { }

  async findAll(params: GetCustomerInput) {
    const { skip, take, cursor, where } = params;

    return this.prisma.customer.findMany({
      skip,
      take,
      cursor,
      where,
    });
  }

  async findUnique(where: WhereCustomerUniqueInput, select: Prisma.CustomerSelect = undefined) {
    return this.prisma.customer.findUnique({ where, select });
  }

  async delete(where: WhereCustomerUniqueInput) {
    return this.prisma.customer.delete({
      where
    });
  }

  async update(data: UpdateCustomerInput, where: WhereCustomerUniqueInput) {
    return this.prisma.customer.update({
      where,
      data
    });
  }
}
