import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { CreateReportResponseDto } from './dto/create-report-response.dto';
import { GetReportResponseDto } from './dto/get-report-response.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { UpdateReportResponseDto } from './dto/update-report-response.dto';
import { GetReportsQueryDto } from './dto/get-reports-query.dto';
import { GetReportsResponseDto } from './dto/get-reports-response.dto';

@Injectable()
export class ReportService {
    private _logger = new Logger(ReportService.name);

    constructor(
        @InjectRepository(Report) private _reportRepository: Repository<Report>,
        @Inject('REQUEST') private _request: Request,
    ) {}

    async createReport(createReportDto: CreateReportDto) {
        const report = this._reportRepository.create(createReportDto);
        report.userId = this._request.user!.uid;
        const savedReport = await this._reportRepository.save(report);
        this._logger.log(createReportDto);
        return plainToInstance(CreateReportResponseDto, savedReport);
    }

    async getReport(id: Report['id']) {
        const report = await this._reportRepository.findOneBy({ id });
        if (!report) {
            throw new NotFoundException(`Report with ID ${id} not found`);
        }
        return plainToInstance(GetReportResponseDto, report);
    }

    async deleteReport(id: Report['id']) {
        const result = await this._reportRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Report with ID ${id} not found`);
        }
    }

    async updateReport(id: Report['id'], updateReportDto: UpdateReportDto) {
        const result = await this._reportRepository.update(id, updateReportDto);
        if (result.affected === 0) {
            throw new NotFoundException(`Report with ID ${id} not found`);
        }
        const updatedReport = await this._reportRepository.findOneBy({ id });
        return plainToInstance(UpdateReportResponseDto, updatedReport);
    }

    async getReports(query: GetReportsQueryDto) {
        const { postId, commentId } = query;
        const where: Record<string, string> = {};
        if (postId) {
            where.postId = postId;
        }
        if (commentId) {
            where.commentId = commentId;
        }
        const reports = await this._reportRepository.find({ where });
        return plainToInstance(GetReportsResponseDto, { data: reports });
    }
}
