import { Injectable, Logger } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportService {
    private _logger = new Logger(ReportService.name);

    createReport(createReportDto: CreateReportDto) {
        this._logger.log(createReportDto);
    }
}
