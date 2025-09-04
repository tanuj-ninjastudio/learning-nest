import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class AgePipe implements PipeTransform {
  transform(value: any) {
    const age = Number(value);
    if (isNaN(age) || age < 18) {
      throw new BadRequestException('Age must be a number and at least 18');
    }
    return age;
  }
}
