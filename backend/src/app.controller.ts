import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { AppService } from './app.service';

class TestDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsNotEmpty({ message: 'Name is required' })
  name!: string;
}

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'API is running' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('test-validation-error')
  @ApiOperation({ summary: 'Test validation error response' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  testValidationError(@Body() _: TestDto) {
    return { message: 'This should not be reached due to validation errors' };
  }

  @Get('test-400-error')
  @ApiOperation({ summary: 'Test 400 Bad Request error' })
  @ApiResponse({ status: 400, description: 'Bad request error' })
  test400Error() {
    throw new BadRequestException('This is a custom bad request error');
  }

  @Get('test-500-error')
  @ApiOperation({ summary: 'Test 500 Internal Server Error' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  test500Error() {
    throw new InternalServerErrorException(
      'This is a custom internal server error',
    );
  }

  @Get('test-unexpected-error')
  @ApiOperation({ summary: 'Test unexpected error handling' })
  @ApiResponse({ status: 500, description: 'Unexpected error' })
  testUnexpectedError() {
    // This will trigger our global error handler for unexpected errors
    throw new Error('This is an unexpected error');
  }
}
