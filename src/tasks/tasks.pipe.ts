import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

import { MESSAGE } from '#/core/constants';

@Injectable()
export class ParseTaskIDPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException(MESSAGE.TASK.ERROR.INVALID_TASK_ID);
    }
    return value;
  }
}
