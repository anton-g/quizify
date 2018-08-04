import { PipeTransform, Injectable, ArgumentMetadata, HttpStatus, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseSocketDataPipe implements PipeTransform<any, any> {
  transform(value: any, metadata: ArgumentMetadata): any {
    if (Array.isArray(value)) {
      const [data, ack] = value
      return { data, ack }
    } else {
      return { data: value, ack: () => {} }
    }
  }
}
