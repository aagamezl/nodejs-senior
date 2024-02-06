import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { WhereCustomerUniqueInput } from './dto/customer.input';

@Injectable()
export class UniqueFilter implements PipeTransform<WhereCustomerUniqueInput> {
  transform(where: WhereCustomerUniqueInput) {
    if (!where.email && !where.id) {
      throw new BadRequestException('Provide either email or id');
    }

    if ((where.email && where.id)) {
      throw new BadRequestException('Provide either email or id, but not both.');
    }

    return where
  }
}

export default UniqueFilter
