import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class DecodedUserTokenDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    uid: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(['admin', 'user'])
    role: string;
}
