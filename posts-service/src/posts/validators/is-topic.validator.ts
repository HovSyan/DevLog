import {
    registerDecorator,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidatorOptions,
} from 'class-validator';
import { POST_TOPICS } from 'src/constants';

@ValidatorConstraint({ name: 'IsTopic', async: false })
export class IsTopicConstraint implements ValidatorConstraintInterface {
    validate(value: any): boolean {
        // Check if the value is a valid topic ID
        return (
            typeof value === 'number' &&
            Object.values(POST_TOPICS).includes(value)
        );
    }

    defaultMessage(): string {
        const validValues = Object.values(POST_TOPICS);
        return `Invalid topic ID. Valid IDs are ${validValues[0]} to ${validValues.at(-1)!}.`;
    }
}

export function IsTopic(options?: ValidatorOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: options,
            constraints: [], // Add any constraints if needed
            validator: IsTopicConstraint,
        });
    };
}
