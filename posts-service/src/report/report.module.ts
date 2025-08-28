import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { Report } from './entities/report.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidatorsModule } from 'src/validators/validators.module';

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([Report]), ValidatorsModule],
    providers: [ReportService],
    controllers: [ReportController],
})
export class ReportModule {}
