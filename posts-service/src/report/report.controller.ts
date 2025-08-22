import { Body, Controller, Post } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportService } from './report.service';

@Controller('api/v1/reports')
export class ReportController {
    constructor(private _reportService: ReportService) {}

    @Post()
    createReport(@Body() createReportDto: CreateReportDto) {
        this._reportService.createReport(createReportDto);
    }
}
