import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { Post } from 'src/posts/entities/post.entity';
import { Repository } from 'typeorm';

@ValidatorConstraint({ async: true })
@Injectable()
export class PostIdExistsConstraint implements ValidatorConstraintInterface {
    constructor(
        @InjectRepository(Post) private _postRepository: Repository<Post>,
    ) {}

    validate(postId: string) {
        return this._postRepository.exists({ where: { id: postId } });
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return `Post with ID ${validationArguments?.value} does not exist`;
    }
}

export function PostIdExists(options?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'postIdExists',
            target: object.constructor,
            propertyName: propertyName,
            options: options,
            validator: PostIdExistsConstraint,
        });
    };
}
