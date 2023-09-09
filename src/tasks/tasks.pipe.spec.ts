import { ArgumentMetadata, BadRequestException } from '@nestjs/common';

import { ParseTaskIDPipe } from '#tasks/tasks.pipe';

describe('TasksPipe', () => {
  let parseTaskPipe: ParseTaskIDPipe;

  const mockTaskID = '60f0f1b0f0f1b0f1b0f1b0f1';

  beforeEach(() => {
    parseTaskPipe = {
      transform: jest.fn().mockReturnValue(mockTaskID),
    };
  });

  it('should be defined', () => {
    expect(new ParseTaskIDPipe()).toBeDefined();
  });

  describe('ParseTaskIDPipe', () => {
    describe('when parse task id', () => {
      describe('and occur errors while parsing task id', () => {
        beforeEach(() => {
          jest.spyOn(parseTaskPipe, 'transform').mockRejectedValueOnce(new BadRequestException());
        });
        it('should throw BadRequestException', () => {
          expect(parseTaskPipe.transform('1', {} as ArgumentMetadata)).rejects.toThrowError(BadRequestException);
        });
      });
    });
    describe('and parse task id is successful', () => {
      it('should return task id', () => {
        expect(parseTaskPipe.transform(mockTaskID, null)).toEqual(mockTaskID);
      });
    });
  });
});
