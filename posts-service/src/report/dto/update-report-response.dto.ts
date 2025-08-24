import { Exclude } from 'class-transformer';
import { GetReportResponseDto } from './get-report-response.dto';

@Exclude()
export class UpdateReportResponseDto extends GetReportResponseDto {}
