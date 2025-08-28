import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { Comment } from '../comment/entities/comment.entity';
import { FindManyOptions, Repository } from 'typeorm';

export type CommentIdExistsOptions = {
    checkForPostId?: (object: any) => string;
};

@ValidatorConstraint({ async: true })
@Injectable()
export class CommentIdExistsConstraint implements ValidatorConstraintInterface {
    constructor(
        @InjectRepository(Comment)
        private _commentRepository: Repository<Comment>,
    ) {}

    validate(commentId: string, args: ValidationArguments) {
        const options = (args.constraints[0] || {}) as CommentIdExistsOptions;
        const where: FindManyOptions<Comment>['where'] = { id: commentId };
        if (options.checkForPostId) {
            where.postId = options.checkForPostId(args.object);
        }
        return this._commentRepository.exists({ where });
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return `Comment with ID ${validationArguments?.value} does not exist`;
    }
}

export function CommentIdExists(
    options?: CommentIdExistsOptions,
    validationOptions?: ValidationOptions,
) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'commentIdExists',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: CommentIdExistsConstraint,
        });
    };
}
