import {
    registerDecorator,
    ValidationArguments,
    isNotEmpty,
} from 'class-validator';

export function AtLeastOneNotEmpty<T extends object>(...props: (keyof T)[]) {
    return function (object: T, propertyName: string) {
        registerDecorator({
            name: 'AtLeastOneNotEmpty',
            target: object.constructor,
            propertyName: propertyName,
            constraints: props,
            options: {
                message: `At least one of [${props.join(', ')}] must be provided.`,
            },
            validator: {
                validate: (_: unknown, args: ValidationArguments) => {
                    const object = args.object as T;
                    return props
                        .map((prop: keyof T) => object[prop])
                        .some(isNotEmpty);
                },
            },
        });
    };
}
