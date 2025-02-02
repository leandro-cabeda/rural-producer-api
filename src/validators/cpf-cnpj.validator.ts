import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsCpfCnpj(validationOptions?: ValidationOptions) {

  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsCpfCnpj',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return false;

          // Validação básica de CPF ou CNPJ
          return value.length === 11 || value.length === 14 || value.length === 18;
        },
        defaultMessage(args: ValidationArguments) {
          return 'CPF ou CNPJ inválido';
        },
      },
    });
  };
}
