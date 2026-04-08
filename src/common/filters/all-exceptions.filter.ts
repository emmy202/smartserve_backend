import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      this.logger.error(`Prisma Error [${exception.code}]: ${exception.message}`);
      this.logger.error(`Path: ${request.url}`);
      this.logger.error(`Body: ${JSON.stringify(request.body)}`);
      this.logger.error(`Params: ${JSON.stringify(request.params)}`);
      this.logger.error(`Meta: ${JSON.stringify(exception.meta)}`);
      message = `Database error: ${exception.message}`;
    } else if (exception instanceof Error) {
      this.logger.error(`Error: ${exception.message}`);
      this.logger.error(exception.stack);
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
