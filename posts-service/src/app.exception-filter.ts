import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class AppGlobalExceptionFilter implements ExceptionFilter {
    private _logger = new Logger(AppGlobalExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        this._logger.error(exception);

        host.switchToHttp()
            .getResponse<Response>()
            .status(exception.getStatus())
            .json(exception.getResponse());
    }
}
