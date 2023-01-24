import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class ErrorHandleDBService {
  private readonly logger = new Logger('ErrorHandleDBService');

  public errorHandleDBException(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      `Unexpected Error, Please check server logs. Details: ${error}`,
    );
  }
}
