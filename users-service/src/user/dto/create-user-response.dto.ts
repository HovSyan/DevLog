import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateUserResponseDto {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    bio: string | null;

    @Expose()
    profilePhotoUrl: string | null;
}
