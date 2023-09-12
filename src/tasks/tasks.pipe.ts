/* eslint-disable @typescript-eslint/no-unused-vars*/
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseTaskIDPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException('Invalid task ID');
    }
    return value;
  }
}
