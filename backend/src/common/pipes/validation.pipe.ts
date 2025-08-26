import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      validateCustomDecorators: true,
    });

    if (errors.length > 0) {
      const errorMessages = this.formatValidationErrors(errors);
      throw new BadRequestException({
        message: errorMessages,
        error: 'Validation Failed',
      });
    }

    return object;
  }

  private toValidate(metatype: new (...args: any[]) => any): boolean {
    const types: (new (...args: any[]) => any)[] = [
      String,
      Boolean,
      Number,
      Array,
      Object,
    ];
    return !types.includes(metatype);
  }

  private formatValidationErrors(errors: any[]): string[] {
    const messages: string[] = [];

    const extractErrors = (error: any, parentProperty = '') => {
      const property = parentProperty
        ? `${parentProperty}.${error.property}`
        : error.property;

      if (error.constraints) {
        Object.values(error.constraints).forEach((message) => {
          messages.push(`${property}: ${String(message)}`);
        });
      }

      if (error.children && error.children.length > 0) {
        error.children.forEach((childError: any) => {
          extractErrors(childError, property);
        });
      }
    };

    errors.forEach((error) => extractErrors(error));

    return messages;
  }
}
