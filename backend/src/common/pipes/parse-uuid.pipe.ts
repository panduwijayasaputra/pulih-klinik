import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'uuid';

@Injectable()
export class ParseUuidPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!validate(value)) {
      throw new BadRequestException(
        `Invalid UUID format for parameter '${metadata.data}'. Expected a valid UUID v4.`,
      );
    }
    return value;
  }
}
