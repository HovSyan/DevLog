import { Exclude, Expose, Type } from 'class-transformer';
import { GetReportResponseDto } from './get-report-response.dto';

@Exclude()
export class GetReportsResponseDto {
    @Expose()
    @Type(() => GetReportResponseDto)
    data: GetReportResponseDto[];
}
