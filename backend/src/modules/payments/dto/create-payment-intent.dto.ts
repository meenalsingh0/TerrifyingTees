import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRazorpayOrderDto {
  @ApiProperty({ example: 'order-uuid-123', description: 'Order ID from your database' })
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty({ example: 499.99, description: 'Amount in major currency unit (e.g. rupees, not paise)' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'INR', description: 'Currency code', required: false })
  @IsOptional()
  @IsString()
  currency?: string = 'INR';

  @ApiProperty({ example: 'Order payment', description: 'Payment description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
