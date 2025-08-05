import { IsNotEmpty, IsString } from 'class-validator';

export class DecodedUserTokenDto {
    @IsString()
    @IsNotEmpty()
    email: string;
}
