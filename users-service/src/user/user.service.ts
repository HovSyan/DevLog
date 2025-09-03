import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm/repository/Repository';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private _repo: Repository<User>) {}

    async create(createUserDto: CreateUserDto) {
        const user = this._repo.create(createUserDto);
        const savedUser = await this._repo.save(user);
        return plainToInstance(CreateUserResponseDto, savedUser);
    }

    async findOne(id: string) {
        const user = await this._repo.findOne({ where: { id } });
        if (!user) throw new NotFoundException(`User with id ${id} not found`);
        return plainToInstance(CreateUserResponseDto, user);
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const result = await this._repo.update(id, updateUserDto);
        if (!result.affected) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        const updatedUser = await this._repo.findOne({ where: { id } });
        return plainToInstance(CreateUserResponseDto, updatedUser);
    }

    async remove(id: string) {
        const result = await this._repo.delete(id);
        if (!result.affected) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
    }
}
