import { PipeTransform, BadRequestException, ArgumentMetadata } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'

export const ERROR_MESSAGE_IN_THE_REQUEST = 'Houve um erro na requisição'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) { }

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      if (metadata.type === 'custom' || metadata.type === 'param') {
        return value
      }
      return this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: ERROR_MESSAGE_IN_THE_REQUEST,
          statusCode: 400,
          errors: fromZodError(error),
        })
      }

      throw new BadRequestException(ERROR_MESSAGE_IN_THE_REQUEST)
    }
  }
}