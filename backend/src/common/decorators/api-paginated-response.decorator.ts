import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

/**
 * Swagger decorator for paginated responses
 * @param model The model class for the data items
 * @param description Optional description for the response
 */
export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
  description?: string,
) => {
  return applyDecorators(
    ApiOkResponse({
      description: description || 'Paginated response',
      schema: {
        allOf: [
          {
            properties: {
              success: {
                type: 'boolean',
                example: true,
              },
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              message: {
                type: 'string',
                example: 'Data retrieved successfully',
              },
              meta: {
                type: 'object',
                properties: {
                  page: {
                    type: 'number',
                    example: 1,
                  },
                  pageSize: {
                    type: 'number',
                    example: 10,
                  },
                  totalItems: {
                    type: 'number',
                    example: 100,
                  },
                  totalPages: {
                    type: 'number',
                    example: 10,
                  },
                  hasNextPage: {
                    type: 'boolean',
                    example: true,
                  },
                  hasPreviousPage: {
                    type: 'boolean',
                    example: false,
                  },
                },
              },
            },
          },
        ],
      },
    }),
  );
};
