import { ArgumentsHost, Catch, ExceptionFilter, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import { MongooseError } from 'mongoose';

type TExceptionResponse = {
  message: string;
  error: string;
  statusCode: number;
};

@Catch(MongooseError)
export class MongooseExceptionFilter implements ExceptionFilter {
  private readonly error: string = MongooseError.name;

  private defaultExceptionResponse: TExceptionResponse =
    new InternalServerErrorException().getResponse() as TExceptionResponse;

  private exceptionResponse: TExceptionResponse = this.defaultExceptionResponse;

  catch(exception: MongooseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    exception instanceof MongooseError;

    response.status(this.exceptionResponse.statusCode).json({
      ...this.exceptionResponse,
      error: this.error,
      message: exception.message,
    });
  }
}
