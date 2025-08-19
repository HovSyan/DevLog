import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { Comment } from '../entities/comment.entity';
import { Repository } from 'typeorm';

@ValidatorConstraint({ async: true })
@Injectable()
export class CommentIdExistsConstraint implements ValidatorConstraintInterface {
    constructor(
        @InjectRepository(Comment)
        private _commentRepository: Repository<Comment>,
    ) {}

    validate(commentId: string) {
        return this._commentRepository.exists({ where: { id: commentId } });
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return `Comment with ID ${validationArguments?.value} does not exist`;
    }
}

export function CommentIdExists(options?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'postIdExists',
            target: object.constructor,
            propertyName: propertyName,
            options: options,
            validator: CommentIdExistsConstraint,
        });
    };
}
