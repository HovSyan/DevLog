import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportService } from './report.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateReportDto } from './dto/update-report.dto';
import { GetReportsQueryDto } from './dto/get-reports-query.dto';

@Controller('api/v1/reports')
@UseGuards(AuthGuard)
export class ReportController {
    constructor(private _reportService: ReportService) {}

    @Post()
    createReport(@Body() createReportDto: CreateReportDto) {
        return this._reportService.createReport(createReportDto);
    }

    @Put(':id')
    updateReport(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateReportDto: UpdateReportDto,
    ) {
        return this._reportService.updateReport(id, updateReportDto);
    }

    @Get(':id')
    getReport(@Param('id', ParseUUIDPipe) id: string) {
        return this._reportService.getReport(id);
    }

    @Delete(':id')
    @HttpCode(204)
    deleteReport(@Param('id', ParseUUIDPipe) id: string) {
        return this._reportService.deleteReport(id);
    }

    @Get()
    getReports(@Query() query: GetReportsQueryDto) {
        return this._reportService.getReports(query);
    }
}
